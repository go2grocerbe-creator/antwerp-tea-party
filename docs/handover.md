# Handover

Branch: `feat/mobile-commerce-v1` (based on `main` @ `61ca89d`). PR:
https://github.com/go2grocerbe-creator/antwerp-tea-party/pull/1 (not merged).

Read `docs/architecture.md`, `docs/commerce-architecture.md`, and `docs/product-model.md`
first — this file is the status summary, those are the reference. This is the **third pass** on
this branch; the first and second passes' summaries are preserved below, with this section
covering what changed since.

## Third pass — completed (2026-09-12, later the same day)

- **Restored the cinematic mobile tea journey.** The second pass's static replacement fixed
  blank-space/overlap defects but removed the site's central scroll-driven storytelling concept.
  This pass adds a dedicated, purpose-built mobile GSAP timeline (`MobileJourneyAnimated`) —
  pinned, scrubbed, composed specifically for portrait screens — and keeps the static version
  only as the `prefers-reduced-motion` fallback. Full design/rationale:
  `docs/audits/mobile-motion-story-audit.md`.
- **Found and fixed a real desktop regression** introduced by the second pass: a CSS
  specificity bug meant the (invisible but space-occupying) mobile tree rendered at desktop
  widths too, pushing the real desktop journey down by a full viewport height. Caught by the
  mandatory desktop-regression check this pass required — see
  `docs/decision-log.md` DEC-T14.
- Verified via real Chromium screenshots at every required/spot-check mobile viewport
  (320/375/390/430/768, plus 414 spot-check) and desktop regression (1280/1440), a ~30s
  Playwright video recording (reviewed via extracted frames) covering forward scroll through
  the whole journey, release, and partial reverse scroll, and a `prefers-reduced-motion`
  fallback check.
- Added 16 new Playwright tests (`tests/e2e/mobile-motion-journey.spec.ts`) — opening content,
  pin existence/bounded distance, key elements present, origin-label containment, text/tin
  non-intersection, release + reachability of following content, reverse-scroll restoration, no
  overflow at all 5 required widths, reduced-motion fallback, desktop regression guard. All
  pass, alongside the full pre-existing suite (36 passed, 8 skipped as project-restricted
  duplicates, 0 failed).
- `npm run lint` / `npm run typecheck` / `npm run build` clean throughout; `npm audit` still 0
  vulnerabilities (no new dependencies this pass).

## Third pass — verified

- `npm run lint`, `npm run typecheck`, `npm run build` — clean.
- `npx playwright test` — 36/36 passing (8 skipped, project-restricted duplicates by design).
- Real Chromium screenshots visually read at every required checkpoint at 390×844 (full
  forward+backward, 10 checkpoints total including 4 extra targeted ones), 320×568 (opening/
  origins/preservation), 768×1024 (opening, post-fix), 430×932 (opening), 375×667 and 414×896
  (one spot-check each), and desktop 1280×800/1440×900 (5-point sweep each, pre- and post- the
  specificity-bug fix).
- A Playwright video recording (390×844, ~30s) reviewed via 10 extracted frames spanning the
  full forward journey, release, and partial reverse — confirmed continuous progression, no
  blank pauses, smooth release, correct reverse restoration.
- Reduced-motion fallback confirmed to create zero `.pin-spacer` elements (no pin at all, not
  just visually hidden).

## Third pass — not done, not blocked — genuine gaps to pick up next

- **iOS Safari was not tested** — every check this pass used Chromium via Playwright. Safari-
  specific pin/scroll-momentum/viewport-unit behavior is unverified, not confirmed working.
- Android mobile browsers not tested (Chromium desktop-engine emulation only, throughout).
- 414×896/430×932 were captured in full (all 6 checkpoints) but only the opening frame was
  individually read at each — not the same depth as 320/390/768.
- No physical-device testing was performed.
- The opening composition's vertical spacing at the 768px end of the mobile range was improved
  but not further polished.

## Second pass — completed (2026-09-12)

- **Mobile visual redesign** (the primary ask this round — the first pass's fix was judged
  inadequate on inspection): removed GSAP pinning from the mobile tea journey entirely, replaced
  with a plain-document-flow six-stage sequence; rebuilt the tea-table section to stop
  overlapping the chair illustration with the headline; unified the mobile/desktop CSS
  breakpoint to 901px. Verified by visually reading real Chromium screenshots (not just
  automated overflow assertions) at 320/375/390/414/430/768/1280px — see
  `docs/audits/mobile-audit.md` "Round 2" for the before/after detail.
- **Five generic demo teas**, published (not draft), with a `<DemoCatalogueBanner>` shown on
  every environment except real production and `noindex` metadata — visible on a Vercel preview
  without a secret token, per the brief. See `docs/product-model.md` "Demo catalogue vs. real
  data."
- **Architecture pivot**: replaced the Shopify recommendation with Next.js + Supabase
  (Postgres/Auth/Storage/RLS) + custom `/admin` + Stripe, per explicit owner direction. See
  `docs/commerce-architecture.md` and `docs/decision-log.md` DEC-T11.
