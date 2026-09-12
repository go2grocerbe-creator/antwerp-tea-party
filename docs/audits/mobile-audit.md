# Mobile & Code Audit — Antwerp Tea Party Webapp

Date: 2026-09-12
Branch: `feat/mobile-commerce-v1`
Scope: repository at `E:\ANTWERP TEA PARTY\webapp` as of commit `61ca89d` (pre-branch HEAD).

## Method

This audit is **code-based** (full read of every route, component, and the global stylesheet)
plus **automated verification**: production build, `tsc --noEmit`, ESLint, and a Playwright
E2E pass at a 390×844 mobile viewport and a 1280×800 desktop viewport driving the real customer
journey. No headless browser tool was available at session start; Playwright (`@playwright/test`)
was installed during this session specifically to verify the fixes below — see
`tests/e2e/customer-journey.spec.ts` and `docs/testing-plan.md`.

**Not done in this pass:** manual/visual screenshot review across the full stated viewport list
(320×568 through 1440×900) in a real browser window. The Playwright suite covers one mobile and
one desktop viewport functionally (no horizontal-overflow assertion, drawer behavior, full
purchase flow) but is not a substitute for eyeballing every breakpoint. Recommended next step:
`npx playwright test --project=mobile --headed` locally, or extend
`playwright.config.ts` with more viewport projects, and review before this branch is presented
to Daniele.

## Findings

Severity: P0 blocks use/checkout, P1 materially damages experience, P2 polish/maintainability.

| # | Severity | Area | Finding | Status |
|---|---|---|---|---|
| 1 | P0 | Navigation | `.site-nav` was a horizontally-scrolling bar used as the *only* mobile navigation (`overflow-x: auto` under 900px, no menu button, no drawer). Explicitly the anti-pattern called out in the project brief. | **Fixed** — `SiteHeader.tsx` rewritten with an accessible mobile drawer (`role="dialog"`, `aria-modal`, Escape-to-close, focus returned to the toggle, Tab focus trapped inside, background scroll locked). `.site-nav` now hides under 900px in favor of the drawer. |
| 2 | P1 | Touch targets | Nav links, language switcher summary/links had `min-height: 40px` (< the 44px minimum requested). | **Fixed** — bumped to 44px; cart icon button is 44×44px. |
| 3 | P1 | GSAP mobile journey | Mobile pinned ScrollTrigger sequence spanned `+=450%` of viewport height — a very long forced scroll before reaching page content, on top of the pin itself. | **Fixed** — shortened to `+=300%` on mobile only (desktop `+=560%` untouched, per brief: don't remove the desktop journey). Still recommend a follow-up pass with Daniele/real content to judge whether it should be shorter still. |
| 4 | P2 | `body { overflow-x: hidden }` | Present in `globals.css`. Investigated: this is deliberate — `.journey-leaf` elements animate to `vw`-based off-screen positions (e.g. `x: "-30vw"`) as part of the intentional GSAP sequence, which would otherwise create a horizontal scrollbar during the animation. This is a supported use (containing an intentional off-canvas animation), not concealment of a broken layout. | **Verified, not a bug.** Confirmed via the new Playwright assertions (`scrollWidth <= clientWidth` on home/shop/product/cart) that no *unwanted* horizontal overflow exists outside the animated sequence. |
| 5 | P1 | Shop/product/cart/checkout | None existed. Homepage "Teas" nav item and `#teas` anchor pointed at a marketing section, not a real catalogue. | **Built** — see `docs/commerce-architecture.md`. `/[locale]/shop`, `/[locale]/shop/[handle]`, `/[locale]/cart` now exist, backed by a typed, swappable commerce provider. |
| 6 | P2 | Header/footer duplication | `SiteHeader`/`SiteFooter` were only rendered from `HomePage`, so any new route (shop/cart) would have needed to reimplement them. | **Fixed** — hoisted into `src/app/[locale]/layout.tsx`, shared by every route under `[locale]`. |
| 7 | P2 | `next`/`eslint-config-next` version | `next@16.3.2` had a **critical** advisory (unauthenticated RCE on Windows-hosted servers; RCE in the AVIF image-optimization path) per `npm audit`. | **Fixed** — upgraded to `next@16.3.5` / `eslint-config-next@16.3.5`. `npm audit` now reports 0 vulnerabilities. |
| 8 | P2 | `next/image` LCP hint | Dev server logs: `Image with src "/images/shop-interior-wide.jpg" was detected as the Largest Contentful Paint (LCP). Please add the loading="eager" property` — surfaced when that image is used as the seed-data placeholder on the shop grid. | **Not fixed** — cosmetic dev-only warning on a *placeholder* image that will be replaced by real product photography; not worth tuning `priority`/`loading` for images that won't ship. Revisit once real product images are in `seed-data.ts`. |
| 9 | P2 | `scroll-behavior: smooth` on `<html>` | Next 16 flagged this for View Transitions compatibility. | **Fixed** — added `data-scroll-behavior="smooth"` to the root `<html>` element per the framework's own guidance. |
| 10 | P1 | Reduced motion | `@media (prefers-reduced-motion: reduce)` already had a well-built static fallback for the journey section (pre-existing, not written this session) — confirmed present and untouched. | **Verified pre-existing, good.** |

## Verified via automated checks this session

- `npm run lint` — clean.
- `npm run typecheck` (`tsc --noEmit`) — clean.
- `npm run build` — succeeds, all routes compile (`/`, `/[locale]`, `/[locale]/shop`,
  `/[locale]/shop/[handle]`, `/[locale]/cart`, `/robots.txt`, `/sitemap.xml`).
- `npm audit` — 0 vulnerabilities (was 1 critical + 2 high before the `next` upgrade).
- `npx playwright test` — 3 passing (1 mobile customer journey incl. drawer/no-overflow/
  add-to-cart/quantity-update/checkout-blocked-message/remove/empty-state; 2 desktop: 404 for
  unknown handle, draft products never public). See `docs/testing-plan.md`.

## Not verified (needs a human or a fuller visual pass)

- The full 10-viewport list in the brief (only 390×844 and 1280×800 were driven).
- iOS Safari-specific behavior (safe-area insets, address-bar viewport resize) — this session's
  Playwright run used Chromium only.
- Whether the shortened mobile GSAP scroll distance (`+=300%`) *feels* right — that's a judgment
  call best made by looking at it, ideally with Daniele's real photography in place.
- Lighthouse/Core Web Vitals numbers — not run this session.
