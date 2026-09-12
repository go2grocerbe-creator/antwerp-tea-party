import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ImageInput, ProductInput, VariantInput } from "./schema";

// Admin product service layer. Every function assumes the caller has already checked
// requireAdminSession() (see src/lib/supabase/admin-auth.ts) - RLS is the real enforcement
// boundary (supabase/migrations/0001_init.sql), this layer is about shaping data, not the
// authorization decision itself.
//
// Untested against a live Supabase project - no credentials were available while writing this
// (see docs/handover.md). Review against a real project before trusting it in production.

export type AdminProductListItem = {
  id: string;
  handle: string;
  status: "draft" | "published" | "archived";
  titleEn: string;
  updatedAt: string;
  variantCount: number;
};

export type AdminProductDetail = ProductInput & { id: string };

function toRow(input: ProductInput) {
  return {
    handle: input.handle,
    status: input.status,
    category: input.category ?? null,
    origin: input.origin ?? null,
    tea_type: input.teaType ?? null,
    flavour_notes: input.flavourNotes,
    caffeine_level: input.caffeineLevel,
    brewing_temperature_celsius: input.brewingTemperatureCelsius ?? null,
    brewing_time_minutes: input.brewingTimeMinutes ?? null,
    dosage_grams_per_litre: input.dosageGramsPerLitre ?? null,
    featured: input.featured,
    title_en: input.titleEn,
    title_nl: input.titleNl,
    title_fr: input.titleFr,
    short_description_en: input.shortDescriptionEn,
    short_description_nl: input.shortDescriptionNl,
    short_description_fr: input.shortDescriptionFr,
    full_description_en: input.fullDescriptionEn,
    full_description_nl: input.fullDescriptionNl,
    full_description_fr: input.fullDescriptionFr,
    ingredients_en: input.ingredientsEn ?? null,
    ingredients_nl: input.ingredientsNl ?? null,
    ingredients_fr: input.ingredientsFr ?? null,
    allergens_en: input.allergensEn ?? null,
    allergens_nl: input.allergensNl ?? null,
    allergens_fr: input.allergensFr ?? null,
    seo_title_en: input.seoTitleEn ?? null,
    seo_title_nl: input.seoTitleNl ?? null,
    seo_title_fr: input.seoTitleFr ?? null,
    seo_description_en: input.seoDescriptionEn ?? null,
    seo_description_nl: input.seoDescriptionNl ?? null,
    seo_description_fr: input.seoDescriptionFr ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(row: any): AdminProductDetail {
  return {
    id: row.id,
    handle: row.handle,
    status: row.status,
    category: row.category,
    origin: row.origin,
    teaType: row.tea_type,
    flavourNotes: row.flavour_notes ?? [],
    caffeineLevel: row.caffeine_level,
    brewingTemperatureCelsius: row.brewing_temperature_celsius,
    brewingTimeMinutes: row.brewing_time_minutes,
    dosageGramsPerLitre: row.dosage_grams_per_litre,
    featured: row.featured,
    titleEn: row.title_en,
    titleNl: row.title_nl,
    titleFr: row.title_fr,
    shortDescriptionEn: row.short_description_en ?? "",
    shortDescriptionNl: row.short_description_nl ?? "",
    shortDescriptionFr: row.short_description_fr ?? "",
    fullDescriptionEn: row.full_description_en ?? "",
    fullDescriptionNl: row.full_description_nl ?? "",
    fullDescriptionFr: row.full_description_fr ?? "",
    ingredientsEn: row.ingredients_en,
    ingredientsNl: row.ingredients_nl,
    ingredientsFr: row.ingredients_fr,
    allergensEn: row.allergens_en,
    allergensNl: row.allergens_nl,
    allergensFr: row.allergens_fr,
    seoTitleEn: row.seo_title_en,
    seoTitleNl: row.seo_title_nl,
    seoTitleFr: row.seo_title_fr,
    seoDescriptionEn: row.seo_description_en,
    seoDescriptionNl: row.seo_description_nl,
    seoDescriptionFr: row.seo_description_fr,
    variants: (row.product_variants ?? []).map(
      (v: {
        id: string;
        weight_label: string;
        weight_grams: number | null;
        price: number;
        currency: string;
        sku: string | null;
        stock_status: VariantInput["stockStatus"];
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
    images: (row.product_images ?? []).map(
      (i: { id: string; src: string; alt: string; sort_order: number }) => ({
        id: i.id,
        src: i.src,
        alt: i.alt,
        sortOrder: i.sort_order,
      }),
    ),
  };
}

export async function listAdminProducts(): Promise<AdminProductListItem[]> {
  // Defensive: the protected layout's requireAdminSession() redirect is what actually stops an
  // unauthenticated/unconfigured request, but Next can start rendering this page's data fetch
  // concurrently with that check — returning an empty list here (rather than throwing) keeps
  // that race harmless instead of surfacing a noisy unhandled error.
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, handle, status, title_en, updated_at, product_variants(id)")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`Failed to list products: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    handle: row.handle,
    status: row.status,
    titleEn: row.title_en,
    updatedAt: row.updated_at,
    variantCount: Array.isArray(row.product_variants) ? row.product_variants.length : 0,
  }));
}

export async function getAdminProduct(id: string): Promise<AdminProductDetail | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*), product_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load product: ${error.message}`);
  if (!data) return null;
  return fromRow(data);
}

export async function createAdminProduct(input: ProductInput): Promise<string> {
  const supabase = await createSupabaseServerClient();

  const { data: product, error } = await supabase.from("products").insert(toRow(input)).select("id").single();
  if (error) throw new Error(`Failed to create product: ${error.message}`);

  await writeVariantsAndImages(product.id, input.variants, input.images);
  return product.id;
}

export async function updateAdminProduct(id: string, input: ProductInput): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("products").update(toRow(input)).eq("id", id);
  if (error) throw new Error(`Failed to update product: ${error.message}`);

  await writeVariantsAndImages(id, input.variants, input.images);
}

export async function setAdminProductStatus(
  id: string,
  status: "draft" | "published" | "archived",
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").update({ status }).eq("id", id);
  if (error) throw new Error(`Failed to change product status: ${error.message}`);
}

// Simplification for this first version: variants/images are fully replaced on every save
// rather than diffed. Fine at catalogue-of-five scale; revisit if per-variant history/audit
// trails become a requirement.
async function writeVariantsAndImages(productId: string, variants: VariantInput[], images: ImageInput[]) {
  const supabase = await createSupabaseServerClient();

  const { error: deleteVariantsError } = await supabase
    .from("product_variants")
    .delete()
    .eq("product_id", productId);
  if (deleteVariantsError) throw new Error(`Failed to update variants: ${deleteVariantsError.message}`);

  if (variants.length > 0) {
    const { error: insertVariantsError } = await supabase.from("product_variants").insert(
      variants.map((v) => ({
        product_id: productId,
        weight_label: v.weightLabel,
        weight_grams: v.weightGrams ?? null,
        price: v.price,
        currency: v.currency,
        sku: v.sku ?? null,
        stock_status: v.stockStatus,
        inventory_quantity: v.inventoryQuantity ?? null,
      })),
    );
    if (insertVariantsError) throw new Error(`Failed to save variants: ${insertVariantsError.message}`);
  }

  const { error: deleteImagesError } = await supabase.from("product_images").delete().eq("product_id", productId);
  if (deleteImagesError) throw new Error(`Failed to update images: ${deleteImagesError.message}`);

  if (images.length > 0) {
    const { error: insertImagesError } = await supabase.from("product_images").insert(
      images.map((img) => ({
        product_id: productId,
        src: img.src,
        alt: img.alt,
        sort_order: img.sortOrder,
      })),
    );
    if (insertImagesError) throw new Error(`Failed to save images: ${insertImagesError.message}`);
  }
}
