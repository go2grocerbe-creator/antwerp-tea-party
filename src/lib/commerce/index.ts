import { seedCommerceProvider } from "./provider";
import type { CommerceProvider } from "./types";

/**
 * The active commerce backend. Swap this line for a Shopify Storefront API adapter once
 * credentials are available (see docs/commerce-architecture.md) — nothing that imports
 * `getCommerceProvider()` needs to change.
 */
export function getCommerceProvider(): CommerceProvider {
  return seedCommerceProvider;
}

export * from "./types";
export { resolveCart } from "./provider";
