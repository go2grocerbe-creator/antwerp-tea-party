# The Antwerp Tea Party

Mobile-first e-commerce foundation for The Antwerp Tea Party, a specialized independent tea
boutique in Antwerp: Next.js App Router, TypeScript, Tailwind CSS (design-token stylesheet),
`next/image`, GSAP ScrollTrigger for the homepage scroll story, and a typed, swappable commerce
layer (shop, product pages, cart) currently backed by seed/draft data — see
`docs/commerce-architecture.md`.

**Start here:** `docs/handover.md` for current status, `docs/architecture.md` for how the app
is put together, `docs/commerce-architecture.md` for the commerce layer and what's still
blocked on real credentials/product data.

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in what you need — `COMMERCE_PREVIEW_TOKEN` lets
you view/QA the draft seed products at `/nl/shop?preview=<token>` (see
`docs/commerce-architecture.md` "Draft-preview mode"). Everything else in `.env.example` is not
wired up yet (no commerce backend is connected).

## Checks

```bash
npm run lint        # ESLint
npm run typecheck    # tsc --noEmit
npm run build        # production build
npm run check         # all three
npm run test:e2e       # Playwright E2E — see docs/testing-plan.md
```

## Deployment

The project is intended to deploy cleanly to Vercel and is already linked (`.vercel/project.json`, gitignored). See `docs/deployment.md` for the preview-deploy command and what environment variables a deploy needs. No production deployment, domain, or payment configuration has been touched.

## Assets

Original source material lives outside the app and must remain read-only:

```text
E:\ANTWERP TEA PARTY\Reference Photos
E:\ANTWERP TEA PARTY\Reference Documents
```

Selected, optimized copies are placed in:

```text
public/images
public/illustrations
```

See `ASSET_SELECTION.md` for the current homepage image choices.

## Content

Business and editable content is centralized in:

```text
src/data/site.ts
src/data/navigation.ts
src/data/origins.ts
src/data/assets.ts
```

Unverified details are marked with TODO comments in the data files and summarized in `DEMO_NOTES.md`.

## Commerce (shop / product / cart)

```text
src/lib/commerce/        typed CommerceProvider interface, seed/draft data, cart server actions
src/app/[locale]/shop/    shop grid + product detail routes
src/app/[locale]/cart/    cart route
src/components/shop/      ProductCard, ProductGrid
src/components/product/   ProductDetail
src/components/cart/      CartLineItem
```

No real product data or commerce backend is connected yet — see `docs/commerce-architecture.md`
and `docs/content-intake-template.md`.

## Animation

The GSAP ScrollTrigger timeline lives in:

```text
src/components/home/OriginJourney.tsx
```

It handles the opening journey from prototype origins to leaf, tin, and real shelf reveal. Editorial sections after that are intentionally calmer and mostly static.
