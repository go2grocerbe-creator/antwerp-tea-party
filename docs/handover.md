# Handover

Branch: `feat/mobile-commerce-v1` (based on `main` @ `61ca89d`, up to date with
`origin/main` at time of branching — nothing was force-pushed or rebased).

Read `docs/architecture.md`, `docs/commerce-architecture.md`, and `docs/product-model.md`
first — this file is the status summary, those are the reference.

## Completed

- Repository safety: worked on a dedicated branch, no destructive git operations used, no
  uncommitted work discarded (tree was clean at start).
- Mobile navigation rebuilt: accessible drawer (dialog role, Escape, focus trap, focus return,
  scroll lock, 44px touch targets) replacing the horizontally-scrolling bar.
- Mobile GSAP "tea journey" scroll distance shortened (`+=450%` → `+=300%`); desktop journey
  untouched; pre-existing reduced-motion fallback verified intact.
- Typed, swappable commerce provider interface + seed/draft data (five clearly-labeled draft
  placeholder teas, all `status: "draft"`, never publicly visible).
- Full shop → product → cart flow built and working: `/shop`, `/shop/[handle]`, `/cart`,
  quantity editing, line removal, server-authoritative pricing, empty/error/not-found states,
  draft-preview mode for QA.
- Multilingual: `shopPage`/`productPage`/`cartPage` dictionary sections added for en/nl/fr,
  same structural shape enforced by TypeScript across all three.
- SEO basics on the product page: per-locale canonical + OG metadata, `Product` JSON-LD built
  only from fields already on the record (no invented facts).
- Security: `next`/`eslint-config-next` upgraded to patch a critical RCE advisory; `npm audit`
  clean; no secrets committed; `.env.example` has names only.
- Testing: Playwright E2E installed and a real suite added and passing (`npm run test:e2e`) —
  see `docs/testing-plan.md` for exactly what it covers and what it doesn't.
- `npm run check` (lint + typecheck + build) passes clean.
- Documentation: this file plus `docs/architecture.md`, `docs/commerce-architecture.md`,
  `docs/product-model.md`, `docs/content-intake-template.md`, `docs/testing-plan.md`,
  `docs/deployment.md`, `docs/decision-log.md`, `docs/audits/mobile-audit.md`, `.env.example`.

## Verified

- `npm run lint`, `npm run typecheck`, `npm run build` — all clean on this branch.
- `npm audit` — 0 vulnerabilities.
- `npx playwright test` — 3/3 passing (mobile customer journey; desktop 404; draft-privacy).
- Manual route smoke test via `curl` for every new route, both with and without preview mode.

## Blocked (needs the owner and/or credentials — cannot be completed by more coding alone)

- **Real product data.** No real tea names, prices, ingredients, origins, or stock exist
  anywhere in the repo, `Reference Documents/Photos`, or the Obsidian project memory. See
  `docs/content-intake-template.md`. Nothing can be published until this is provided and
  approved by Daniele.
- **Commerce backend decision + credentials.** Shopify (recommended) vs. alternatives — see
  `docs/commerce-architecture.md`. No Shopify account exists yet.
- **Payment provider decision + credentials.** Worldline ecommerce compatibility is unconfirmed
  (per `DISCOVERY_FINDINGS.md`). Real checkout cannot exist until this is resolved.
- **Legal verification** of the returns policy and ingredient/allergen labeling requirements
  before any of that copy is published (see `docs/content-intake-template.md`).
- **Opening hours, phone, email, Instagram handle** — still placeholders in `src/data/site.ts`
  and `src/i18n.ts` footer strings; unchanged in this session per the project's rule against
  inventing business facts.
- **Domain/Wix decision** — out of scope for this branch entirely; untouched.

## Not done, not blocked — genuine gaps to pick up next

- Visual/manual review across the full 10-viewport list in the brief (only 390×844 and
  1280×800 were driven by Playwright this session) — see `docs/audits/mobile-audit.md`.
- Language-switcher locale change isn't exercised by the E2E suite yet.
- Variant selector UI exists but has no seed product with 2+ variants to test against
  meaningfully.
- No negative-path tests yet for: invalid/tampered variant id, out-of-stock product (no seed
  product currently has that stock status), missing image, JS/network delay.
- No Lighthouse/Core Web Vitals pass was run.
- Preview deployment to Vercel was not run this session (see `docs/deployment.md` for the exact
  command — the project is already linked, this agent didn't have Vercel CLI auth available).

## Recommended next action

1. Get the content-intake table (`docs/content-intake-template.md`) filled in and approved for
   the first five teas.
2. In parallel: decide the commerce backend (Shopify strongly recommended) and get Storefront
   API credentials; decide the payment provider question (Worldline vs. Shopify Payments vs.
   other).
3. Implement the Shopify adapter behind the existing `CommerceProvider` interface — this should
   not require touching `src/app` or `src/components`.
4. Re-run and extend `tests/e2e/customer-journey.spec.ts` against the real backend, including
   finally reaching a real test-mode checkout.
5. Run the preview deployment command in `docs/deployment.md`, review it with Daniele.
6. Only then: publish the five real products and consider production deployment (explicit
   approval required — see the project's non-negotiable constraints).
