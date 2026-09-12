import { createSupabasePublicClient } from "@/lib/supabase/public-client";
import { createSupabaseServiceClient, isServiceRoleConfigured } from "@/lib/supabase/service-client";
import { createMemoryCartMethods, resolveCartLines } from "./memory-cart";
import type { Cart, CommerceProvider, LocalizedText, Product } from "./types";

// Supabase-backed commerce provider. Same CommerceProvider interface as the seed provider (see
// src/lib/commerce/provider.ts) — swap the export in src/lib/commerce/index.ts once
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set and the migration in
// supabase/migrations/0001_init.sql has been applied. UNTESTED against a live project — no
// credentials were available while writing this (see docs/handover.md). Review the query
// shapes below against your actual schema before trusting it in production.
//
// Cart storage stays in-memory regardless of product source — see memory-cart.ts for why this
// doesn't create a pricing-trust gap.

const PRODUCT_SELECT = "*, product_variants(*), product_images(*)";

function localized(row: Record<string, unknown>, prefix: string): LocalizedText {
  return {
    en: String(row[`${prefix}_en`] ?? ""),
    nl: String(row[`${prefix}_nl`] ?? ""),
    fr: String(row[`${prefix}_fr`] ?? ""),
  };
}

function optionalLocalized(row: Record<string, unknown>, prefix: string): LocalizedText | null {
  if (!row[`${prefix}_en`] && !row[`${prefix}_nl`] && !row[`${prefix}_fr`]) return null;
  return localized(row, prefix);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    handle: row.handle,
    title: localized(row, "title"),
    shortDescription: localized(row, "short_description"),
    fullDescription: localized(row, "full_description"),
    category: row.category ?? "",
    origin: row.origin,
    teaType: row.tea_type,
    flavourNotes: row.flavour_notes ?? [],
    ingredients: optionalLocalized(row, "ingredients"),
    allergens: optionalLocalized(row, "allergens"),
    caffeineLevel: row.caffeine_level,
    brewingTemperatureCelsius: row.brewing_temperature_celsius,
    brewingTimeMinutes: row.brewing_time_minutes,
    dosageGramsPerLitre: row.dosage_grams_per_litre,
    featured: row.featured,
    status: row.status,
    seoTitle: optionalLocalized(row, "seo_title"),
    seoDescription: optionalLocalized(row, "seo_description"),
    images: (row.product_images ?? [])
      .slice()
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      .map((img: { src: string; alt: string }) => ({ src: img.src, alt: img.alt })),
    variants: (row.product_variants ?? []).map(
      (v: {
        id: string;
        weight_label: string;
        weight_grams: number | null;
        price: number;
        currency: string;
        sku: string | null;
        stock_status: Product["variants"][number]["stockStatus"];
        inventory_quantity: number | null;
      }) => ({
        id: v.id,
        weightLabel: v.weight_label,
        weightGrams: v.weight_grams,
        price: v.price,
        currency: v.currency,
        sku: v.sku,
        stockStatus: v.stock_status,
        inventoryQuantity: v.inventory_quantity,
      }),
    ),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Preview mode (includeDrafts=true) needs to see rows RLS would otherwise hide from the public
 * anon key, so it deliberately uses the service-role client instead — the caller (the [locale]/
 * shop routes) has already independently verified the COMMERCE_PREVIEW_TOKEN before setting
 * includeDrafts, so this does not widen who can reach draft data, only how this provider reads
 * it once that check has passed. Falls back to the public client (published-only, per RLS) if
 * no service role key is configured, rather than throwing.
 */
function clientFor(includeDrafts: boolean) {
  if (includeDrafts && isServiceRoleConfigured()) return createSupabaseServiceClient();
  return createSupabasePublicClient();
}

async function findProduct(handle: string, includeDrafts: boolean): Promise<Product | null> {
  const supabase = clientFor(includeDrafts);
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("handle", handle);
  if (!includeDrafts) query = query.eq("status", "published");
  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return rowToProduct(data);
}

const cartMethods = createMemoryCartMethods(findProduct);

export const supabaseCommerceProvider: CommerceProvider = {
  async listPublishedProducts({ includeDrafts = false } = {}) {
    const supabase = clientFor(includeDrafts);
    let query = supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: true });
    if (!includeDrafts) query = query.eq("status", "published");
    const { data, error } = await query;
    if (error) throw new Error(`Failed to list products: ${error.message}`);
    return (data ?? []).map(rowToProduct);
  },

  async getProductByHandle(handle, { includeDrafts = false } = {}) {
    return findProduct(handle, includeDrafts);
  },

  ...cartMethods,
};

export async function resolveSupabaseCart(cart: Cart) {
  return resolveCartLines(cart, findProduct);
}
