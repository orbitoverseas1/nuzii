import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // For now, we are relying on client-side protection because Firebase Client SDK
  // handles auth state best on the client.
  // We can implement session cookie verification here later if needed for strict server-side protection.

  // IMPORTANT: the matcher below covers /api. If server-side auth is ever added
  // here, /api/ipay/notify must be exempt — iPay calls it server-to-server with
  // no cookies and authenticates with an HMAC checksum instead. Blocking it
  // would leave paid orders stuck in "awaiting payment" forever.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
