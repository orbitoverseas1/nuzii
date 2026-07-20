# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

NUZII is a Next.js 16 (App Router) ecommerce storefront with Sanity as the CMS/backend and Firebase for (optional) authentication. The `README.md` describes an older template variant (mentions Clerk, Sendbird, and Stripe) — that is stale; the actual auth implementation is Firebase (`context/AuthContext.tsx`, `lib/firebase.ts`), there is no Sendbird/chat integration, and Stripe has been removed. Checkout is currently guest-first: shoppers fill in contact + shipping details and the order is created directly in Sanity with `status: "pending"` — there is no live payment gateway integrated yet (iPay Sri Lanka is planned; wire it into `actions/createOrder.ts` and the `order` schema's `paymentGatewayReference` field when ready).

## Commands

```bash
npm run dev      # start dev server (Turbopack) at localhost:3000
npm run build    # production build
npm run start    # run production build
npm run lint     # next lint
npm run typegen   # extract Sanity schema + generate sanity.types.ts (run after changing any schema in sanity/schemaTypes)
```

There is no test suite configured in this repo.

Sanity Studio is mounted inside the Next app at `/admin/studio` (not a separate app) — see `app/admin/studio/[[...tool]]`.

## Environment

Required env vars (see `README.md` for where to obtain each): `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_TOKEN`, `SANITY_API_READ_TOKEN`, plus Firebase client/admin config used by `lib/firebase.ts` / `lib/firebaseAdmin.ts`. `npm run typegen` requires Node ≥22.12 (the Sanity CLI enforces this) — on older Node, hand-edit `sanity.types.ts` to match schema changes and regenerate properly later.

## Architecture

**Route groups.** `app/(client)` holds the storefront (product, category, shop, cart, orders, checkout success, static pages under `(user)`), each with its own `layout.tsx` that wraps pages in `AuthProvider`, global `Header`/`Footer`, `Toaster`, and Sanity's `SanityLive`/`VisualEditing` (draft mode). `app/admin/studio` mounts the embedded Sanity Studio. The root `app/layout.tsx` only sets up fonts (local Poppins/Raleway) and global CSS — it intentionally has no providers.

**Content/data layer (Sanity).** Schema types live in `sanity/schemaTypes/*` (product, category, order, homepage sections, shop hero/banner, etc.) and are compiled into `schema.json` / `sanity.types.ts` via `npm run typegen`. Two Sanity clients exist:
- `sanity/lib/client.ts` — CDN-cached, public read client with stega (visual editing) enabled.
- `sanity/lib/backendClient.ts` — authenticated (`SANITY_API_TOKEN`) client used server-side for writes (e.g. order creation from checkout).
Data-fetching helpers (GROQ queries wrapped with `defineQuery`/`sanityFetch`) live in `sanity/helpers/` (`shopQueries.ts`, `index.ts`) and are called from server components/actions rather than querying Sanity ad hoc in components.

**Cart state.** `store.ts` is a Zustand store (`useCartStore`, persisted to localStorage) holding cart line items and derived totals (`getTotalPrice` applies discounts via `lib/productPricing.ts`, `getSubTotalPrice` does not). Cart items reference the full Sanity `Product` type, not just an id. `wishlistStore.ts` follows the same pattern for saved/favorited products (`/wishlist` page, heart icons across product cards).

Two "add to cart" style buttons coexist on product cards/pages by design: `components/AddToCartButton.tsx` ("Buy") opens a pre-filled WhatsApp chat for manual ordering, while `components/AddToBagButton.tsx` adds the item to the real cart/checkout flow. Don't merge these — both are intentional parallel purchase paths.

**Checkout flow.** Guest-first, no account required. Cart page (`app/(client)/cart/page.tsx`) → `/checkout` (`app/(client)/checkout/page.tsx`) collects contact info, shipping address, and a shipping method (from `constants/index.ts#shippingMethods`, currently hardcoded — move into Sanity if the store owner needs to edit rates without a deploy). Submitting calls the `actions/createOrder.ts` server action, which writes the order directly into Sanity (`status: "pending"`, no payment captured yet) in one transaction that also decrements matching product `stock`, then redirects to `/success?orderNumber=...`. There is no oversell protection beyond a plain `dec()` — fine at this store's scale, but revisit if concurrent order volume grows. `app/(client)/api/delete-order` handles order cleanup from the orders list.

Order lookups (`/orders`, `getMyOrders` in `sanity/helpers/client.ts`) are keyed on the Firebase UID stored in the order's `clerkUserId` field, which is empty for guest checkouts — guests currently have no way to look up a past order after leaving the success page.

**Auth.** `context/AuthContext.tsx` wraps the client route group and exposes `useAuth()` (Firebase `User`, `loading`, `googleLogin`, `logout`) via Google OAuth popup sign-in. Auth is optional and only gates the `/orders` history page — cart/checkout work for guests. `middleware.ts` currently does not enforce auth server-side — protection is client-side only (explicitly noted in a comment there); do not assume server-side route protection exists.

**Components.** `components/` is flat for shared/domain components (`ProductCard`, `AddToCartButton`, `Header`, `Footer`, `PriceView`/`PriceFormatter`, etc.), with subfolders `components/ui` (shadcn/ui primitives — "new-york" style, see `components.json`), `components/shop`, `components/landing`, and `components/new` for page/section-scoped components. Path alias `@/*` maps to the repo root (see `tsconfig.json`).

**Pricing.** Always compute discounted prices through `lib/productPricing.ts#getDiscountedPrice` rather than re-deriving discount math inline — it's used consistently by the cart store and `actions/createOrder.ts`.
