import { createMemoryCartMethods, resolveCartLines } from "./memory-cart";
import { seedProducts } from "./seed-data";
import type { Cart, CommerceProvider, Product } from "./types";

// Seed/demo commerce provider. Implements the same CommerceProvider interface a Supabase-backed
// adapter implements (see src/lib/commerce/supabase-provider.ts) — see
// docs/commerce-architecture.md.

function findProduct(handle: string, includeDrafts: boolean): Promise<Product | null> {
  const product = seedProducts.find((p) => p.handle === handle);
  if (!product) return Promise.resolve(null);
  if (product.status !== "published" && !includeDrafts) return Promise.resolve(null);
  return Promise.resolve(product);
}

const cartMethods = createMemoryCartMethods(findProduct);

export const seedCommerceProvider: CommerceProvider = {
  async listPublishedProducts({ includeDrafts = false } = {}) {
    return seedProducts.filter((p) => includeDrafts || p.status === "published");
  },

  async getProductByHandle(handle, { includeDrafts = false } = {}) {
    return findProduct(handle, includeDrafts);
  },

  ...cartMethods,
};

/**
 * Resolves cart lines to full product/variant data and a server-computed subtotal. Cart lines
 * only ever store a variantId + quantity; price is always looked up here from the product
 * catalogue, never trusted from client state — see CommerceProvider.addCartLine.
 */
export async function resolveCart(cart: Cart) {
  return resolveCartLines(cart, findProduct);
}
