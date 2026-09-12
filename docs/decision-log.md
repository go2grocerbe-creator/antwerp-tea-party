# Decision Log — Technical (this repository)

For the *business/partnership* decision log (commercial model, discovery findings), see the
Obsidian project memory: `Daniele Tea Shop — Ecommerce Partnership/DECISION_LOG.md`. This file
is for technical decisions made while building `feat/mobile-commerce-v1`.

## DEC-T01 — Typed commerce provider interface, seed data behind it, Shopify not yet connected

**Decision:** Build `CommerceProvider` (`src/lib/commerce/types.ts`) as the single interface all
UI depends on, implement it once against in-repo seed data, and do not connect Shopify in this
session.

**Reason:** No Shopify account/credentials exist. Building the full storefront (shop, product,
cart) required *some* data source; the project brief explicitly forbids a "fragile mock shop"
scattered through components and requires the same interface a real backend would implement.

**Consequence:** Swapping to Shopify later is a one-line change in `src/lib/commerce/index.ts`.
See `docs/commerce-architecture.md`.

## DEC-T02 — Cart mutations as Server Actions + httpOnly cookie, not client-side state

**Decision:** `addToCartAction`/`updateCartLineAction`/`removeCartLineAction` are Next.js
Server Actions bound to `<form action>`, cart identity lives in an `httpOnly` cookie
(`atp_cart_id`).

**Reason:** Keeps pricing authoritative server-side (never trust client-held price —
`resolveCart` always re-reads price from the catalogue). Avoids a client/server cart-sync bug
class. Works with progressive enhancement for the parts that don't also need client state.

**Consequence:** `ProductDetail.tsx` still needs `"use client"` for variant/quantity selection
UI state and an inline confirmation message, but submits through the same server action rather
than duplicating cart logic client-side.

## DEC-T03 — `getCheckoutUrl()` returns `null`; cart shows an honest "not connected" message

**Decision:** No fake checkout link, no fake success page. When no payment provider is
connected, the cart page renders a clear message instead of a checkout button.

**Reason:** Explicit, non-negotiable project constraint ("Do not create a fake checkout" /
"Claim that checkout works without reaching and testing the real test checkout").

**Consequence:** The required customer E2E journey's final step ("reach a valid provider
checkout in test mode") cannot be completed until a payment provider is chosen and connected —
documented as a known gap in `docs/testing-plan.md`, not hidden.

## DEC-T04 — Draft-preview mode via a server-checked query token, not a cookie/session

**Decision:** `COMMERCE_PREVIEW_TOKEN` env var; `?preview=<token>` on `/shop` and
`/shop/[handle]` reveals drafts; the same token is threaded into the add-to-cart form and
re-validated server-side before a draft can enter a cart.

**Reason:** Needed a way to review/QA draft products and exercise the full purchase flow
without real, approved product data, while guaranteeing draft products stay unreachable by
default (env var unset) and never trusting the page's own state for the security check.

**Consequence:** This is a stopgap, not a CMS preview system — flagged in
`docs/commerce-architecture.md` as something to retire once Shopify Admin (with its own
preview workflow) is connected.

## DEC-T05 — Removed the price=0 condition from disabling Add to Cart

**Decision:** Add to Cart is disabled only on real `out_of_stock`, not on an unset/`$0`
placeholder price.

**Reason:** Initially disabled on both, but that made the seed/draft data's placeholder price
(`0`, correctly never a real price) block even preview-mode QA of the cart flow. The actual
safety mechanism against selling at a fake price is that draft products are never public
(`status !== "published"` is filtered everywhere) — preview mode is already gated behind a
secret token, so allowing add-to-cart there doesn't reintroduce the risk.

**Consequence:** Caught and fixed via the Playwright E2E suite added this session — see
`docs/testing-plan.md`.

## DEC-T06 — Upgraded `next`/`eslint-config-next` from 16.3.2 to 16.3.5

**Decision:** Bump both packages to the matching 16.3.5 release.

**Reason:** `npm audit` surfaced a **critical** advisory in `next@16.3.2`: unauthenticated RCE
on Windows-hosted servers, plus an RCE in the AVIF image-optimization path. 16.3.5 fixes both.
`npm audit` is clean (0 vulnerabilities) after the bump; `lint`/`typecheck`/`build` all still
pass.

**Consequence:** None observed — no breaking changes hit in this codebase between 16.3.2 and
16.3.5.

## DEC-T07 — Hoisted `SiteHeader`/`SiteFooter` into `src/app/[locale]/layout.tsx`

**Decision:** Moved header/footer out of `HomePage.tsx` into a shared locale layout.

**Reason:** New routes (`/shop`, `/shop/[handle]`, `/cart`) needed the same header (nav, cart
badge, mobile drawer, language switcher) and footer (contact info) as the homepage. Duplicating
them per-route would have meant two places to keep in sync.

**Consequence:** Header now computes the cart-line count server-side
(`getCurrentCartSummary()`) once per request in the layout and passes it down — every route
under `/[locale]` gets an accurate cart badge for free.

---

## DEC-T08 — Removed GSAP pinning from the mobile tea journey entirely

