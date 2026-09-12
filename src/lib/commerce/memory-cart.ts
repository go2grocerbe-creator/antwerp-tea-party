import type { Cart, CartLine, Product } from "./types";

// Shared in-memory cart engine, parameterized by a product lookup so both the seed provider
// (src/lib/commerce/provider.ts) and the Supabase provider (src/lib/commerce/supabase-provider.ts)
// can reuse identical, already-tested cart logic instead of duplicating it. Cart storage itself
// is in-memory regardless of where product data comes from - see docs/commerce-architecture.md
// "What connecting Shopify actually requires" for the tradeoffs; a real payment integration
// (Stripe or otherwise) re-resolves authoritative price at checkout-session creation time
// regardless of this cart store, so this limitation does not create a pricing-trust gap.

const carts = new Map<string, Cart>();

function now() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 11)}${Date.now().toString(36)}`;
}

export type ProductLookup = (
  handle: string,
  includeDrafts: boolean,
) => Promise<Product | null>;

export function createMemoryCartMethods(findProduct: ProductLookup) {
  function findVariant(product: Product, variantId: string) {
    return product.variants.find((v) => v.id === variantId) ?? null;
  }

  return {
    async createCart(): Promise<Cart> {
      const cart: Cart = { id: newId("cart"), lines: [], createdAt: now(), updatedAt: now() };
      carts.set(cart.id, cart);
      return cart;
    },

    async getCart(cartId: string): Promise<Cart | null> {
      return carts.get(cartId) ?? null;
    },

    async addCartLine(
      cartId: string,
      variantId: string,
      productHandle: string,
      quantity: number,
      { includeDrafts = false }: { includeDrafts?: boolean } = {},
    ): Promise<Cart> {
      const cart = carts.get(cartId);
      if (!cart) throw new Error(`Unknown cart: ${cartId}`);
      if (quantity < 1) throw new Error("Quantity must be at least 1");

      const product = await findProduct(productHandle, includeDrafts);
      if (!product) throw new Error(`Unknown or unpublished product: ${productHandle}`);
      const variant = findVariant(product, variantId);
      if (!variant) throw new Error(`Unknown variant: ${variantId}`);

      const existing = cart.lines.find((l) => l.variantId === variantId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        const line: CartLine = { id: newId("line"), productHandle, variantId, quantity };
        cart.lines.push(line);
      }
      cart.updatedAt = now();
      return cart;
    },

    async updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
      const cart = carts.get(cartId);
      if (!cart) throw new Error(`Unknown cart: ${cartId}`);
      if (quantity < 0) throw new Error("Quantity cannot be negative");

      if (quantity === 0) {
        cart.lines = cart.lines.filter((l) => l.id !== lineId);
      } else {
        const line = cart.lines.find((l) => l.id === lineId);
        if (!line) throw new Error(`Unknown cart line: ${lineId}`);
        line.quantity = quantity;
      }
      cart.updatedAt = now();
      return cart;
    },

    async removeCartLine(cartId: string, lineId: string): Promise<Cart> {
      const cart = carts.get(cartId);
      if (!cart) throw new Error(`Unknown cart: ${cartId}`);
      cart.lines = cart.lines.filter((l) => l.id !== lineId);
      cart.updatedAt = now();
      return cart;
    },

    async getCheckoutUrl(): Promise<string | null> {
      // Payment provider (Stripe) integration is prepared but not activated with real
      // credentials - see docs/commerce-architecture.md and src/lib/stripe. Returning null here
      // is intentional; the cart UI must show a real "not available yet" state.
      return null;
    },
  };

  // Resolving lines to full product/variant/subtotal detail is shared too - see resolveCart in
  // provider.ts and supabase-provider.ts, both of which build on the same findProduct lookup.
}

export async function resolveCartLines(cart: Cart, findProduct: ProductLookup) {
  const resolvedLines = (
    await Promise.all(
      cart.lines.map(async (line) => {
        const product = await findProduct(line.productHandle, true);
        const variant = product ? product.variants.find((v) => v.id === line.variantId) : null;
        if (!product || !variant) return null;
        return {
          line,
          product,
          variant,
          lineTotal: Math.round(variant.price * line.quantity * 100) / 100,
        };
      }),
    )
  ).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = Math.round(resolvedLines.reduce((sum, e) => sum + e.lineTotal, 0) * 100) / 100;
  const totalQuantity = resolvedLines.reduce((sum, e) => sum + e.line.quantity, 0);
  const currency = resolvedLines[0]?.variant.currency ?? "EUR";

  return { resolvedLines, subtotal, totalQuantity, currency };
}
