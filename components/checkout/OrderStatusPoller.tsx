"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  orderNumber: string;
  token: string;
}

/**
 * Polls until the payment callback has been processed.
 *
 * iPay normally calls us before redirecting the customer, so the order is
 * already resolved by the time this page renders. But if that callback failed
 * and is being retried, the customer can arrive first and would otherwise sit
 * on a page that never updates.
 */
const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 15;

const OrderStatusPoller = ({ orderNumber, token }: Props) => {
  const router = useRouter();

  useEffect(() => {
    let attempts = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      if (cancelled) return;
      attempts += 1;

      try {
        const res = await fetch(
          `/api/order-status?orderNumber=${encodeURIComponent(orderNumber)}&t=${encodeURIComponent(token)}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.paymentStatus && data.paymentStatus !== "awaiting_payment") {
            router.refresh();
            return;
          }
        }
      } catch {
        // Transient network failures are expected here; keep polling.
      }

      if (attempts >= MAX_ATTEMPTS) {
        // Give up quietly and re-render once with whatever the server has.
        router.refresh();
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    timer = setTimeout(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderNumber, token, router]);

  return null;
};

export default OrderStatusPoller;