**Decision:** Below 769px, `OriginJourney` renders a completely separate, plain-document-flow
tree (`.journey-mobile-only`) with no GSAP/ScrollTrigger at all, instead of a shortened version
of the desktop pinned/scrubbed timeline.

**Reason:** Shortening the pin's scroll distance (`+=450%` → `+=300%`, first pass) was not an
adequate fix — a static/pinned sequence on a narrow screen produced a long blank scroll (content
that only becomes visible via scroll-linked animation renders as empty space outside that
animation) and layout defects (chair artwork overlapping the tea-table headline, since that
composition was designed for desktop's overlapping-grid layout). See
`docs/audits/mobile-audit.md` for the screenshots that showed this.

**Consequence:** Both trees render in the DOM always (CSS `display` toggles which is visible at
which breakpoint, so server/client rendering stays consistent); GSAP's `matchMedia` only ever
targets the desktop tree's classes now, so there's nothing to revert for mobile. Desktop's
`+=560%` pinned journey is untouched.

## DEC-T09 — Rebuilt the tea-table section as flex-column + `order` on mobile

**Decision:** Below 901px, `.tea-table` switches from the desktop overlapping CSS grid (chair
artwork positioned behind the headline via `grid-row: 1` on both elements) to
`display: flex; flex-direction: column` with `order` on `.tea-table__copy` (1) and
`.tea-table__chair` (2) — copy first, chair as its own contained visual below.

**Reason:** The grid overlap was intentional desktop art direction but broke on mobile — the
`margin-bottom: 260px` hack meant to keep the chair clear of the heading didn't reliably work
across heading lengths/font scaling. Same JSX order in both cases; only CSS decides layout.

**Consequence:** Verified via a full-resolution element screenshot (not just the compressed
full-page thumbnail, which made the contained chair image easy to miss) that the chair now sits
cleanly below the CTA buttons with no overlap at 320–414px widths.

## DEC-T10 — Replaced the five draft placeholder products with five published generic demo teas

**Decision:** `seed-data.ts` now holds Earl Grey Classic, English Breakfast, Green Sencha,
Chamomile Blossom, and Rooibos Vanilla, `status: "published"`, with a `<DemoCatalogueBanner>`
shown on every page that displays them (any non-production environment) and `noindex` metadata.

**Reason:** The brief needed the shop/product/cart flow demoable on a Vercel preview without a
secret query-param token, while still being unmistakably marked as demo content requiring the
owner's approval before anything is treated as real. See `docs/product-model.md` "Demo catalogue
vs. real data" for exactly what is and isn't claimed about these five (no origin, no allergen
claims, no health claims).

**Consequence:** `addCartLine`'s price check (previously also blocking a `$0` placeholder price
from being added to cart) now only blocks on real `out_of_stock` — the demo teas have real
non-zero demo prices, so this specific interaction didn't end up mattering for them, but the
underlying fix (documented in DEC-T05, still in effect) is what makes the cart flow testable
against non-published product states in general.

## DEC-T11 — Replaced the Shopify recommendation with Supabase + Stripe

**Decision:** Per explicit owner direction, the recommended/implemented architecture is now
Next.js storefront + Supabase (Postgres/Auth/Storage/RLS) + a custom protected `/admin` +
Stripe, replacing the earlier Shopify Storefront API + Shopify Admin recommendation.

**Reason:** Owner decision — Shopify is not required for this direction. Not a technical
reversal of the earlier reasoning (Shopify was recommended because it reduces custom handling of
payments/inventory/checkout security); this documents that the decision was made explicitly by
the owner, not re-derived from new technical evidence.

**Consequence:** `docs/commerce-architecture.md` was rewritten. `supabase/migrations/*.sql`,
`src/lib/supabase/*`, `src/lib/admin/*`, `src/app/admin/*` implement the admin side;
`src/lib/stripe/*`, `src/app/[locale]/checkout/*`, `src/app/api/checkout/session/route.ts`,
`src/app/api/webhooks/stripe/route.ts` implement payments. Both are built against the same
`CommerceProvider` typed interface as before — see DEC-T01 — so this was an adapter swap, not an
architecture rewrite of the storefront itself. Neither has real credentials in this environment;
see `docs/handover.md` "Blocked."

## DEC-T12 — Cart mutations validated by draft `useState` diffing; variant/image editing via JSON hidden fields

**Decision:** The admin product form (`src/components/admin/ProductForm.tsx`) keeps variants and
images as client `useState` arrays (add/remove rows), serialized into `variantsJson`/`imagesJson`
hidden fields on submit, parsed and re-validated with the same Zod schema server-side
(`src/lib/admin/product-actions.ts`) rather than trusting the JSON blob's shape.

**Reason:** Dynamic repeating form rows (arbitrary number of variants/images) don't map cleanly
onto plain `FormData` array parsing; this is a common, well-understood pattern for that case, and
keeping the *validation* server-side (never trusting the client JSON) preserves the same
never-trust-the-client posture as the rest of the commerce layer.

**Consequence:** Variants/images are fully replaced (delete + reinsert) on every product save
rather than diffed — a documented simplification, fine at a five-to-a-few-dozen-product scale;
revisit if per-variant history/audit trails become a real requirement (see
`src/lib/admin/products.ts` `writeVariantsAndImages`).
