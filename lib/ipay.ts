import "server-only";
import crypto from "node:crypto";

/**
 * iPay (Sri Lanka) web payments.
 *
 * The gateway is an HTML form POST: the browser posts our order details to
 * iPay's hosted checkout, the customer pays there, iPay POSTs the result to our
 * callback server-to-server, and only then redirects the customer back to us.
 * See the iPay Web Payments Integration Document for the field list.
 *
 * IPAY_SECRET must never reach the browser. `merchantWebToken` does appear in
 * the DOM — that is how the gateway works, and it is only an identifier — but
 * the secret is what signs amounts, so it stays on the server. The
 * `server-only` import above turns any client import of this file into a build
 * error.
 */

const SANDBOX_CHECKOUT_URL = "https://sandbox.ipay.lk/ipg/checkout";
const LIVE_CHECKOUT_URL = "https://ipay.lk/ipg/checkout";

export interface IpayConfig {
  merchantToken: string;
  secret: string;
  checkoutUrl: string;
  isLive: boolean;
}

/**
 * Read lazily rather than at module load: a build or an unrelated page render
 * must not crash just because iPay is not configured yet. Cash on Delivery has
 * to keep working with no credentials at all.
 */
export const getIpayConfig = (): IpayConfig => {
  const merchantToken = process.env.IPAY_MERCHANT_TOKEN;
  const secret = process.env.IPAY_SECRET;

  if (!merchantToken || !secret) {
    throw new Error(
      "iPay is not configured — set IPAY_MERCHANT_TOKEN and IPAY_SECRET."
    );
  }

  const isLive = process.env.IPAY_ENV === "live";
  const checkoutUrl =
    process.env.IPAY_CHECKOUT_URL ||
    (isLive ? LIVE_CHECKOUT_URL : SANDBOX_CHECKOUT_URL);

  return { merchantToken, secret, checkoutUrl, isLive };
};

export const isIpayConfigured = (): boolean =>
  Boolean(process.env.IPAY_MERCHANT_TOKEN && process.env.IPAY_SECRET);

const hmacBase64 = (message: string, secret: string): string =>
  crypto.createHmac("sha256", secret).update(message, "utf8").digest("base64");

/**
 * Checkout form checksum (iPay "Additional Security"):
 *   message = IPG Integration Token + Order ID + Transaction Amount
 *
 * `totalAmount` must be the exact string sent in the form — formatting it
 * differently here than in the form field produces a checksum iPay rejects.
 */
export const computeRequestChecksum = (
  merchantToken: string,
  orderId: string,
  totalAmount: string,
  secret: string
): string => hmacBase64(`${merchantToken}${orderId}${totalAmount}`, secret);

export interface IpayCallbackPayload {
  transactionReference: string;
  orderId: string;
  transactionAmount: string;
  creditedAmount?: string;
  transactionStatus: string;
  transactionMessage?: string;
  transactionTimeInMillis: string;
  merchantParam1?: string;
  merchantParam2?: string;
  checksum?: string;
}

/**
 * Callback checksum (spec §5.3):
 *   message = transactionReference + orderId + transactionTimeInMillis
 *           + transactionAmount + transactionStatus
 *
 * Verified over the raw received strings — re-formatting a number before
 * hashing it would break a signature that is actually valid.
 */
export const verifyCallbackChecksum = (
  payload: IpayCallbackPayload,
  secret: string
): boolean => {
  if (!payload.checksum) return false;

  const message = [
    payload.transactionReference,
    payload.orderId,
    payload.transactionTimeInMillis,
    payload.transactionAmount,
    payload.transactionStatus,
  ].join("");

  const expected = hmacBase64(message, secret);

  // timingSafeEqual throws when lengths differ, so compare lengths first.
  if (payload.checksum.length !== expected.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(payload.checksum),
    Buffer.from(expected)
  );
};

export type IpayOutcome = "accepted" | "pending" | "declined" | "unknown";

/**
 * A = Accepted, P = Pending (customer debited, settles to the merchant at end
 * of day), D = Decline. Anything else is treated as unknown and left for a
 * human rather than guessed at.
 */
export const mapTransactionStatus = (status: string): IpayOutcome => {
  switch (status?.trim().toUpperCase()) {
    case "A":
      return "accepted";
    case "P":
      return "pending";
    case "D":
      return "declined";
    default:
      return "unknown";
  }
};

export interface BuildCheckoutFieldsInput {
  orderNumber: string;
  orderDocumentId: string;
  totalPrice: number;
  customerName: string;
  email: string;
  phone: string;
  baseUrl: string;
  lookupToken: string;
  itemCount: number;
}

export interface IpayCheckoutForm {
  actionUrl: string;
  fields: Record<string, string>;
}

const truncate = (value: string | undefined, max: number): string =>
  (value ?? "").trim().slice(0, max);

export const buildCheckoutFields = ({
  orderNumber,
  orderDocumentId,
  totalPrice,
  customerName,
  email,
  phone,
  baseUrl,
  lookupToken,
  itemCount,
}: BuildCheckoutFieldsInput): IpayCheckoutForm => {
  const { merchantToken, secret, checkoutUrl } = getIpayConfig();

  // This exact string is both posted and signed.
  const totalAmount = totalPrice.toFixed(2);

  const query = `orderNumber=${encodeURIComponent(orderNumber)}&t=${encodeURIComponent(lookupToken)}`;

  const fields: Record<string, string> = {
    merchantWebToken: merchantToken,
    orderId: orderNumber,
    totalAmount,
    orderDescription: `NUZII order ${orderNumber} (${itemCount} item${itemCount === 1 ? "" : "s"})`,
    returnUrl: `${baseUrl}/success?${query}`,
    cancelUrl: `${baseUrl}/checkout/cancelled?${query}`,
    customerName: truncate(customerName, 250),
    customerEmail: truncate(email, 100),
    // iPay documents every field as alphanumeric, so strip formatting rather
    // than send "+94 76 253 7608".
    customerPhone: (phone ?? "").replace(/\D/g, "").slice(0, 15),
    // A lookup hint for the callback. Never trusted as authorisation — it is
    // echoed back outside the signed message.
    merchantParam1: truncate(orderDocumentId, 200),
    merchantParam2: "v1",
    // paymentMethod deliberately omitted so iPay offers every scheme the
    // merchant account has enabled (Visa, Mastercard, iPay, LankaQR).
  };

  fields.checksum = computeRequestChecksum(
    merchantToken,
    orderNumber,
    totalAmount,
    secret
  );

  return { actionUrl: checkoutUrl, fields };
};
