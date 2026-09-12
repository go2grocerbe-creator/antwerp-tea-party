import { isSupabaseConfigured } from "@/lib/supabase/env";
import { resolveCart as resolveSeedCart, seedCommerceProvider } from "./provider";
import { resolveSupabaseCart, supabaseCommerceProvider } from "./supabase-provider";
import type { Cart, CommerceProvider } from "./types";

/**
 * The active commerce backend. Automatically uses Supabase once it's configured (see
 * docs/commerce-architecture.md and supabase/migrations/0001_init.sql); falls back to the seed/
 * demo provider otherwise. Nothing that calls `getCommerceProvider()` needs to know which one is
 * active — both implement the same CommerceProvider interface.
 */
export function getCommerceProvider(): CommerceProvider {
  return isSupabaseConfigured() ? supabaseCommerceProvider : seedCommerceProvider;
}

export async function resolveCart(cart: Cart) {
  return isSupabaseConfigured() ? resolveSupabaseCart(cart) : resolveSeedCart(cart);
}

export * from "./types";
