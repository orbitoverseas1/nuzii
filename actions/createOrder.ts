"use server";

import crypto from "node:crypto";
import { backendClient } from "@/sanity/lib/backendClient";
import {
  sendAdminOrderEmail,
  sendCustomerOrderEmail,
} from "@/lib/orderEmails";
import { buildOrderEmailData } from "@/lib/orderEmailData";
import {
  OrderPricingError,
  priceOrder,
  toCents,
  type CheckoutLineInput,
  type PricedOrder,
} from "@/lib/orderPricing";
import { buildCheckoutFields } from "@/lib/ipay";
import { createOrderLookupToken } from "@/lib/orderLookup";
import { getSiteUrl } from "@/lib/siteUrl";

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postalCode?: string;
  country: string;
}

export type PaymentMethod = "ipay" | "cod";

export interface CreateOrderInput {
  lines: CheckoutLineInput[];
  shippingMethodId: string;
  paymentMethod: PaymentMethod;
  /** Total the customer was shown. The server re-prices and refuses to differ. */
  expectedTotal: number;
  customerName: string;
  email: string;
  phone: string;
  userId?: string;
  shippingAddress: ShippingAddress;
}

export type CreateOrderResult =
  | { kind: "cod"; orderNumber: string; lookupToken: string }
  | {
      kind: "ipay";
      orderNumber: string;
      lookupToken: string;
      actionUrl: string;
      fields: Record<string, string>;
    }
  | {
      kind: "error";
      code: "PRICE_CHANGED" | "OUT_OF_STOCK" | "INVALID_CART" | "PAYMENT_UNAVAILABLE" | "FAILED";
      message: string;
    };

/**
 * Human-friendly order number: NZ + YYMMDD + 6 random Crockford base32 chars,
 * e.g. NZ2607269K4XQ2.
 *
 * Alphanumeric on purpose — iPay documents every parameter as alphanumeric, and
 * a separator stripped anywhere on their side would change the string the
 * payment checksum was built over and orphan the callback. The random suffix is
 * wide enough (~1 in a billion per day) that a collision cannot land one
 * customer's payment on another customer's order.
 */
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const generateOrderNumber = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += CROCKFORD[crypto.randomInt(CROCKFORD.length)];
  }
  return `NZ${yy}${mm}${dd}${suffix}`;
};

const generateUniqueOrderNumber = async (): Promise<string> => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateOrderNumber();
    const taken = await backendClient.fetch<boolean>(
      `defined(*[_type == "order" && orderNumber == $orderNumber][0]._id)`,
      { orderNumber: candidate }
    );
    if (!taken) return candidate;
    console.warn("[createOrder] order number collision, retrying:", candidate);
  }
  throw new Error("Could not allocate a unique order number.");
};

const buildOrderDocument = (
  priced: PricedOrder,
  input: CreateOrderInput,
  orderNumber: string
) => ({
  _type: "order" as const,
  orderNumber,
  clerkUserId: input.userId ?? "",
  customerName: input.customerName,
  email: input.email,
  phone: input.phone,
  shippingAddress: input.shippingAddress,
  shippingMethod: {
    title: priced.shippingMethod.title,
    cost: priced.shippingMethod.cost,
  },
  paymentMethod: input.paymentMethod,
  // COD takes no payment online, so there is nothing for the gateway callback
  // to resolve. iPay orders stay "awaiting_payment" until the callback lands.
  paymentStatus:
    input.paymentMethod === "cod"
      ? ("not_required" as const)
      : ("awaiting_payment" as const),
  products: priced.lines.map((line) => ({
    _key: crypto.randomUUID(),
    product: { _type: "reference" as const, _ref: line.productId },
    quantity: line.quantity,
    variantColor: line.variantColor,
    variantSize: line.variantSize,
    variantSku: line.variantSku,
    // Kept so a failed payment can put stock back on exactly the variant it
    // was taken from.
    variantKey: line.variantKey,
    // Captured at purchase time so the order — and the confirmation email the
    // callback rebuilds from it — never drifts with the live product.
    productName: line.productName,
    unitPrice: line.unitPrice,
    lineTotal: line.lineTotal,
  })),
  subtotal: priced.subtotal,
  totalPrice: priced.totalPrice,
  currency: "lkr",
  amountDiscount: priced.amountDiscount,
  status: "pending" as const,
  orderDate: new Date().toISOString(),
});

