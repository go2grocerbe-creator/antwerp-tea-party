# Commerce Architecture

Status: **foundation built, no real commerce backend connected yet.** This document explains
what exists today, why, and exactly what's needed to connect a real backend.

## The typed commerce interface

Every commerce operation the storefront needs goes through one interface:
`src/lib/commerce/types.ts` → `CommerceProvider`:

```ts
listPublishedProducts(opts?)
getProductByHandle(handle, opts?)
createCart()
getCart(cartId)
addCartLine(cartId, variantId, productHandle, quantity, opts?)
updateCartLine(cartId, lineId, quantity)
removeCartLine(cartId, lineId)
getCheckoutUrl(cartId)
```

No UI component imports a specific backend. Every route/component calls
`getCommerceProvider()` from `src/lib/commerce/index.ts`, which currently returns
`seedCommerceProvider` (`src/lib/commerce/provider.ts`). **Swapping to Shopify means changing
one line in `index.ts`** — nothing else in `src/app` or `src/components` needs to change,
provided the Shopify adapter implements the same interface.

## What's running today: the seed provider

`src/lib/commerce/provider.ts` implements `CommerceProvider` against
`src/lib/commerce/seed-data.ts` — five **draft** placeholder tea records (see
`docs/product-model.md` and `docs/content-intake-template.md`). It exists so the full
storefront (shop grid, product page, cart, quantity edit, remove) can be built and tested
*before* a commerce backend is connected, per the project brief's "don't build a fragile mock
shop" instruction — it's the same typed interface a real backend will implement, not a
one-off mock scattered through components.

Known, intentional limitations of the seed provider:

- **Cart storage is in-memory** (a `Map` in the server process). It resets on server
  restart/redeploy. This is expected and fine for local development and this demo branch — it
  is **not** a production cart store. A Shopify Storefront API adapter would use Shopify's own
  cart tokens instead.
- **`getCheckoutUrl()` always returns `null`.** No payment provider is connected. The cart page
  (`src/app/[locale]/cart/page.tsx`) checks for this and renders a clear
  "checkout is not connected yet" message — it never fabricates a fake checkout link or a fake
  success page. This satisfies the project's hard constraint: *"Do not create a fake checkout."*

## Draft-preview mode

Draft products must never be publicly visible (`listPublishedProducts` filters them out by
default), but the owner/developer still needs to review them before publishing, and this
session needed a way to exercise the full cart flow end-to-end without real product data.

Set `COMMERCE_PREVIEW_TOKEN` in the environment. Appending `?preview=<token>` to `/shop` or
`/shop/[handle]` shows drafts; the token is also threaded into the add-to-cart form (hidden
field) so a draft item can be added to a preview cart — `addToCartAction` independently
re-checks the token server-side before allowing a draft into the cart (never trusts the page
having shown it). Without the env var set, preview mode is inert — nobody can guess their way
into drafts by adding a query param, and by default this variable is unset in production.

This is **not** a CMS preview system and shouldn't be treated as one long-term — it's a stopgap
until Shopify Admin (which has its own preview/draft workflow) is connected.

## Payment/checkout decision — NOT YET DECIDED

Per `DISCOVERY_FINDINGS.md` and `COMMERCIAL_MODELS.md` in the Obsidian project memory, this is
still open. Options, as the project brief frames them:

| Option | Notes |
|---|---|
| Shopify Payments (Bancontact, cards, wallets) | Simplest integration with the recommended Shopify backend. Availability/fees for a Belgian merchant not yet confirmed. |
| Shopify + a compatible third-party gateway | If Shopify Payments doesn't cover a required method. |
| Direct Worldline integration | Daniele's existing in-store provider. **Unconfirmed whether Worldline supports ecommerce for this account, at what fee, and with what integration path** — this is explicitly listed as an open question in `DISCOVERY_FINDINGS.md` → Payments. |
| Custom Supabase-based commerce backend | Only if Shopify Admin is proven insufficient — not yet evaluated, and the brief requires documenting *why* before choosing this. |

**Recommendation (unchanged from the project brief's default):** Shopify Storefront API +
Shopify Admin, because it removes custom handling of card data, tax, inventory, and checkout
security — directly serving the project's actual goal (reduce Daniele's operational load), not
just a prettier storefront.

**Nothing here should be read as a commitment.** No Shopify account, API credentials, or
Worldline agreement exists yet. This document exists so the next engineer (or Claude session)
doesn't have to rediscover the decision space.

## What connecting Shopify actually requires

1. A Shopify store (any plan with Storefront API access) and a Storefront API access token.
2. Environment variables (see `.env.example`): `SHOPIFY_STORE_DOMAIN`,
   `SHOPIFY_STOREFRONT_API_TOKEN`, `SHOPIFY_STOREFRONT_API_VERSION`.
3. A new file, e.g. `src/lib/commerce/shopify-provider.ts`, implementing `CommerceProvider`
   against the Shopify Storefront GraphQL API (product/cart queries, `cartCreate`,
   `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, and the cart's `checkoutUrl`).
4. Swap the single line in `src/lib/commerce/index.ts`.
5. Five real, owner-approved product records entered in Shopify Admin (see
   `docs/content-intake-template.md`), published only once approved.
6. A payment method configured in Shopify (see decision above) and tested in Shopify's test/
   sandbox mode before going live.
7. Re-run `tests/e2e/customer-journey.spec.ts` against the real backend and extend it to reach
   the actual hosted checkout page (the current suite deliberately stops at "checkout not
   connected yet" because that is the true current state).

None of this requires touching the Wix site, the domain, or activating production payments —
all of which remain untouched per the project's non-negotiable constraints.
