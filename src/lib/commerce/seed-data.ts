import type { Product, ProductVariant } from "./types";

// DEMO CATALOGUE — published for demonstration only, not real Antwerp Tea Party products.
//
// No real product names, prices, ingredients, origins, or stock data were found anywhere in
// the repository, the Reference Documents/Photos folders, or the Obsidian project memory. These
// five records are generic, well-known tea styles (Earl Grey, English Breakfast, Sencha,
// Chamomile, Rooibos) with reasonable demonstration copy, prices, and imagery, so the shop,
// product, and cart flow can be reviewed and demoed end-to-end.
//
// They are marked status: "published" so they render on the storefront without a preview
// token, but every page that lists or shows them also renders <DemoCatalogueBanner> (see
// src/components/shop/DemoCatalogueBanner.tsx) in any environment that isn't a real production
// deploy - see docs/product-model.md "Demo catalogue vs. real data". Replace each record with
// real data from docs/content-intake-template.md, get Daniele's explicit approval, and only
// then remove the demo banner condition for that environment.
//
// No medical/health claims, no specific origin, no organic certification, and no asserted
// allergen status are made - allergens are explicitly marked "to be confirmed" rather than
// guessed, and caffeine level reflects only the generic, textbook characteristic of the tea
// type (e.g. black tea is generally caffeinated), not a lab-verified fact about this specific
// demo batch.

function variant(sku: string, weightGrams: 50 | 100, price: number): ProductVariant {
  return {
    id: `${sku}-${weightGrams}`,
    weightLabel: `${weightGrams} g`,
    weightGrams,
    price,
    currency: "EUR",
    sku: `${sku}-${weightGrams}`,
    stockStatus: "in_stock",
    inventoryQuantity: 25,
  };
}

const pendingAllergens = {
  en: "Allergen information to be confirmed — demo product.",
  nl: "Allergeneninformatie nog te bevestigen — demoproduct.",
  fr: "Informations sur les allergènes à confirmer — produit de démonstration.",
};