export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  // 1. Re-price from Sanity. Nothing the browser said about money is trusted.
  let priced: PricedOrder;
  try {
    priced = await priceOrder(input.lines, input.shippingMethodId);
  } catch (error) {
    if (error instanceof OrderPricingError) {
      return { kind: "error", code: error.code, message: error.message };
    }
    console.error("[createOrder] pricing failed:", error);
    return {
      kind: "error",
      code: "FAILED",
      message: "We couldn't price your order. Please try again.",
    };
  }

  // 2. Refuse to charge an amount the customer did not agree to.
  if (toCents(priced.totalPrice) !== toCents(input.expectedTotal)) {
    return {
      kind: "error",
      code: "PRICE_CHANGED",
      message:
        "Prices in your cart have changed. Please review your order total and try again.",
    };
  }

  // 3. Fail before writing anything if iPay was chosen but isn't configured —
  //    an order stuck in awaiting_payment with no way to pay helps nobody.
  if (input.paymentMethod === "ipay") {
    try {
      getSiteUrl();
      createOrderLookupToken("preflight");
    } catch (error) {
      console.error("[createOrder] iPay preflight failed:", error);
      return {
        kind: "error",
        code: "PAYMENT_UNAVAILABLE",
        message:
          "Online payment is temporarily unavailable. Please choose Cash on Delivery.",
      };
    }
  }

  const orderNumber = await generateUniqueOrderNumber();

  // 4. Create the order and reserve stock in one transaction. Stock is held
  //    from this moment for both rails; a declined iPay payment gives it back
  //    (see the notify route). Reserving late would let two customers pay for
  //    the same last unit, and iPay has no refund API.
  const orderDocument = buildOrderDocument(priced, input, orderNumber);

  const transaction = backendClient.transaction();
  transaction.create(orderDocument);

  for (const line of priced.lines) {
    if (!line.hasTrackedStock) continue;
    transaction.patch(line.productId, (patch) =>
      line.variantKey
        ? patch.dec({
            [`variants[_key=="${line.variantKey}"].stock`]: line.quantity,
          })
        : patch.dec({ stock: line.quantity })
    );
  }

  let orderDocumentId: string;
  try {
    const result = await transaction.commit();
    const created = result.results.find((r) => r.operation === "create");
    if (!created?.id) throw new Error("Order create returned no document id.");
    orderDocumentId = created.id;
  } catch (error) {
    console.error("[createOrder] transaction failed:", error);
    return {
      kind: "error",
      code: "FAILED",
      message: "We couldn't place your order. Please try again.",
    };
  }

  const lookupToken = createOrderLookupToken(orderNumber);

  // 5a. iPay: hand the browser a signed form to POST. No email yet — never
  //     confirm an order nobody has paid for. The callback sends it.
  if (input.paymentMethod === "ipay") {
    try {
      const { actionUrl, fields } = buildCheckoutFields({
        orderNumber,
        orderDocumentId,
        totalPrice: priced.totalPrice,
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        baseUrl: getSiteUrl(),
        lookupToken,
        itemCount: priced.itemCount,
      });
      return { kind: "ipay", orderNumber, lookupToken, actionUrl, fields };
    } catch (error) {
      // The order exists and stock is reserved, so surface it as a payment
      // problem rather than losing the order silently.
      console.error(
        `[createOrder] could not build iPay checkout for ${orderNumber}:`,
        error
      );
      return {
        kind: "error",
        code: "PAYMENT_UNAVAILABLE",
        message:
          "We couldn't reach the payment gateway. Please try again or choose Cash on Delivery.",
      };
    }
  }

  // 5b. Cash on Delivery: nothing to collect online, so confirm immediately.
  //     The order is already committed — a mail failure must never throw.
  try {
    const emailData = buildOrderEmailData(orderDocument, "cod");
    const results = await Promise.allSettled([
      sendCustomerOrderEmail(emailData),
      sendAdminOrderEmail(emailData),
    ]);
    results.forEach((r) => {
      if (r.status === "rejected") {
        console.error("[createOrder] order email failed:", r.reason);
      }
    });
  } catch (error) {
    console.error("[createOrder] error preparing order emails:", error);
  }

  return { kind: "cod", orderNumber, lookupToken };
}
