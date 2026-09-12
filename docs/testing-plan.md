# Testing Plan

## What exists

- `npm run lint` (ESLint, `eslint-config-next`)
- `npm run typecheck` (`tsc --noEmit`)
- `npm run build` (production build — also runs Next's own TypeScript check)
- `npm run check` — runs all three in sequence
- `npm run test:e2e` (`playwright test`) — `tests/e2e/customer-journey.spec.ts`

No unit test runner (Vitest, etc.) is set up. Nothing in this codebase currently has enough
non-trivial pure logic to justify one on its own — `resolveCart`/`formatPrice` are the closest
candidates. Recommended next step if the commerce logic grows: add Vitest for
`src/lib/commerce/provider.ts` and `src/lib/format.ts` specifically, not as a blanket ask.

## E2E: what's covered

`tests/e2e/customer-journey.spec.ts`, run via `npm run test:e2e` (starts its own dev server
with `COMMERCE_PREVIEW_TOKEN=e2e-preview-token`, see `playwright.config.ts`):

1. **Mobile viewport (390×844), full customer journey:**
   - Homepage loads, no horizontal overflow.
   - Mobile menu opens as a real drawer (not a horizontally-scrolling bar), Escape closes it,
     focus returns to the toggle button.
   - Shop page (preview mode) shows the draft seed teas, no horizontal overflow.
   - Open a product, set quantity, add to cart, confirmation message appears.
   - Cart page: line item present with correct quantity, quantity update via its form works,
     the checkout section shows the **honest "not connected yet" message** (not a fake
     checkout link), remove the line, cart returns to its empty state.
2. **Desktop (1280×800):**
   - Unknown product handle → real `404` + localized not-found page.
   - Draft products never appear on the public `/shop` without the preview token, and
     `/shop/tea-01` (a real seed handle) 404s without it.

Run it locally:

```bash
npm run test:e2e
```

(First run downloads a Chromium binary via `npx playwright install chromium` if not already
present — this was done once during this session; `node_modules`/browser cache persists it
locally, but a fresh clone/CI runner will need to run that install step. Consider adding a CI
step / `postinstall` note rather than assuming the binary is always present.)

## Required customer E2E journey (project brief) — mapped to what's automated vs. not

| Step | Automated? |
|---|---|
| Open mobile homepage | Yes |
| Open mobile navigation | Yes |
| Change/retain locale | **Not automated** — language switcher is a `<details>` dropdown; straightforward to add, not done this session |
| Open shop | Yes |
| Open a tea | Yes |
| Select package size | **Not automated** — the seed data only has one variant per product (real teas may have multiple weights); the variant-selector UI exists (`ProductDetail.tsx` `fieldset.variant-selector`) but needs a product with 2+ variants to exercise meaningfully. Add a second seed variant, or test once real multi-weight product data exists. |
| Add to cart | Yes |
| Change quantity | Yes |
| Remove/re-add | Remove: yes. Re-add: not explicitly asserted, but the add-to-cart step is proven idempotent-safe by `addCartLine`'s "existing line → increment quantity" branch in `provider.ts`. |
| Open checkout | Yes — reaches the cart's checkout section |
| Reach a valid provider checkout in test mode | **Not possible yet** — no payment provider is connected (see `docs/commerce-architecture.md`). The test instead asserts the honest "checkout not connected yet" state. **This is the one required-journey step that cannot be completed until a commerce backend + payment provider is chosen and credentials are available.** |

## Required operator acceptance journey (project brief)

**Not automated, and not currently possible to automate** — there is no admin/product-management
UI in this codebase (by design; Shopify Admin is the intended surface, see
`docs/commerce-architecture.md`). Until Shopify (or another backend) is connected:

- Manual equivalent today: edit `src/lib/commerce/seed-data.ts` directly (change price/stock/
  description, flip `status` between `"draft"`/`"published"`), confirm via
  `npm run dev` that a draft stays invisible at `/nl/shop` and visible only via
  `?preview=<COMMERCE_PREVIEW_TOKEN>`, then flip to `"published"` and confirm it appears on the
  public shop page without the query param, then flip to `"archived"` and confirm it disappears
  again. This exercises the same draft/publish/archive *logic* (`provider.ts` filtering) that a
  real backend would need to preserve, but it is source-code editing, not an operator workflow.
- Once Shopify Admin is connected, this journey becomes: log into Shopify Admin, create/edit a
  product, keep as draft, confirm it's not on the storefront, publish, confirm it appears,
  unpublish/archive, confirm it disappears. That is standard Shopify Admin behavior and doesn't
  need custom code in this repo to work — the `getCommerceProvider()` swap is what connects it.

## Required responsive checks (project brief)

Automated at 390×844 and 1280×800 (no-horizontal-overflow assertions on home/shop/product/
cart). **Not automated** across the full stated viewport list (320×568 through 1440×900) — see
`docs/audits/mobile-audit.md` "Not verified" section for the honest gap and recommended
follow-up.

## Required negative tests (project brief) — status

| Case | Status |
|---|---|
| Unknown product handle | Automated (404 test above) |
| Unavailable variant | Not automated — `addCartLine` throws on an unknown `variantId` (`provider.ts`), but no test exercises submitting a tampered/invalid variant id |
| Out-of-stock product | Not automated — `outOfStock` disables the Add to Cart button in `ProductDetail.tsx`, but no seed product currently has `stockStatus: "out_of_stock"` to test against |
| Empty cart | Automated (end state of the mobile journey test) |
| Commerce API unavailable | N/A in current architecture — the seed provider is in-process, can't be "down" independently of the app itself. Revisit once a real network-backed provider (Shopify) exists. |
| Invalid cart ID | Not automated — `getCart`/`updateCartLine`/`removeCartLine` handle a missing/unknown cart id gracefully (return `null` or no-op) in `provider.ts`/`actions.ts`, not explicitly tested |
| Missing image | Not automated |
| Missing translation | Not directly testable as a runtime case — the `Dictionary` type requires all three locales to have identical keys, so a "missing translation" is a TypeScript build error, not a runtime state (see `docs/architecture.md`) |
| Reduced-motion mode | Not automated this session — the CSS fallback pre-dates this branch (see `docs/audits/mobile-audit.md` #10) |
| JS/network delay | Not automated |
| Checkout-provider failure response | N/A — no provider connected yet |

This table is intentionally honest about gaps rather than claiming a green board. Treat it as
the acceptance backlog for whoever continues this work.
