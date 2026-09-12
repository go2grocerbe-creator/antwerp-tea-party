# Product Model

Defined in `src/lib/commerce/types.ts`. This is the shape every commerce backend (seed data
today, Shopify Storefront API later) must provide. Not every field is displayed publicly in
this first release, but the type exists so adding real data later never requires a component
rewrite.

## `Product`

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Internal id. |
| `handle` | `string` | URL slug — `/shop/[handle]`. Stable; don't change after publishing (SEO). |
| `title` | `{ en, nl, fr }` | Localized. |
| `shortDescription` | `{ en, nl, fr }` | Shown on the shop grid card. |
| `fullDescription` | `{ en, nl, fr }` | Shown on the product page. |
| `category` | `string` | Free text for now (e.g. "Rare teas", "Pu Erh"). Not localized yet — flag if Daniele wants localized category names. |
| `origin` | `string \| null` | Unverified until confirmed with Daniele — see `src/data/origins.ts` TODO. |
| `teaType` | `string \| null` | e.g. "Black", "Oolong". |
| `flavourNotes` | `string[]` | |
| `ingredients` | `{ en, nl, fr } \| null` | Legal-adjacent — do not auto-translate without human review (see `docs/content-intake-template.md`). |
| `allergens` | `{ en, nl, fr } \| null` | Same caveat as ingredients. |
| `caffeineLevel` | `"none" \| "low" \| "medium" \| "high" \| "unknown"` | |
| `brewingTemperatureCelsius` | `number \| null` | |
| `brewingTimeMinutes` | `number \| null` | |
| `dosageGramsPerLitre` | `number \| null` | |
| `featured` | `boolean` | Reserved for future homepage/shop highlighting — not wired into any UI yet. |
| `status` | `"draft" \| "published" \| "archived"` | Enforced in `provider.ts`: `listPublishedProducts`/`getProductByHandle` never return draft/archived to the public path. |
| `seoTitle`, `seoDescription` | `{ en, nl, fr } \| null` | Falls back to `title`/`shortDescription` in `generateMetadata` when absent. |
| `images` | `{ src, alt }[]` | First image used as the OG/structured-data image. |
| `variants` | `ProductVariant[]` | See below. |
| `createdAt`, `updatedAt` | ISO timestamp strings | |
| `intakeNotes` | `string?` | Internal-only, never rendered to customers — for whoever is filling in real data. |

## `ProductVariant`

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | |
| `weightLabel` | `string` | Free text (e.g. "50 g", "100 g tin") — tea packaging isn't standardized enough for a fixed enum. |
| `weightGrams` | `number \| null` | Structured value for future filtering/sorting. |
| `price` | `number` | Major currency units (e.g. `12.5` = €12.50). **Never trust a client-supplied price** — `addCartLine` always re-reads price from the catalogue server-side (`resolveCart` in `provider.ts`). |
| `currency` | `string` | ISO 4217, e.g. `"EUR"`. |
| `sku` | `string \| null` | |
| `stockStatus` | `"in_stock" \| "low_stock" \| "out_of_stock" \| "unknown"` | Drives the badge on the shop grid and disables Add to Cart when `out_of_stock`. |
| `inventoryQuantity` | `number \| null` | Not displayed yet; reserved for a future "only 3 left" style message once real inventory data exists. |

## Status lifecycle

`draft → published → archived`, with `published → draft`/`archived → published` (restore)
supported by the type (any `status` value can be set) — the actual lifecycle UI lives in
whatever commerce backend is connected (Shopify Admin, once set up), not in this codebase.

## Seed data vs. real data

`src/lib/commerce/seed-data.ts` currently holds **five draft placeholder records** ("Tea 01 —
Product details pending" … "Tea 05"). No real tea names, prices, origins, or stock data were
found in the repository, `Reference Documents/Photos`, or the Obsidian project memory as of
2026-09-12 — see `docs/content-intake-template.md` for what's needed from Daniele before these
can become real, publishable products.
