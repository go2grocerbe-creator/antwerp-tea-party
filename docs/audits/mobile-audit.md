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

## Not verified (needs a human or a fuller visual pass) — as of the first pass

- The full 10-viewport list in the brief (only 390×844 and 1280×800 were driven).
- iOS Safari-specific behavior (safe-area insets, address-bar viewport resize) — this session's
  Playwright run used Chromium only.
- Whether the shortened mobile GSAP scroll distance (`+=300%`) *feels* right — that's a judgment
  call best made by looking at it, ideally with Daniele's real photography in place.
- Lighthouse/Core Web Vitals numbers — not run this session.

---

# Round 2 — Visual Correction (2026-09-12, same day)

The first pass's "shorten the pin" fix (`+=450%` → `+=300%`) was **not adequate** — it was still
a pinned/scrubbed animation, which on a static viewport produces a long blank scroll region
(content that's only visible via scroll-linked animation renders as empty space when the
animation itself hasn't run). Confirmed via real Chromium screenshots at this session's start,
taken with Playwright and inspected directly (not just overflow assertions).

## Method this round

Installed Chromium via Playwright (already present from the first pass), wrote a throwaway
full-page screenshot script (`node .scratch-screenshot.js`, deleted before each commit — not part
of the repo), and **visually read every screenshot** rather than relying only on automated
assertions, per this round's explicit instruction. Verified via `npx tsc --noEmit`, `npm run
lint`, `npm run build`, and the full `npx playwright test` suite after each change.

## Before (confirmed via screenshot at 375×667, 390×844, 320×568)

- **Origin journey:** roughly 1/3 of the total page height was blank white space directly under
  the hero, before the shop-interior photo section — the pinned scroll spacer with no visible
  content (leaf/tin/shelf stages default to `opacity: 0`, only revealed by the scroll-linked
  GSAP timeline, which a static screenshot doesn't execute).
- **Tea-table section:** the chair illustration (`isolatedChair`) rendered directly on top of
  the "Sommige thee smaakt beter samen." headline — both elements shared `grid-row: 1` /
  `grid-column: 1` on the same single-column mobile grid, with only a `margin-bottom: 260px`
  hack (unreliable across heading lengths) attempting to keep them apart.

## What changed

1. **`OriginJourney.tsx` / `globals.css`** — mobile (<769/901px, see below) now renders a
   completely separate `MobileJourney` component: plain document flow, no GSAP, six stacked
   stages (headline+cup image, short origin statement, leaf+origin chips, tin image, "Preserved
   with care" text directly below the tin image with no overlap, shop photo+CTA linking to
   `/shop`). Desktop's pinned `+=560%` timeline is completely untouched — verified via a
   1280×800 screenshot showing the same composition as before this round. The mobile/desktop
   split breakpoint was unified to 901px (previously an inconsistent mix of 768px in the GSAP
   `matchMedia` calls and 900px in the CSS media queries).
2. **`TeaTableSection` mobile CSS** — `.tea-table` switched to `display: flex; flex-direction:
   column`, `.tea-table__copy` at `order: 1`, `.tea-table__chair` at `order: 2`, chair rendered
   as its own contained box (fixed aspect-ratio, `width: min(74vw, 300px)`, margin-centered)
   below the CTA buttons. No JSX changes — same markup, order is CSS-only, so desktop's
   overlapping grid composition (restored at ≥901px) is unaffected.
3. **`.site-header` mobile padding** tightened slightly (16px → 12px, `align-items: center`
   instead of `flex-start`) now that `.site-nav` no longer needs wrap allowance below 900px (it
   was already replaced by the drawer in the first pass).
4. Fixed an `Image` `sizes` prop dev warning on the new mobile shop-stage image
   (`100vw` → `(max-width: 900px) 90vw, 100vw`, matching its actual rendered width).

## After — screenshots taken and visually inspected (not just overflow-asserted)

- **320×568, 375×667, 390×844, 414×896, 430×932, 768×1024, 1280×800**: no horizontal overflow
  (`scrollWidth === clientWidth` at every width, confirmed via `page.evaluate`), no blank gap
  after the hero, no headline/artwork overlap anywhere.
- **Tea-table specifically**: initially *looked* like the chair had disappeared in the
  full-page screenshot — it's a small (~280×209px) image on a near-white background, easy to
  miss in a heavily downscaled thumbnail. Re-verified with a full-resolution, element-scoped
  screenshot (`locator('.tea-table').screenshot()`) plus `boundingBox()`/`isVisible()` checks:
  the chair renders correctly, fully visible, cleanly below the CTA row, no overlap.
- **Header at 320px** (dedicated crop + screenshot): wordmark readable on two lines, cart icon +
  language dropdown + menu button fit with clear spacing, all comfortably ≥44px targets.
- **Desktop 1280×800**: re-confirmed unchanged — pinned journey (still shows a static screenshot
  as a mostly-blank scroll spacer, which is *expected and correct* for a scroll-scrubbed
  animation captured at scroll position 0, not a regression) and the tea-table's overlapping
  grid composition both intact.
- `npx playwright test`: full suite (8 tests across both spec files by this point in the
  session, see `docs/testing-plan.md`) passing, including the mobile drawer/no-overflow
  assertions on the actual rendered page.

## Still not verified

- 414×896 and 430×932 were captured but only spot-checked (not read screenshot-by-screenshot to
  the same depth as 320/375/390/768/1280) — worth a final pass before this branch is presented.
- iOS Safari-specific rendering — this session used Chromium only throughout.
- Whether the mobile journey's six-stage pacing *reads well* with Daniele's real photography —
  current images are the pre-existing placeholder/demo assets.

---

# Round 3 — Restoring Motion (2026-09-12, later the same day)

**Round 2's static replacement was subsequently judged insufficient** — it fixed the blank-space
and overlap defects but removed the cinematic scroll-driven transformation that was the
homepage's central concept, reducing it to a list of static images. A third pass added a
dedicated, purpose-built mobile GSAP timeline (kept pinned, but composed and timed specifically
for portrait screens) and demoted the Round 2 static version to the `prefers-reduced-motion`
fallback only.

Full detail — desktop timeline inventory, mobile timeline design, phase labels, scroll-distance
testing, a critical desktop-regression bug found and fixed during this pass, viewport coverage,
and the motion recording review — is in **`docs/audits/mobile-motion-story-audit.md`**, not
duplicated here.
