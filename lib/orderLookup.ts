import "server-only";
import crypto from "node:crypto";

/**
 * Order numbers travel in URLs (iPay's returnUrl, browser history, emails), so
 * they cannot be the only thing standing between a stranger and a customer's
 * order. Every order page requires a matching lookup token alongside the order
 * number.
 *
 * The token is a keyed digest of the order number rather than a stored random
 * value: nothing extra to persist, nothing extra to look up, and it stays valid
 * for the life of the order so confirmation-email links keep working.
 */
const getSecret = (): string => {
  const secret = process.env.ORDER_LOOKUP_SECRET;
  if (!secret) {
    throw new Error(
      "ORDER_LOOKUP_SECRET is not set — order confirmation links cannot be signed."
    );
  }
  return secret;
};

export const createOrderLookupToken = (orderNumber: string): string =>
  crypto
    .createHmac("sha256", getSecret())
    .update(orderNumber)
    .digest("hex")
    .slice(0, 20);

export const verifyOrderLookupToken = (
  orderNumber: string | null | undefined,
  token: string | null | undefined
): boolean => {
  if (!orderNumber || !token) return false;

  let expected: string;
  try {
    expected = createOrderLookupToken(orderNumber);
  } catch (error) {
    console.error("[orderLookup] cannot verify token:", error);
    return false;
  }

  // timingSafeEqual throws on a length mismatch, so guard first.
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
};
