// Typed commerce interface. The storefront UI depends only on these types and on
// `getCommerceProvider()` from `./provider` — never on a specific backend. This keeps the
// commerce backend replaceable: swap the seed provider for a Shopify Storefront API adapter
// (see docs/commerce-architecture.md) without touching shop/product/cart components.

export type ProductStatus = "draft" | "published" | "archived";

export type CaffeineLevel = "none" | "low" | "medium" | "high" | "unknown";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "unknown";

export type ProductVariant = {
  id: string;
  /** Package weight label, e.g. "50 g". Free text because tea packaging is not standardized. */
  weightLabel: string;
  weightGrams: number | null;
  price: number;
  currency: string;
  sku: string | null;
  stockStatus: StockStatus;
  inventoryQuantity: number | null;
};

export type LocalizedText = {
  en: string;
  nl: string;
  fr: string;
};

export type Product = {
  id: string;
  handle: string;
  title: LocalizedText;
  shortDescription: LocalizedText;
  fullDescription: LocalizedText;
  category: string;
  origin: string | null;
  teaType: string | null;
  flavourNotes: string[];
  ingredients: LocalizedText | null;
  allergens: LocalizedText | null;
  caffeineLevel: CaffeineLevel;
  brewingTemperatureCelsius: number | null;
  brewingTimeMinutes: number | null;
  dosageGramsPerLitre: number | null;
  featured: boolean;
  status: ProductStatus;
  seoTitle: LocalizedText | null;
  seoDescription: LocalizedText | null;
  images: { src: string; alt: string }[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  /** Free-text notes for whoever is filling in real data — never shown to customers. */
  intakeNotes?: string;
};

export type CartLine = {
  id: string;
  productHandle: string;
  variantId: string;
  quantity: number;
};

export type Cart = {
  id: string;
  lines: CartLine[];
  createdAt: string;
  updatedAt: string;
};

/**
 * Minimum surface every commerce backend (seed data today, Shopify Storefront API later) must
 * implement. UI components call this interface only — see docs/commerce-architecture.md.
 */
export type CommerceProvider = {
  /** Published products only. Draft/archived must never be returned here. */
  listPublishedProducts(opts?: { includeDrafts?: boolean }): Promise<Product[]>;
  getProductByHandle(handle: string, opts?: { includeDrafts?: boolean }): Promise<Product | null>;
  createCart(): Promise<Cart>;
  getCart(cartId: string): Promise<Cart | null>;
  addCartLine(
    cartId: string,
    variantId: string,
    productHandle: string,
    quantity: number,
    opts?: { includeDrafts?: boolean },
  ): Promise<Cart>;
  updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart>;
  removeCartLine(cartId: string, lineId: string): Promise<Cart>;
  /**
   * Returns a hosted checkout URL, or null when no real payment provider is connected yet.
   * The UI must never fabricate a fake checkout when this returns null — see
   * docs/commerce-architecture.md "Checkout is not live yet".
   */
  getCheckoutUrl(cartId: string): Promise<string | null>;
};
