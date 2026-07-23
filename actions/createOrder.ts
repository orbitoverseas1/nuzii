"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { getDiscountedPrice } from "@/lib/productPricing";
import {
  sendAdminOrderEmail,
  sendCustomerOrderEmail,
  type OrderEmailData,
} from "@/lib/orderEmails";
import { GroupedCartItems } from "./checkoutTypes";

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postalCode?: string;
  country: string;
}

export interface ShippingMethod {
  title: string;
  cost: number;
}

export interface CheckoutDetails {
  customerName: string;
  email: string;
  phone: string;
  userId?: string;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
}

const lineBasePrice = (item: GroupedCartItems) =>
  item.selectedVariant?.priceOverride ?? item.product.price ?? 0;

// Human-friendly order number: NZ-YYMMDD-XXXX (date + 4 random digits).
const generateOrderNumber = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `NZ-${yy}${mm}${dd}-${rand}`;
};

export async function createOrder(
  items: GroupedCartItems[],
  details: CheckoutDetails
) {
  if (!items.length) {
    throw new Error("Cart is empty");
  }

  const itemsWithoutPrice = items.filter((item) => !lineBasePrice(item));
  if (itemsWithoutPrice.length > 0) {
    throw new Error("Some items do not have a price");
  }

  const subtotal = items.reduce(
    (total, item) => total + lineBasePrice(item) * item.quantity,
    0
  );
  const discountedTotal = items.reduce(
    (total, item) =>
      total +
      getDiscountedPrice(lineBasePrice(item), item.product.discount) *
        item.quantity,
    0
  );
  const amountDiscount = subtotal - discountedTotal;
  const totalPrice = discountedTotal + details.shippingMethod.cost;
  const orderNumber = generateOrderNumber();

  const transaction = backendClient.transaction();

  transaction.create({
    _type: "order",
    orderNumber,
    clerkUserId: details.userId ?? "",
    customerName: details.customerName,
    email: details.email,
    phone: details.phone,
    shippingAddress: details.shippingAddress,
    shippingMethod: details.shippingMethod,
    products: items.map((item) => ({
      _key: crypto.randomUUID(),
      product: { _type: "reference", _ref: item.product._id },
      quantity: item.quantity,
      variantColor: item.selectedVariant?.color,
      variantSize: item.selectedVariant?.size,
      variantSku: item.selectedVariant?.sku,
    })),
    totalPrice,
    currency: "lkr",
    amountDiscount,
    status: "pending",
    orderDate: new Date().toISOString(),
  });

  for (const item of items) {
    const variantKey = item.selectedVariant?._key;
    if (variantKey) {
      transaction.patch(item.product._id, (patch) =>
        patch.dec({
          [`variants[_key=="${variantKey}"].stock`]: item.quantity,
        })
      );
    } else if (typeof item.product.stock === "number") {
      transaction.patch(item.product._id, (patch) =>
        patch.dec({ stock: item.quantity })
      );
    }
  }

  const result = await transaction.commit();
  const order = result.results.find((r) => r.operation === "create");

  // Fire confirmation emails. The order is already committed, so a mail
  // failure must never throw — swallow and log instead.
  try {
    const emailData: OrderEmailData = {
      orderNumber,
      customerName: details.customerName,
      email: details.email,
      phone: details.phone,
      shippingAddress: details.shippingAddress,
      shippingMethod: details.shippingMethod,
      lines: items.map((item) => {
        const variantLabel = [item.selectedVariant?.color, item.selectedVariant?.size]
          .filter(Boolean)
          .join(" / ");
        return {
          name: item.product.name ?? "Product",
          variantLabel: variantLabel || undefined,
          quantity: item.quantity,
          lineTotal:
            getDiscountedPrice(lineBasePrice(item), item.product.discount) *
            item.quantity,
        };
      }),
      subtotal,
      amountDiscount,
      shippingCost: details.shippingMethod.cost,
      totalPrice,
      currency: "lkr",
    };

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

  return { orderNumber, orderId: order?.id };
}
