import { seedProducts } from "./seed-data";
import type { Cart, CartLine, CommerceProvider, Product } from "./types";

// Seed/demo commerce provider. Implements the same CommerceProvider interface a future
// Shopify Storefront API adapter would implement — see docs/commerce-architecture.md.
//
// Limitations, by design, until a real backend is connected:
// - Cart storage is an in-memory Map. It resets on server restart/redeploy. This is expected
//   for a seed provider and is NOT a production cart store.
// - getCheckoutUrl() always returns null: no payment provider is connected yet. The UI must
//   show a clear "checkout not available yet" state, never a fake success screen.

const carts = new Map<string, Cart>();

function findProduct(handle: string, includeDrafts: boolean): Product | null {
  const product = seedProducts.find((p) => p.handle === handle);
  if (!product) return null;
  if (product.status !== "published" && !includeDrafts) return null;
  return product;
}

function findVariant(product: Product, variantId: string) {
  return product.variants.find((v) => v.id === variantId) ?? null;
}

function now() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 11)}${Date.now().toString(36)}`;
}

export const seedCommerceProvider: CommerceProvider = {
  async listPublishedProducts({ includeDrafts = false } = {}) {
    return seedProducts.filter((p) => includeDrafts || p.status === "published");
  },

  async getProductByHandle(handle, { includeDrafts = false } = {}) {
    return findProduct(handle, includeDrafts);
  },

  async createCart() {
    const cart: Cart = { id: newId("cart"), lines: [], createdAt: now(), updatedAt: now() };
    carts.set(cart.id, cart);
    return cart;
  },

  async getCart(cartId) {
    return carts.get(cartId) ?? null;
  },

  async addCartLine(cartId, variantId, productHandle, quantity, { includeDrafts = false } = {}) {
    const cart = carts.get(cartId);
    if (!cart) throw new Error(`Unknown cart: ${cartId}`);
    if (quantity < 1) throw new Error("Quantity must be at least 1");

    // Server-side validation: never trust an unresolvable product/variant into the cart.
    // includeDrafts is only ever true when the caller (addToCartAction) has independently
    // verified the preview token server-side — see docs/commerce-architecture.md.
    const product = findProduct(productHandle, includeDrafts);
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

  async updateCartLine(cartId, lineId, quantity) {
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

  async removeCartLine(cartId, lineId) {
    const cart = carts.get(cartId);
    if (!cart) throw new Error(`Unknown cart: ${cartId}`);
    cart.lines = cart.lines.filter((l) => l.id !== lineId);
    cart.updatedAt = now();
    return cart;
  },

  async getCheckoutUrl() {
    // No payment provider is connected yet (see docs/commerce-architecture.md). Returning null
    // is intentional — the cart UI must show a real "not available yet" state, not a fake link.
    return null;
  },
};

/**
 * Resolves cart lines to full product/variant data and a server-computed subtotal. Cart lines
 * only ever store a variantId + quantity; price is always looked up here from the product
 * catalogue, never trusted from client state — see CommerceProvider.addCartLine.
 */
export async function resolveCart(cart: Cart) {
  const resolvedLines = cart.lines
    .map((line) => {
      const product = findProduct(line.productHandle, true);
      const variant = product ? findVariant(product, line.variantId) : null;
      if (!product || !variant) return null;
      return {
        line,
        product,
        variant,
        lineTotal: Math.round(variant.price * line.quantity * 100) / 100,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = Math.round(resolvedLines.reduce((sum, e) => sum + e.lineTotal, 0) * 100) / 100;
  const totalQuantity = resolvedLines.reduce((sum, e) => sum + e.line.quantity, 0);
  const currency = resolvedLines[0]?.variant.currency ?? "EUR";

  return { resolvedLines, subtotal, totalQuantity, currency };
}
