# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

NUZII is a Next.js 16 (App Router) ecommerce storefront with Sanity as the CMS/backend and Firebase for (optional) authentication. The `README.md` describes an older template variant (mentions Clerk, Sendbird, and Stripe) — that is stale; the actual auth implementation is Firebase (`context/AuthContext.tsx`, `lib/firebase.ts`), there is no Sendbird/chat integration, and Stripe has been removed. Checkout is guest-first and offers two payment rails: **iPay** (Sri Lanka — card, LankaQR, iPay app) and Cash on Delivery. iPay runs against the sandbox until the live LOLC merchant account exists; flip `IPAY_ENV` to `live` and swap the token/secret to go live.

## Commands

```bash
npm run dev      # start dev server (Turbopack) at localhost:3000
npm run build    # production build
npm run start    # run production build
npm run lint     # BROKEN: `next lint` was removed in Next 16 and there is no eslint config. Use `npm run build` (it typechecks) as the gate.
npm run typegen   # extract Sanity schema + generate sanity.types.ts (run after changing any schema in sanity/schemaTypes)
```

There is no test suite configured in this repo.

`npm run typegen` deliberately calls `npx sanity` (the version pinned in `package.json`), **not** `npx sanity@latest`. The v6 CLI renames every generated query type from `FOO_QUERYResult` to `FOO_QUERY_RESULT`, which breaks ~20 imports across `components/`.

Sanity Studio is mounted inside the Next app at `/admin/studio` (not a separate app) — see `app/admin/studio/[[...tool]]`.

## Environment

`.env.example` is the authoritative list of env vars (the README is stale). Beyond the Sanity and Firebase config, checkout needs `IPAY_ENV`, `IPAY_MERCHANT_TOKEN`, `IPAY_SECRET` and `ORDER_LOOKUP_SECRET` — all **server-only**, never `NEXT_PUBLIC_`. With the iPay vars unset the gateway option fails closed and tells the customer to use Cash on Delivery, so local development works without credentials.

`npm run typegen` requires Node ≥22.12 (the Sanity CLI enforces this).

## Architecture

**Route groups.** `app/(client)` holds the storefront (product, category, shop, cart, orders, checkout success, static pages under `(user)`), each with its own `layout.tsx` that wraps pages in `AuthProvider`, global `Header`/`Footer`, `Toaster`, and Sanity's `SanityLive`/`VisualEditing` (draft mode). `app/admin/studio` mounts the embedded Sanity Studio. The root `app/layout.tsx` only sets up fonts (local Poppins/Raleway) and global CSS — it intentionally has no providers.

**Content/data layer (Sanity).** Schema types live in `sanity/schemaTypes/*` (product, category, order, homepage sections, shop hero/banner, etc.) and are compiled into `schema.json` / `sanity.types.ts` via `npm run typegen`. Two Sanity clients exist:
- `sanity/lib/client.ts` — CDN-cached, public read client with stega (visual editing) enabled.
- `sanity/lib/backendClient.ts` — authenticated (`SANITY_API_TOKEN`), `useCdn: false` client used server-side for writes and for anything money-related. **Always use this one for order pricing, payment status and order lookups**: the public client's stega splices invisible characters into every string (they would corrupt a payment checksum), and its CDN cache can serve a pre-callback snapshot of an order that has already been paid for.
Data-fetching helpers (GROQ queries wrapped with `defineQuery`/`sanityFetch`) live in `sanity/helpers/` (`shopQueries.ts`, `index.ts`) and are called from server components/actions rather than querying Sanity ad hoc in components.

**Cart state.** `store.ts` is a Zustand store (`useCartStore`, persisted to localStorage) holding cart line items and derived totals (`getTotalPrice` applies discounts via `lib/productPricing.ts`, `getSubTotalPrice` does not). Cart items reference the full Sanity `Product` type, not just an id. `wishlistStore.ts` follows the same pattern for saved/favorited products (`/wishlist` page, heart icons across product cards).

