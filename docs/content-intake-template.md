# Content Intake Template — First Five Teas

Give this table to Daniele (or fill it in together during a shop visit) for the five teas that
will launch first. One row per tea. Once a row is complete and Daniele has approved it, it can
replace one of the draft placeholders in `src/lib/commerce/seed-data.ts` — or, once Shopify is
connected, be entered directly into Shopify Admin.

**Do not publish a row until every "Requires owner approval" and "Requires legal verification"
item below it is resolved.**

| Field | Confirmed / Provisional / Missing | Notes |
|---|---|---|
| Product name (EN) | Missing | |
| Dutch name | Missing | |
| French name | Missing | |
| Category | Missing | e.g. Black, Green, Oolong, Pu Erh, Matcha, Herbal, Rare/limited |
| Origin | Missing | Country/region/estate if known — **requires owner approval** before publishing (see `src/data/origins.ts` TODO) |
| Short description (EN/NL/FR) | Missing | ~1–2 sentences, shown on the shop grid |
| Full description (EN/NL/FR) | Missing | Shown on the product page |
| Flavour notes | Missing | e.g. "smoky, malty, stone fruit" |
| Ingredients (EN/NL/FR) | Missing | **Requires legal verification** — food-product ingredient labeling has real regulatory requirements in Belgium/EU |
| Allergens (EN/NL/FR) | Missing | **Requires legal verification** |
| Caffeine level | Missing | none / low / medium / high |
| Brewing temperature | Missing | °C |
| Brewing time | Missing | minutes |
| Dosage | Missing | g per litre, or per cup |
| Package weight(s) | Missing | e.g. "50 g", "100 g" — one row per weight if a tea has more than one package size |
| Price per weight | Missing | **Requires owner approval** — real margin/pricing decision, not a developer guess |
| SKU | Missing | If Daniele's Excel/Metaxel inventory already has SKUs, reuse them |
| Stock | Missing | In stock / low stock / out of stock, and a quantity if available |
| Images | Missing | At least one product photo; more if available. Must be real photography — no stock/placeholder images on a published product |
| Featured status | Missing | Whether this tea should be highlighted (not wired into any UI yet, but recorded for later) |
| Publish approval | Missing | Explicit "yes, publish this" from Daniele — required before flipping `status` to `published` |

## Legal / compliance items to verify independently before publishing any of the five

These come from `DISCOVERY_FINDINGS.md` in the Obsidian project memory and must not be treated
as settled just because Daniele stated them as her current practice:

- **Returns policy for tea (food product).** Daniele's current understanding is that Belgian
  law restricts returns on food products — this is her stated practice, not verified legal
  advice. Confirm with an actual legal source before publishing any return policy text.
- **Ingredient/allergen labeling requirements** for a Belgian/EU ecommerce food listing.
- **Opening hours, phone, email, Instagram handle** — all currently placeholder
  ("... to be confirmed") in `src/data/site.ts` and the footer dictionary in `src/i18n.ts`.
  Do not replace these placeholders with anything other than what Daniele confirms directly.

## Where this data goes once collected

See `docs/product-model.md` for the exact field shape, and `docs/commerce-architecture.md` for
how seed data relates to a future Shopify catalogue.
