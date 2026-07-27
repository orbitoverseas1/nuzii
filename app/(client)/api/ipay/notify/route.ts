import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import {
  getIpayConfig,
  mapTransactionStatus,
  verifyCallbackChecksum,
  type IpayCallbackPayload,
} from "@/lib/ipay";
import { toCents } from "@/lib/orderPricing";
import { buildOrderEmailData } from "@/lib/orderEmailData";
import {
  sendAdminOrderEmail,
  sendCustomerOrderEmail,
  type OrderEmailVariant,
} from "@/lib/orderEmails";

/**
 * iPay payment notification.
 *
 * Register this URL (https://<your-domain>/api/ipay/notify) as the "Call back
 * API URL" in the iPay merchant portal.
 *
 * This is the *only* thing that marks an order paid — the customer's browser is
 * never trusted with that. iPay holds the customer on a spinner until we answer
 * and only redirects them to returnUrl once we return HTTP 200, so this handler
 * must be fast and must answer 200 for anything it has durably recorded.
 * A non-200 means "retry me".
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_TIMEOUT_MS = 4000;

const noStore = { "Cache-Control": "no-store" };

const json = (body: unknown, status: number) =>
  NextResponse.json(body, { status, headers: noStore });

const ORDER_QUERY = `*[_type == "order" && orderNumber == $orderNumber][0]{
  _id, _rev, orderNumber, customerName, email, phone,
  shippingAddress, shippingMethod, subtotal, totalPrice, currency, amountDiscount,
  paymentStatus, paymentGatewayReference, stockRestored, status,
  products[]{ _key, productName, quantity, variantColor, variantSize, variantKey,
    lineTotal, "productId": product._ref }
}`;

interface OrderLine {
  _key: string;
  productName?: string;
  quantity?: number;
  variantColor?: string;
  variantSize?: string;
  variantKey?: string;
  lineTotal?: number;
  productId?: string;
}

interface OrderDoc {
  _id: string;
  _rev: string;
  orderNumber?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  shippingAddress?: Record<string, string | undefined>;
  shippingMethod?: { title?: string; cost?: number };
  subtotal?: number;
  totalPrice?: number;
  currency?: string;
  amountDiscount?: number;
  paymentStatus?: string;
  paymentGatewayReference?: string;
  stockRestored?: boolean;
  status?: string;
  products?: OrderLine[];
}

const TERMINAL_PAYMENT_STATES = new Set([
  "paid",
  "pending_settlement",
  "failed",
  "cancelled",
]);

const parseBody = (raw: string, contentType: string): Record<string, string> => {
  if (contentType.includes("application/json")) {
    return JSON.parse(raw) as Record<string, string>;
  }
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(raw));
  }
  // Content-Type is not guaranteed; try JSON, then form encoding.
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return Object.fromEntries(new URLSearchParams(raw));
  }
};

const str = (value: unknown): string =>
  value === undefined || value === null ? "" : String(value);

/**
 * Return a failed order's stock to inventory — the exact mirror of the dec()
 * in createOrder, keyed on the same variant _key.
 */
const restoreStock = (
  transaction: ReturnType<typeof backendClient.transaction>,
  order: OrderDoc
) => {
  for (const line of order.products ?? []) {
    const quantity = line.quantity;
    if (!line.productId || !quantity) continue;
    transaction.patch(line.productId, (patch) =>
      line.variantKey
        ? patch.inc({ [`variants[_key=="${line.variantKey}"].stock`]: quantity })
        : patch.inc({ stock: quantity })
    );
  }
};

