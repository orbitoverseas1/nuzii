# NUZII

<img src="public/images/nuzi-logo.png" alt="NUZII logo" width="240" />

NUZII is a fashion ecommerce storefront for modest-friendly, everyday womenswear. Built with Next.js and Sanity, it supports guest checkout, optional Google sign-in, iPay payments, and Cash on Delivery in Sri Lankan rupees (LKR).

![NUZII homepage carousel artwork](public/images/landing/bg-carousel.png)

## Features

- Homepage collections, most-loved products, and fresh drops managed in Sanity.
- Product and category browsing, product variants, and stock tracking.
- Cart and wishlist saved locally with Zustand.
- Guest checkout with shipping options, server-calculated pricing, and stock reservation.
- iPay hosted checkout and Cash on Delivery.
- Optional Google sign-in through Firebase and order history for signed-in customers.
- Signed order status links for guest customers.
- Customer confirmations and admin order notifications through Resend.
- Embedded Sanity Studio for managing products, homepage content, and orders.

## Tech stack

| Area | Technology |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript |
| Styling and UI | Tailwind CSS 4, Radix UI, Framer Motion, Embla Carousel |
| Content and orders | Sanity, GROQ, next-sanity |
| Customer authentication | Firebase Authentication (Google) |
| Cart and wishlist | Zustand with local storage persistence |
| Payments | iPay Sri Lanka, Cash on Delivery |
| Transactional email | Resend |

## Local setup

Use Node.js 22.12 or newer and npm. You will need a Sanity project and dataset, plus Firebase web app configuration for the customer authentication provider.

### 1. Install dependencies

```bash
npm ci
```

### 2. Configure the environment

Copy [.env.example](.env.example) to `.env.local` and fill in your configuration. In PowerShell:

```powershell
Copy-Item .env.example .env.local
```

The example file is the reference for supported variables. Keep credentials out of version control.

| Service | Configuration |
| --- | --- |
| Site | Set `NEXT_PUBLIC_BASE_URL` to `http://localhost:3000` locally. |
| Sanity | Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION`. Supply `SANITY_API_TOKEN` with write permissions for orders and `SANITY_API_READ_TOKEN` for content reads and previews. |
| Firebase | Fill in the `NEXT_PUBLIC_FIREBASE_*` values from your Firebase web app. Enable Google sign-in and authorize the development and production domains when using customer accounts. Customers can check out without signing in. |
| Order links | Set `ORDER_LOOKUP_SECRET` to a long random value. Checkout uses it to sign order status links. |
| iPay | Set `IPAY_ENV`, `IPAY_MERCHANT_TOKEN`, and `IPAY_SECRET` to enable gateway payments. Leave the credentials blank to develop with Cash on Delivery; choosing iPay without credentials prompts the customer to use COD. |
| Email | Set `RESEND_API_KEY`, `EMAIL_FROM` using a verified sender domain, and `EMAIL_ADMIN_TO` to enable confirmations and admin notifications. Emails are skipped when unconfigured. |

`FIREBASE_SERVICE_ACCOUNT_KEY` is listed in the example for the Firebase Admin helper in `lib/firebaseAdmin.ts`; it is separate from the public Firebase web app configuration.

Generate an order lookup secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Prepare content

Use your Sanity project ID and dataset in `.env.local`. This repository already includes the Studio configuration and content schemas, so use those when setting up your project.

After starting the app, open `/admin/studio` to add categories, products, variants, stock, and homepage sections. No demo seed archive is included in this repository.

### 4. Start the app

```bash
npm run dev
```

- Storefront: <http://localhost:3000>
- Sanity Studio: <http://localhost:3000/admin/studio>
- Catalog: <http://localhost:3000/category/all>
- Checkout: <http://localhost:3000/checkout>
- Customer order history: <http://localhost:3000/orders> (sign-in required)

## Payment setup

The iPay gateway uses the sandbox unless `IPAY_ENV` is set to `live`. Configure the merchant token and secret for the selected environment. In the merchant portal, enable the checksum (Additional Security) option and register this callback URL using your publicly reachable application domain:

```text
https://<your-domain>/api/ipay/notify
```

Orders and stock reservations are recorded before the customer leaves for iPay. The verified server callback updates payment status. Cash on Delivery orders send confirmations immediately; iPay confirmations follow the recorded payment result.

Sanity Studio separates orders into All Orders, Awaiting payment, and Needs attention. Review abandoned payments and pending settlements there; abandoned checkout stock is not released automatically.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start development with Turbopack. |
| `npm run build` | Create a production build and run TypeScript checks. |
| `npm start` | Serve the production build. |
| `npm run typegen` | Extract the Sanity schema and regenerate `sanity.types.ts` after schema changes. |

The existing `npm run lint` script invokes `next lint`, which is unavailable in Next.js 16. Use `npm run build` for the current validation workflow. There is no automated test suite configured.

## Project structure

```text
app/(client)/         Storefront, checkout, order pages, and payment API routes
app/admin/studio/     Embedded Sanity Studio
actions/              Server actions, including order creation
components/           Shared UI, homepage sections, catalog, and checkout
context/              Firebase authentication provider
constants/            Shipping options and shared configuration
lib/                  Pricing, stock, payments, order links, and email helpers
public/images/        Current brand and storefront artwork
sanity/               Content schemas, queries, clients, and Studio structure
store.ts              Persistent cart state
wishlistStore.ts      Persistent wishlist state
```

Edit homepage presentation in `components/landing/`, catalog content in Sanity Studio, and shipping options in `constants/index.ts`. After changing schemas in `sanity/schemaTypes/`, run `npm run typegen` using the repository's installed Sanity CLI.

## License

The original template is a commercial product licensed under ReactBD Technologies.
