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
