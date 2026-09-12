import type { Product } from "./types";

// SEED / DRAFT DATA ONLY.
//
// No real product names, prices, ingredients, origins, or stock data were found anywhere in
// the repository, the Reference Documents/Photos folders, or the Obsidian project memory as of
// 2026-09-12. Per the project brief (Section 6), these five records are clearly labeled draft
// placeholders — not real products — and every price/weight/SKU value is a placeholder for
// exercising the commerce architecture only.
//
// status is "draft" for all five, so listPublishedProducts() never returns them and they can
// never appear on the public storefront. Replace each record with real data from
// docs/content-intake-template.md, then flip status to "published" only after Daniele has
// approved the copy, pricing, and images.

const placeholderImage = { src: "/images/shop-interior-wide.jpg", alt: "" };

function draft(n: 1 | 2 | 3 | 4 | 5): Product {
  const id = `tea-${String(n).padStart(2, "0")}`;
  const title = `Tea 0${n} — Product details pending`;
  return {
    id,
    handle: id,
    title: { en: title, nl: title, fr: title },
    shortDescription: {
      en: "Description pending — awaiting real product data from the shop owner.",
      nl: "Beschrijving nog te bevestigen — wacht op echte productgegevens van de eigenaar.",
      fr: "Description en attente — en attente des données produit réelles du propriétaire.",
    },
    fullDescription: {
      en: "Full description pending. Do not publish until confirmed with the shop owner.",
      nl: "Volledige beschrijving nog te bevestigen. Niet publiceren zonder bevestiging.",
      fr: "Description complète en attente. Ne pas publier sans confirmation.",
    },
    category: "Category pending",
    origin: null,
    teaType: null,
    flavourNotes: [],
    ingredients: null,
    allergens: null,
    caffeineLevel: "unknown",
    brewingTemperatureCelsius: null,
    brewingTimeMinutes: null,
    dosageGramsPerLitre: null,
    featured: false,
    status: "draft",
    seoTitle: null,
    seoDescription: null,
    images: [placeholderImage],
    variants: [
      {
        id: `${id}-variant-placeholder`,
        weightLabel: "Weight pending",
        weightGrams: null,
        price: 0,
        currency: "EUR",
        sku: null,
        stockStatus: "unknown",
        inventoryQuantity: null,
      },
    ],
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
    intakeNotes:
      "Seed placeholder — fill in from docs/content-intake-template.md, then set status to 'published'.",
  };
}

export const seedProducts: Product[] = [draft(1), draft(2), draft(3), draft(4), draft(5)];
