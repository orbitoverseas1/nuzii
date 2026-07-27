import "server-only";
import { backendClient } from "@/sanity/lib/backendClient";
import { verifyOrderLookupToken } from "@/lib/orderLookup";

/**
 * The customer-facing view of an order.
 *
 * Two deliberate constraints:
 *
 * 1. Requires the signed lookup token. Order numbers travel through URLs,
 *    browser history and emails, so knowing one must not be enough to read
 *    somebody's order.
 * 2. Projects only what the page renders — no email, no phone, no street
 *    address. Even a valid token shouldn't hand back a full contact record.
 *
 * Reads go through `backendClient` (never the CDN client): the whole point of
 * this page is to show a payment status that may have changed seconds ago.
 */

export interface CustomerOrderView {
  orderNumber: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  totalPrice?: number;
  currency?: string;
  shippingCity?: string;
  shippingMethodTitle?: string;
  lines: Array<{
    _key: string;
    productName?: string;
    quantity?: number;
    variantColor?: string;
    variantSize?: string;
    lineTotal?: number;
  }>;
}

const CUSTOMER_ORDER_QUERY = `*[_type == "order" && orderNumber == $orderNumber][0]{
  orderNumber,
  status,
  paymentStatus,
  paymentMethod,
  totalPrice,
  currency,
  "shippingCity": shippingAddress.city,
  "shippingMethodTitle": shippingMethod.title,
  "lines": products[]{ _key, productName, quantity, variantColor, variantSize, lineTotal }
}`;

export const getCustomerOrderView = async (
  orderNumber: string | undefined,
  token: string | undefined
): Promise<CustomerOrderView | null> => {
  if (!verifyOrderLookupToken(orderNumber, token)) return null;

  const order = await backendClient.fetch<CustomerOrderView | null>(
    CUSTOMER_ORDER_QUERY,
    { orderNumber }
  );

  return order ?? null;
};
