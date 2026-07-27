import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { verifyOrderLookupToken } from "@/lib/orderLookup";

/**
 * Minimal status endpoint for the success-page poller. Returns nothing but the
 * two status fields — no customer details — and only to a caller holding the
 * order's signed lookup token.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get("orderNumber");
  const token = req.nextUrl.searchParams.get("t");

  if (!verifyOrderLookupToken(orderNumber, token)) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  const order = await backendClient.fetch<{
    paymentStatus?: string;
    status?: string;
  } | null>(
    `*[_type == "order" && orderNumber == $orderNumber][0]{ paymentStatus, status }`,
    { orderNumber }
  );

  if (!order) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { paymentStatus: order.paymentStatus ?? null, status: order.status ?? null },
    { headers: { "Cache-Control": "no-store" } }
  );
}
