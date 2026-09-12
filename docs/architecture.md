# Architecture

## Stack

- Next.js 16.3.5, App Router, Turbopack (see `AGENTS.md` — this Next.js version has breaking
  changes vs. training data; the installed docs at `node_modules/next/dist/docs/` are the
  source of truth used while building this).
- React 19.2.8, TypeScript (strict), Tailwind CSS 4 (mostly unused directly — the app uses a
  hand-written design-token stylesheet, see below).
- GSAP + ScrollTrigger for the homepage "tea journey" scroll sequence.
- No database. No auth system. Commerce data currently comes from an in-repo seed provider
  (see `docs/commerce-architecture.md`) — there is no CMS or admin UI in this codebase, by
  design (Shopify Admin is the intended product-management surface, see that doc).

## Routing

```
src/app/
  layout.tsx              root layout: fonts, <html lang>, locale detection from x-locale header
  page.tsx                redirects "/" -> "/{defaultLocale}"
  robots.ts, sitemap.ts
  [locale]/
    layout.tsx             shared SiteHeader/SiteFooter + cart count, wraps every locale route
    page.tsx                homepage (OriginJourney, ShopStory, ExpertiseSection, ...)
    not-found.tsx           locale-aware 404
    shop/
      page.tsx               product grid
      [handle]/page.tsx       product detail + add-to-cart form
    cart/
      page.tsx               cart lines, quantity edit, remove, checkout state
```

`src/proxy.ts` (Next's middleware convention in this version — see
`node_modules/next/dist/docs`) redirects `/` to `/{defaultLocale}` and stamps an `x-locale`
request header from the URL, which `layout.tsx` and `not-found.tsx` read via `headers()` to
pick the right dictionary without needing `params` in places that don't otherwise have them.

Locales: `nl` (default), `fr`, `en` — see `src/i18n.ts`. All copy lives in
`dictionaries[locale]` there; there is no separate translation-file/ICU system. Extend that one
file for new strings, keeping the three locale objects structurally identical (the `Dictionary`
type is derived from all three, so a missing key in one locale is a type error in components
using it — this is intentional, it's how "missing translation" gets caught at build time
instead of silently falling back).

## Data flow

- **Site content** (address, opening hours placeholder, nav labels, all copy): `src/i18n.ts`
  + `src/data/site.ts`, `src/data/navigation.ts`, `src/data/origins.ts`, `src/data/assets.ts`.
  Plain TypeScript objects, no CMS — matches the pre-existing pattern from before this branch.
- **Commerce data** (products, cart): `src/lib/commerce/*` — see `docs/commerce-architecture.md`
  and `docs/product-model.md`. This is the one part of the app built with a real
  backend-swap boundary in mind.

## Server actions vs. client state

Cart mutations (`addToCartAction`, `updateCartLineAction`, `removeCartLineAction` in
`src/lib/commerce/actions.ts`) are Next.js Server Actions (`"use server"`), invoked from
`<form action={...}>`. This was chosen over client-side cart state (e.g. a React Context +
localStorage) because:

1. It keeps pricing authoritative on the server (`resolveCart` always re-reads price from the
   catalogue — see `docs/product-model.md`), never trusting a client-held price.
2. It works without a client-side cart sync bug class (stale localStorage vs. server truth).
3. Cart identity is a `httpOnly` cookie (`atp_cart_id`, set in `getOrCreateCartId`) — not
   readable/tamperable from client JS.

`ProductDetail.tsx` is a Client Component (needs `useState` for variant/quantity selection and
an inline confirmation message) but still submits through the same server action.

## CSS

One global stylesheet, `src/app/globals.css`: CSS custom properties for the design tokens
(`--green`, `--clay`, `--tan`, `--parchment`, `--paper`, `--ink`, `--muted`, `--line`,
`--shadow`), mobile-first rules with two breakpoints (900px, 520px) plus a
`prefers-reduced-motion` block. This predates this branch and was preserved rather than
replaced — new commerce UI (shop grid, product page, cart) was added in the same convention
(plain class names, no CSS-in-JS, no component library) rather than introducing a second
styling system, per the project brief.

## What this branch added

See `git log feat/mobile-commerce-v1` for the full commit history, or
`docs/decision-log.md` for the reasoning behind the larger calls (typed commerce interface,
server actions for cart, preview-mode design, the `next` version bump).
