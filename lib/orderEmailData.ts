import "server-only";
import type { OrderEmailData, OrderEmailVariant } from "@/lib/orderEmails";
import { createOrderLookupToken } from "@/lib/orderLookup";
import { getSiteUrl } from "@/lib/siteUrl";

/**
 * Builds the confirmation-email payload from a *persisted* order rather than
 * from the cart, so the iPay callback — which never sees a cart — can send the
 * same emails as the Cash on Delivery path.
 */

export interface OrderEmailSourceLine {
  productName?: string;
  variantColor?: string;
  variantSize?: string;
  quantity?: number;
  lineTotal?: number;
}

export interface OrderEmailSource {
  orderNumber?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  shippingMethod?: { title?: string; cost?: number };
  products?: OrderEmailSourceLine[];
  subtotal?: number;
  amountDiscount?: number;
  totalPrice?: number;
  currency?: string;
}

export const buildOrderEmailData = (
  order: OrderEmailSource,
  variant: OrderEmailVariant
): OrderEmailData => {
  const orderNumber = order.orderNumber ?? "";

  // A missing ORDER_LOOKUP_SECRET must not stop a confirmation email going out
  // — drop the link instead.
  let orderUrl: string | undefined;
  try {
    const token = createOrderLookupToken(orderNumber);
    orderUrl = `${getSiteUrl()}/success?orderNumber=${encodeURIComponent(
      orderNumber
    )}&t=${encodeURIComponent(token)}`;
  } catch (error) {
    console.warn("[orderEmailData] omitting order link:", error);
  }

  const shippingCost = order.shippingMethod?.cost ?? 0;

  return {
    orderNumber,
    customerName: order.customerName ?? "there",
    email: order.email ?? "",
    phone: order.phone ?? "",
    shippingAddress: {
      line1: order.shippingAddress?.line1 ?? "",
      line2: order.shippingAddress?.line2,
      city: order.shippingAddress?.city ?? "",
      postalCode: order.shippingAddress?.postalCode,
      country: order.shippingAddress?.country ?? "Sri Lanka",
    },
    shippingMethod: {
      title: order.shippingMethod?.title ?? "Delivery",
      cost: shippingCost,
    },
    lines: (order.products ?? []).map((line) => {
      const variantLabel = [line.variantColor, line.variantSize]
        .filter(Boolean)
        .join(" / ");
      return {
        name: line.productName ?? "Product",
        variantLabel: variantLabel || undefined,
        quantity: line.quantity ?? 1,
        lineTotal: line.lineTotal ?? 0,
      };
    }),
    subtotal: order.subtotal ?? 0,
    amountDiscount: order.amountDiscount ?? 0,
    shippingCost,
    totalPrice: order.totalPrice ?? 0,
    currency: order.currency ?? "lkr",
    variant,
    orderUrl,
  };
};