- **Supabase product-admin foundation**: migrations (`supabase/migrations/0001_init.sql`,
  `0002_orders.sql`), typed service layer + Zod validation (`src/lib/admin/`), Auth-gated
  `/admin` UI (sign in, list, add/edit with EN/NL/FR fields, variants, images-by-URL,
  publish/unpublish/archive). A `supabaseCommerceProvider` implementing the same
  `CommerceProvider` interface is wired in and auto-activates once Supabase env vars are set —
  no other code changes needed.
- **Stripe Embedded Checkout prepared**: `/checkout` page, `/api/checkout/session` (server-side
  price re-resolution, never trusts the client), `/api/webhooks/stripe` (signature-verified,
  only place an order is ever created), `/checkout/return` (reads status back, creates nothing).
  Cart shows a real checkout link only when both Stripe keys are configured; otherwise the same
  honest "not connected yet" message as before.
- Fixed a real bug found while building the above: the language switcher always linked to the
  plain locale homepage, losing the current page — now preserves it.
- Fixed a defensive gap: two admin data-fetching functions could throw an unhandled error (loud
  console noise, though the auth redirect still won the actual HTTP response) when Supabase
  isn't configured, due to Next possibly rendering a protected page's data fetch concurrently
  with its layout's auth check — now they degrade to an empty result instead.
- Expanded `npx playwright test` from 3 to 8 passing tests: locale-switch preservation, all-
  five-teas-public, Supabase-not-configured fallback, checkout-not-configured fallback, webhook
  signature rejection — see `docs/testing-plan.md`.
- `npm run check` (lint + typecheck + build) clean throughout; `npm audit` still 0
  vulnerabilities after adding `@supabase/*`, `zod`, `stripe`, `@stripe/*`.

## Second pass — verified

- `npm run lint`, `npm run typecheck`, `npm run build` — clean.
- `npx playwright test` — 8/8 passing (mobile + desktop projects).
- Manual `curl` smoke test of every route including the new `/checkout`, `/checkout/return`,
  `/admin/*`, `/api/checkout/session`, `/api/webhooks/stripe`.
- Real Chromium screenshots inspected visually for the mobile redesign (see audit doc).

## Second pass — blocked (needs the owner and/or credentials)

Everything from the first pass, plus:

- **Supabase project + credentials.** No project exists. Migrations are written but
  **untested against a live database** — review them before running against anything real. See
  `docs/commerce-architecture.md` "What connecting Supabase actually requires" for the exact
  sequence, including creating the first admin user.
- **Stripe account + test-mode credentials.** No account exists. The integration is built
  end-to-end (Embedded Checkout, webhook, order persistence) but **entirely unexercised against
  real Stripe** — no test payment has been run. See "What connecting Stripe actually requires"
  in the same doc.
- Once both are connected: run the manual operator-acceptance journey and the manual
  Stripe-test-card checkout journey described in `docs/testing-plan.md`, and only then consider
  either "verified."

## Second pass — not done, not blocked — genuine gaps to pick up next

- Supabase Storage-backed image upload from the admin form (currently a URL/path text field,
  not a file picker) — the bucket + RLS policies exist in the migration, the UI doesn't use them
  yet.
- No admin order-list view — `orders`/`order_items` tables and RLS exist, nothing in `/admin`
  reads them yet.
- No sixth *draft* product exists to exercise the real publish/unpublish/archive journey against
  (all five current products are published) — add one once Supabase is connected, or a throwaway
  one to the seed data for local testing.
- 414×896/430×932 were captured but only spot-checked, not read screenshot-by-screenshot to the
  same depth as the other widths.
- iOS Safari-specific rendering was not checked (Chromium only, this session).
- Preview deployment to Vercel was not run this session (see `docs/deployment.md`).

## First pass — completed (2026-09-12, earlier same session)

- Repository safety: dedicated branch, no destructive git operations, no uncommitted work
  discarded.
- Mobile navigation rebuilt: accessible drawer (dialog role, Escape, focus trap/return, scroll
  lock, 44px touch targets) replacing a horizontally-scrolling bar.
- Typed, swappable commerce provider interface (`CommerceProvider`).
- Full shop → product → cart flow: `/shop`, `/shop/[handle]`, `/cart`, quantity editing, line
  removal, server-authoritative pricing, draft-preview mode.
- Multilingual: en/nl/fr dictionary sections for the new UI, structural shape enforced by
  TypeScript.
- SEO basics on the product page (canonical/OG metadata, `Product` JSON-LD from verified fields
  only).
- Security: `next` upgraded to patch a critical RCE advisory.
- Testing infrastructure: Playwright installed, first 3 E2E tests added.

## Recommended next action

1. Get the content-intake table (`docs/content-intake-template.md`) filled in and approved for
   the first five real teas.
2. Create the Supabase project, run the migrations, create the first admin user — see
   `docs/commerce-architecture.md`.
3. Create the Stripe account (test mode), wire up the webhook, run a real test-card checkout
   end-to-end.
4. Replace the five demo products with real, approved data via `/admin`.
5. Add Storage-backed image upload and an admin order list if/when they become priorities.
6. Run the preview deployment command in `docs/deployment.md`, review it with Daniele.
7. Only then: consider production deployment (explicit approval required — see the project's
   non-negotiable constraints).