export const seedProducts: Product[] = [
  {
    id: "earl-grey-classic",
    handle: "earl-grey-classic",
    title: { en: "Earl Grey Classic", nl: "Earl Grey Classic", fr: "Earl Grey Classic" },
    shortDescription: {
      en: "A classic black tea scented with bergamot — bright, citrus, and familiar.",
      nl: "Een klassieke zwarte thee op smaak gebracht met bergamot — fris, citrusachtig en herkenbaar.",
      fr: "Un thé noir classique parfumé à la bergamote — vif, citronné et reconnaissable.",
    },
    fullDescription: {
      en: "Earl Grey Classic pairs a smooth black tea base with the bright citrus aroma of bergamot. A dependable everyday cup, equally good with milk or on its own.",
      nl: "Earl Grey Classic combineert een zachte zwarte thee met de frisse citrusgeur van bergamot. Een betrouwbare dagelijkse kop, lekker met melk of puur.",
      fr: "Earl Grey Classic associe une base de thé noir onctueuse à l'arôme citronné vif de la bergamote. Une tasse fiable au quotidien, aussi bonne avec du lait que nature.",
    },
    category: "Black tea",
    origin: null,
    teaType: "Black",
    flavourNotes: ["Bergamot", "Citrus", "Malty black tea"],
    ingredients: {
      en: "Black tea, natural bergamot flavouring.",
      nl: "Zwarte thee, natuurlijk bergamotaroma.",
      fr: "Thé noir, arôme naturel de bergamote.",
    },
    allergens: pendingAllergens,
    caffeineLevel: "high",
    brewingTemperatureCelsius: 95,
    brewingTimeMinutes: 4,
    dosageGramsPerLitre: 10,
    featured: true,
    status: "published",
    seoTitle: null,
    seoDescription: null,
    images: [
      { src: "/images/tea-wall-silver-tins-angle.jpg", alt: "Tea tins on wooden shelving, representative demo photography." },
    ],
    variants: [variant("DEMO-EARLGREY", 50, 5.95), variant("DEMO-EARLGREY", 100, 9.95)],
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
    intakeNotes: "Demo product — replace with real data from docs/content-intake-template.md before treating as a real listing.",
  },
  {
    id: "english-breakfast",
    handle: "english-breakfast",
    title: { en: "English Breakfast", nl: "English Breakfast", fr: "English Breakfast" },
    shortDescription: {
      en: "A robust, malty black tea blend built for a strong morning cup.",
      nl: "Een stevige, mouterige zwarte thee, gemaakt voor een sterke kop in de ochtend.",
      fr: "Un mélange de thé noir robuste et malté, pensé pour une tasse forte au réveil.",
    },
    fullDescription: {
      en: "English Breakfast is a full-bodied blend of black teas, malty and robust enough to stand up to milk and a good breakfast. A everyday classic.",
      nl: "English Breakfast is een volle blend van zwarte theeën, mouterig en stevig genoeg voor melk en een goed ontbijt. Een dagelijkse klassieker.",
      fr: "English Breakfast est un mélange de thés noirs corsé, malté et suffisamment robuste pour accompagner le lait et un bon petit-déjeuner. Un classique du quotidien.",
    },
    category: "Black tea",
    origin: null,
    teaType: "Black",
    flavourNotes: ["Malty", "Robust", "Smooth"],
    ingredients: {
      en: "Black tea blend.",
      nl: "Blend van zwarte thee.",
      fr: "Mélange de thé noir.",
    },
    allergens: pendingAllergens,
    caffeineLevel: "high",
    brewingTemperatureCelsius: 100,
    brewingTimeMinutes: 4,
    dosageGramsPerLitre: 10,
    featured: false,
    status: "published",
    seoTitle: null,
    seoDescription: null,
    images: [
      { src: "/images/black-tea-tin-detail.jpg", alt: "Black tea storage tins, representative demo photography." },
    ],
    variants: [variant("DEMO-BREAKFAST", 50, 5.95), variant("DEMO-BREAKFAST", 100, 9.95)],
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
    intakeNotes: "Demo product — replace with real data from docs/content-intake-template.md before treating as a real listing.",
  },
  {
    id: "green-sencha",
    handle: "green-sencha",
    title: { en: "Green Sencha", nl: "Groene Sencha", fr: "Sencha Vert" },
    shortDescription: {
      en: "A light, grassy green tea with a clean, gently vegetal finish.",
      nl: "Een lichte, grasachtige groene thee met een zuivere, licht groenige afdronk.",
      fr: "Un thé vert léger et herbacé, à la finale nette et délicatement végétale.",
    },
    fullDescription: {
      en: "Green Sencha is a light, everyday green tea — grassy and gently vegetal, best brewed a little cooler and shorter than black tea for a clean, refreshing cup.",
      nl: "Groene Sencha is een lichte, dagelijkse groene thee — grasachtig en licht groenig, het lekkerst gezet op een iets lagere temperatuur en korter dan zwarte thee voor een frisse kop.",
      fr: "Sencha Vert est un thé vert léger du quotidien — herbacé et délicatement végétal, à préparer à une température un peu plus basse et plus brièvement que le thé noir pour une tasse fraîche et nette.",
    },
    category: "Green tea",
    origin: null,
    teaType: "Green",
    flavourNotes: ["Grassy", "Vegetal", "Light sweetness"],
    ingredients: {
      en: "Green tea.",
      nl: "Groene thee.",
      fr: "Thé vert.",
    },
    allergens: pendingAllergens,
    caffeineLevel: "medium",
    brewingTemperatureCelsius: 80,
    brewingTimeMinutes: 2,
    dosageGramsPerLitre: 8,
    featured: false,
    status: "published",
    seoTitle: null,
    seoDescription: null,
    images: [
      { src: "/images/porcelain-detail.jpg", alt: "Porcelain tea bowls, representative demo photography." },
    ],
    variants: [variant("DEMO-SENCHA", 50, 5.95), variant("DEMO-SENCHA", 100, 9.95)],
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
    intakeNotes: "Demo product — replace with real data from docs/content-intake-template.md before treating as a real listing.",
  },
  {
    id: "chamomile-blossom",
    handle: "chamomile-blossom",
    title: { en: "Chamomile Blossom", nl: "Kamille Bloesem", fr: "Fleur de Camomille" },
    shortDescription: {
      en: "A caffeine-free herbal infusion of whole chamomile flowers — floral and calming.",
      nl: "Een cafeïnevrije kruideninfusie van hele kamillebloemen — bloemig en rustgevend.",
      fr: "Une infusion sans caféine à base de fleurs de camomille entières — florale et apaisante.",
    },
    fullDescription: {
      en: "Chamomile Blossom is a gentle, caffeine-free herbal infusion made from whole chamomile flowers. Floral, lightly honeyed, and a natural fit for the evening.",
      nl: "Kamille Bloesem is een zachte, cafeïnevrije kruideninfusie van hele kamillebloemen. Bloemig, licht honingachtig en ideaal voor de avond.",
      fr: "Fleur de Camomille est une infusion douce et sans caféine, préparée à partir de fleurs de camomille entières. Florale, légèrement miellée, idéale en soirée.",
    },
    category: "Herbal infusion",
    origin: null,
    teaType: "Herbal infusion",
    flavourNotes: ["Floral", "Honeyed", "Calming"],
    ingredients: {
      en: "Whole chamomile flowers.",
      nl: "Hele kamillebloemen.",
      fr: "Fleurs de camomille entières.",
    },
    allergens: pendingAllergens,
    caffeineLevel: "none",
    brewingTemperatureCelsius: 100,
    brewingTimeMinutes: 5,
    dosageGramsPerLitre: 10,
    featured: false,
    status: "published",
    seoTitle: null,
    seoDescription: null,
    images: [
      { src: "/images/teapot-display.jpg", alt: "Colorful teapots and tea tins on display, representative demo photography." },
    ],
    variants: [variant("DEMO-CHAMOMILE", 50, 5.95), variant("DEMO-CHAMOMILE", 100, 9.95)],
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
    intakeNotes: "Demo product — replace with real data from docs/content-intake-template.md before treating as a real listing.",
  },
  {
    id: "rooibos-vanilla",
    handle: "rooibos-vanilla",
    title: { en: "Rooibos Vanilla", nl: "Rooibos Vanille", fr: "Rooibos Vanille" },
    shortDescription: {
      en: "A caffeine-free rooibos infusion with warm, naturally sweet vanilla.",
      nl: "Een cafeïnevrije rooibosinfusie met een warme, van nature zoete vanillesmaak.",
      fr: "Une infusion de rooibos sans caféine, aux notes chaudes et naturellement sucrées de vanille.",
    },
    fullDescription: {
      en: "Rooibos Vanilla combines naturally caffeine-free South African-style rooibos with warm vanilla. Smooth, lightly sweet, and gentle enough for any time of day.",
      nl: "Rooibos Vanille combineert van nature cafeïnevrije rooibos met een warme vanillesmaak. Zacht, licht zoet en geschikt voor elk moment van de dag.",
      fr: "Rooibos Vanille associe un rooibos naturellement sans caféine à une chaude saveur de vanille. Onctueux, légèrement sucré, adapté à tout moment de la journée.",
    },
    category: "Herbal infusion",
    origin: null,
    teaType: "Herbal infusion (rooibos)",
    flavourNotes: ["Vanilla", "Woody", "Naturally sweet"],
    ingredients: {
      en: "Rooibos, natural vanilla flavouring.",
      nl: "Rooibos, natuurlijk vanillearoma.",
      fr: "Rooibos, arôme naturel de vanille.",
    },
    allergens: pendingAllergens,
    caffeineLevel: "none",
    brewingTemperatureCelsius: 100,
    brewingTimeMinutes: 6,
    dosageGramsPerLitre: 10,
    featured: false,
    status: "published",
    seoTitle: null,
    seoDescription: null,
    images: [
      { src: "/images/teapot-detail.jpg", alt: "Decorative porcelain teapot and cup, representative demo photography." },
    ],
    variants: [variant("DEMO-ROOIBOS", 50, 5.95), variant("DEMO-ROOIBOS", 100, 9.95)],
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
    intakeNotes: "Demo product — replace with real data from docs/content-intake-template.md before treating as a real listing.",
  },
];
