# Testing Plan

## What exists

- `npm run lint` (ESLint, `eslint-config-next`)
- `npm run typecheck` (`tsc --noEmit`)
- `npm run build` (production build — also runs Next's own TypeScript check)
- `npm run check` — runs all three in sequence
- `npm run test:e2e` (`playwright test`) — `tests/e2e/customer-journey.spec.ts` and
  `tests/e2e/admin-and-checkout.spec.ts`

No unit test runner (Vitest, etc.) is set up. Nothing in this codebase currently has enough
non-trivial pure logic to justify one on its own — `resolveCart`/`formatPrice`/the Zod schemas
in `src/lib/admin/schema.ts` are the closest candidates. Recommended next step if the admin/
commerce logic grows: add Vitest for those specifically, not as a blanket ask.

## E2E: what's covered

Run via `npm run test:e2e` (Playwright starts its own dev server with
`COMMERCE_PREVIEW_TOKEN=e2e-preview-token`, see `playwright.config.ts`).

**`tests/e2e/customer-journey.spec.ts`:**

1. **Mobile viewport (390×844), full customer journey:** homepage loads with no horizontal
   overflow; mobile menu opens as a real drawer, Escape closes it, focus returns to the toggle;
   shop page shows the five published demo teas (no preview token needed) with the demo-catalogue
   banner, no horizontal overflow; open Earl Grey Classic, select the 100g variant, set quantity,
   add to cart, confirmation message appears; cart shows the line with correct quantity/weight,
   quantity update via its form works, the checkout section shows the honest "not connected yet"
   message, remove the line, cart returns to its empty state.
2. **Desktop:** unknown product handle → real 404 + localized not-found page; all five demo
   teas are visible on `/shop` with no preview token; switching language via the header dropdown
   preserves the current product page (`/nl/shop/earl-grey-classic` → `/en/shop/...`, not the
   homepage).

**`tests/e2e/admin-and-checkout.spec.ts`** (exercises the real "not configured" fallback paths —
neither Supabase nor Stripe has credentials in this environment, so these are genuine, not
mocked):

3. `/admin` redirects to `/admin/login`; the login page shows the "Supabase is not configured
   yet" notice and disables the sign-in button.
4. An empty cart visiting `/checkout` redirects back to `/cart`.
5. The cart's checkout section shows the honest unavailable message and — explicitly asserted —
   there is no checkout link/button rendered at all when Stripe isn't configured.
6. `POST /api/webhooks/stripe` with no `stripe-signature` header is rejected (400 or 503,
   never a silent 200).

Run it locally:

```bash
npm run test:e2e
```

(First run downloads a Chromium binary via `npx playwright install chromium` if not already
present — this was done once during this session; `node_modules`/browser cache persists it
locally, but a fresh clone/CI runner will need to run that install step.)

## Required customer E2E journey (project brief) — mapped to what's automated vs. not

| Step | Automated? |
|---|---|
| Open mobile homepage | Yes |
| Open mobile navigation | Yes |
| Change/retain locale | Yes — locale switch now preserves the current page (fixed this session; previously always went to the homepage) |
| Open shop | Yes |
| Open a tea | Yes |
| Select package size | Yes — Earl Grey Classic has 50g/100g variants, the mobile journey test selects 100g and asserts the cart line shows it |
| Add to cart | Yes |
| Change quantity | Yes |
| Remove/re-add | Remove: yes. Re-add: not explicitly asserted, but proven idempotent-safe by `addCartLine`'s "existing line → increment quantity" branch. |
| Open checkout | Yes — reaches `/checkout` when Stripe is configured, or the cart's honest unavailable state when it isn't (both paths tested) |
| Reach a valid provider checkout in test mode | **Not possible in this environment** — no Stripe test-mode credentials were available (see `docs/handover.md`). The embedded-checkout integration itself is built and the "not connected" fallback is tested; reaching an actual Stripe test session requires real `STRIPE_SECRET_KEY`/`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` values, which this session doesn't have. **This remains the one required-journey step blocked on credentials, not on missing code.** |

## Required operator acceptance journey (project brief)

**Not automated** — Supabase has no credentials in this environment, so there's no live database
to run a real admin CRUD journey against. What *is* tested: the correct fallback behavior when
Supabase isn't configured (`/admin` → login → "not configured" notice, sign-in disabled — see
`admin-and-checkout.spec.ts`).

Manual journey once Supabase is connected (see `docs/commerce-architecture.md` "What connecting
Supabase actually requires" for the exact setup steps):

1. Sign in at `/admin` with the admin account created during setup.
2. Add a product (`/admin/products/new`), leave status as Draft, save.
3. Visit `/nl/shop` in a different browser/incognito session — confirm the draft product is
   **not** visible.
4. Back in `/admin`, publish it (status dropdown → Published, save, or the Publish action on the
   product list).
5. Refresh `/nl/shop` — confirm it now appears.
6. Archive it from the product list — confirm it disappears from `/nl/shop` again.

This exercises the same draft/publish/archive enforcement (`supabase-provider.ts` +
`supabase/migrations/0001_init.sql` RLS) that the seed provider already guarantees today for the
five demo products (they're all `published`, so this specific journey has nothing to flip yet —
worth adding a sixth, deliberately-draft product before this journey can be run against the
current environment, seed or Supabase).

## Required responsive checks (project brief)

Automated at 390×844 and 1280×800 (no-horizontal-overflow assertions on home/shop/product/
cart). Additionally, this session's mobile-redesign pass visually inspected real Chromium
screenshots at 320×568, 375×667, 390×844, 414×896, 430×932, 768×1024, and 1280×800 — see
`docs/audits/mobile-audit.md` "Round 2" for what was checked and what's still only spot-checked.

## Required negative tests (project brief) — status

| Case | Status |
|---|---|
| Unknown product handle | Automated (404 test) |
| Unavailable variant | Not automated — `addCartLine` throws on an unknown `variantId`, but no test submits a tampered/invalid variant id |
| Out-of-stock product | Not automated — `outOfStock` disables Add to Cart in `ProductDetail.tsx`, but no current seed product has `stockStatus: "out_of_stock"` to test against |
| Empty cart | Automated (end state of the mobile journey test; also the `/checkout` empty-cart redirect test) |
| Commerce API unavailable | N/A for the seed provider (in-process). For Supabase: not automated — would need a way to simulate a Supabase outage |
| Invalid cart ID | Not automated — handled gracefully (returns `null`/no-ops) in `memory-cart.ts`, not explicitly tested |
| Missing image | Not automated |
| Missing translation | Not directly testable as a runtime case — the `Dictionary` type requires all three locales to have identical keys, so it's a TypeScript build error, not a runtime state |
| Reduced-motion mode | Not automated — the CSS fallback for the desktop journey pre-dates this branch; the mobile journey has no GSAP at all as of this session, so there's nothing motion-related to disable there |
| JS/network delay | Not automated |
| Checkout-provider failure response | Partially — the webhook's signature-rejection path is tested; a Stripe API error during session creation is handled (`/api/checkout/session` returns 502) but not exercised by a test |
| Supabase unavailable fallback | **Automated** (`admin-and-checkout.spec.ts`) |
| Checkout unavailable state | **Automated** (`admin-and-checkout.spec.ts`) |

This table is intentionally honest about gaps rather than claiming a green board. Treat it as
the acceptance backlog for whoever continues this work.