const sendEmails = async (order: OrderDoc, variant: OrderEmailVariant) => {
  const data = buildOrderEmailData(order, variant);
  await Promise.race([
    Promise.allSettled([
      sendCustomerOrderEmail(data),
      sendAdminOrderEmail(data),
    ]).then((results) =>
      results.forEach((r) => {
        if (r.status === "rejected") {
          console.error("[ipay:notify] email failed:", r.reason);
        }
      })
    ),
    // iPay is holding the customer's browser and this runs as a serverless
    // function with a hard timeout — a slow mail provider must not cost us the
    // 200 that releases the customer.
    new Promise((resolve) => setTimeout(resolve, EMAIL_TIMEOUT_MS)),
  ]);
};

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  let orderIdForLog = "";
  let outcome = "unhandled";
  let transactionStatus = "";
  let transactionReference = "";
  let amountOk: boolean | undefined;

  try {
    const raw = await req.text();
    const parsed = parseBody(raw, req.headers.get("content-type") ?? "");

    const payload: IpayCallbackPayload = {
      transactionReference: str(parsed.transactionReference),
      orderId: str(parsed.orderId),
      transactionAmount: str(parsed.transactionAmount),
      creditedAmount: str(parsed.creditedAmount),
      transactionStatus: str(parsed.transactionStatus),
      transactionMessage: str(parsed.transactionMessage),
      transactionTimeInMillis: str(parsed.transactionTimeInMillis),
      merchantParam1: str(parsed.merchantParam1),
      merchantParam2: str(parsed.merchantParam2),
      checksum: str(parsed.checksum),
    };

    orderIdForLog = payload.orderId;
    transactionStatus = payload.transactionStatus;
    transactionReference = payload.transactionReference;

    if (!payload.orderId || !payload.transactionStatus) {
      outcome = "bad-request";
      return json({ status: "error", message: "Missing required fields" }, 400);
    }

    // 1. Authenticate before touching anything. This request arrives with no
    //    session and no cookies — the checksum is the only thing that proves it
    //    came from iPay.
    const { secret } = getIpayConfig();
    if (!verifyCallbackChecksum(payload, secret)) {
      outcome = "bad-checksum";
      console.error(
        `[ipay:notify] checksum verification failed for orderId=${payload.orderId}`
      );
      return json({ status: "error", message: "Invalid checksum" }, 401);
    }

    // 2. Find the order by the *signed* orderId. merchantParam1 carries our
    //    document id, but it is echoed back outside the signed message, so it
    //    is only ever a diagnostic — never the thing that selects an order.
    const order = await backendClient.fetch<OrderDoc | null>(ORDER_QUERY, {
      orderNumber: payload.orderId,
    });

    if (!order || order.orderNumber !== payload.orderId) {
      outcome = "order-not-found";
      console.error(
        `[ipay:notify] NO MATCHING ORDER for orderId=${payload.orderId} ref=${payload.transactionReference} — a payment may have been taken with nothing to attach it to`
      );
      return json({ status: "error", message: "Order not found" }, 404);
    }

    if (payload.merchantParam1 && payload.merchantParam1 !== order._id) {
      console.warn(
        `[ipay:notify] merchantParam1=${payload.merchantParam1} does not match the order found for orderId=${payload.orderId}`
      );
    }

    // 3. Idempotency. iPay retries until it gets a 200, so the same successful
    //    payment can arrive more than once.
    if (
      TERMINAL_PAYMENT_STATES.has(order.paymentStatus ?? "") &&
      order.paymentGatewayReference === payload.transactionReference
    ) {
      outcome = "already-processed";
      return json({ status: "success" }, 200);
    }

    const result = mapTransactionStatus(payload.transactionStatus);

    // 4. Cross-check the amount. iPay tells us what it charged; if that is not
    //    what the order costs, something is wrong and no one should ship.
    const expectedCents = toCents(order.totalPrice ?? 0);
    const paidCents = toCents(Number(payload.transactionAmount));
    amountOk =
      Number.isFinite(paidCents) && paidCents === expectedCents;

    const now = new Date().toISOString();
    const basePatch: Record<string, unknown> = {
      paymentGatewayReference: payload.transactionReference,
      paymentTransactionMessage: payload.transactionMessage,
      paymentTransactionAmount: Number(payload.transactionAmount),
      paymentCreditedAmount: Number(payload.creditedAmount) || 0,
      paymentCompletedAt: now,
      paymentRawCallback: raw.slice(0, 4000),
    };

    let emailVariant: OrderEmailVariant | null = null;
    let restock = false;

    if ((result === "accepted" || result === "pending") && !amountOk) {
      // Deliberately a 200: a non-200 makes iPay resend this same bad payload
      // forever and strands the customer, while the discrepancy is already
      // recorded here for a human to chase.
      outcome = "amount-mismatch";
      basePatch.paymentStatus = "failed";
      basePatch.status = "pending";
      basePatch.paymentNotes = `AMOUNT_MISMATCH: gateway reported ${payload.transactionAmount}, order total is ${order.totalPrice}. Do not fulfil until reconciled.`;
      console.error(
        `[ipay:notify] AMOUNT MISMATCH order=${payload.orderId} got=${payload.transactionAmount} expected=${order.totalPrice}`
      );
    } else if (result === "accepted") {
      outcome = "paid";
      basePatch.paymentStatus = "paid";
      basePatch.status = "paid";
      emailVariant = "paid";
    } else if (result === "pending") {
      outcome = "pending-settlement";
      basePatch.paymentStatus = "pending_settlement";
      basePatch.status = "pending";
      emailVariant = "pending_settlement";
    } else if (result === "declined") {
      outcome = "declined";
      basePatch.paymentStatus = "failed";
      basePatch.status = "cancelled";
      restock = !order.stockRestored;
      if (restock) basePatch.stockRestored = true;
    } else {
      outcome = "unknown-status";
      basePatch.paymentStatus = "failed";
      basePatch.status = "pending";
      basePatch.paymentNotes = `Unrecognised transactionStatus "${payload.transactionStatus}" — reconcile manually.`;
      console.error(
        `[ipay:notify] unknown transactionStatus="${payload.transactionStatus}" order=${payload.orderId}`
      );
    }

    // 5. Commit. The revision guard makes concurrent duplicate callbacks
    //    mutually exclusive, so stock can never be restored twice.
    const transaction = backendClient.transaction();
    transaction.patch(order._id, (patch) =>
      patch.ifRevisionId(order._rev).set(basePatch)
    );
    if (restock) restoreStock(transaction, order);

    try {
      await transaction.commit();
    } catch (error) {
      // A revision conflict means another delivery of this same callback won
      // the race. Re-read: if it reached a terminal state, the work is done.
      const fresh = await backendClient.fetch<OrderDoc | null>(ORDER_QUERY, {
        orderNumber: payload.orderId,
      });
      if (fresh && TERMINAL_PAYMENT_STATES.has(fresh.paymentStatus ?? "")) {
        outcome = "already-processed-race";
        return json({ status: "success" }, 200);
      }
      // Nothing was recorded, so asking iPay to retry is the right answer.
      outcome = "commit-failed";
      console.error(
        `[ipay:notify] commit failed for order=${payload.orderId}:`,
        error
      );
      return json({ status: "error", message: "Could not record payment" }, 500);
    }

    // 6. Confirmations, only for money actually taken. Never throws — the
    //    payment is already recorded and the customer is waiting.
    try {
      if (emailVariant) {
        await sendEmails(order, emailVariant);
      } else if (outcome === "amount-mismatch") {
        const data = buildOrderEmailData(order, "paid");
        await Promise.race([
          sendAdminOrderEmail({
            ...data,
            orderNumber: `${data.orderNumber} — AMOUNT MISMATCH, DO NOT SHIP`,
          }),
          new Promise((resolve) => setTimeout(resolve, EMAIL_TIMEOUT_MS)),
        ]);
      }
    } catch (error) {
      console.error("[ipay:notify] notification email failed:", error);
    }

    return json({ status: "success" }, 200);
  } catch (error) {
    outcome = "exception";
    console.error("[ipay:notify] unhandled error:", error);
    return json({ status: "error", message: "Internal error" }, 500);
  } finally {
    console.info("[ipay:notify]", {
      orderId: orderIdForLog,
      transactionReference,
      transactionStatus,
      amountOk,
      outcome,
      durationMs: Date.now() - startedAt,
    });
  }
}