Two buttons coexist on product cards/pages by design: `components/BuyNowButton.tsx` ("Buy Now") adds the line and goes straight to `/checkout`, while `components/AddToBagButton.tsx` (bag icon) adds the same line and stays put. Don't merge them. WhatsApp is no longer a purchase path — the remaining `wa.me` links (`constants/index.ts#socialMediaLinks`, `components/new/ProductPageActions.tsx`) are customer support only.

**Checkout flow.** Guest-first, no account required. Cart (`app/(client)/cart/page.tsx`) → `/checkout` collects contact info, shipping address, a shipping method (`constants/index.ts#shippingMethods`, hardcoded — move into Sanity if the owner needs to edit rates without a deploy) and a payment method.

The browser sends only `{productId, variantKey, quantity}` plus the total it displayed. `actions/createOrder.ts` re-prices everything from Sanity via `lib/orderPricing.ts` and rejects the order if its total disagrees with the client's. **Never price an order from the cart payload** — the cart is localStorage and holds whole `Product` documents, price included.

The order is written to Sanity *before* the customer leaves for iPay, with stock reserved in the same transaction:
- **COD** → `paymentStatus: "not_required"`, confirmation emails sent immediately.
- **iPay** → `paymentStatus: "awaiting_payment"`, no email yet. The server action returns a signed form which `components/checkout/IpayRedirectForm.tsx` auto-POSTs to the gateway.

`app/(client)/api/ipay/notify/route.ts` is the only thing that marks an order paid — register it as the Call back API URL in the iPay merchant portal. It verifies the HMAC checksum before touching the database, cross-checks the amount, is idempotent on `transactionReference`, and restores stock on a decline. It returns 200 for anything durably recorded (a non-200 makes iPay retry forever *and* strands the customer, who is held on a spinner until we answer) and 500 only when nothing was written. If server-side auth is ever added to `middleware.ts`, this route must be exempt — iPay sends no cookies.

`status` stays the owner's manual fulfilment tracker; `paymentStatus` is machine-driven. Sanity Studio has "Awaiting payment" and "Needs attention" order lists for orders that need a human.

Order pages (`/success`, `/checkout/cancelled`) are server components requiring a signed `t=` lookup token (`lib/orderLookup.ts`) and project a narrow, PII-free view (`lib/orderView.ts`) — an order number alone must not expose a customer's contact details.

Known trade-offs: abandoned iPay checkouts hold stock until cancelled by hand (a scheduled sweeper is phase 2); `patch.dec()` has no floor, so simultaneous checkouts for the last unit can drive stock negative, and after payment that means a manual refund; iPay status `P` (`pending_settlement`) never auto-promotes to paid and needs daily reconciliation against the merchant portal.

Order lookups (`/orders`, `getMyOrders` in `sanity/helpers/client.ts`) are keyed on the Firebase UID stored in the order's `clerkUserId` field, which is empty for guest checkouts. Guests reach their order through the signed `/success?orderNumber=…&t=…` link, which is also included in the confirmation email.

**Auth.** `context/AuthContext.tsx` wraps the client route group and exposes `useAuth()` (Firebase `User`, `loading`, `googleLogin`, `logout`) via Google OAuth popup sign-in. Auth is optional and only gates the `/orders` history page — cart/checkout work for guests. `middleware.ts` currently does not enforce auth server-side — protection is client-side only (explicitly noted in a comment there); do not assume server-side route protection exists.

**Components.** `components/` is flat for shared/domain components (`ProductCard`, `AddToCartButton`, `Header`, `Footer`, `PriceView`/`PriceFormatter`, etc.), with subfolders `components/ui` (shadcn/ui primitives — "new-york" style, see `components.json`), `components/shop`, `components/landing`, and `components/new` for page/section-scoped components. Path alias `@/*` maps to the repo root (see `tsconfig.json`).

**Pricing.** Always compute discounted prices through `lib/productPricing.ts#getDiscountedPrice` rather than re-deriving discount math inline — it's used consistently by the cart store and `actions/createOrder.ts`.
