import { z } from "zod";

// Server-side validation for the admin product form. Mirrors supabase/migrations/0001_init.sql
// column-for-column (flat, not the storefront's nested LocalizedText shape) so the admin form
// can map directly to/from a database row without a translation layer. Never trust this data
// just because it came through the form UI — every Server Action re-validates with this schema.

export const variantInputSchema = z.object({
  id: z.string().uuid().optional(),
  weightLabel: z.string().trim().min(1, "Weight label is required"),
  weightGrams: z.coerce.number().int().positive().nullable().optional(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  currency: z.string().trim().length(3).default("EUR"),
  sku: z.string().trim().min(1).nullable().optional(),
  stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock", "unknown"]).default("unknown"),
  inventoryQuantity: z.coerce.number().int().min(0).nullable().optional(),
});

export const imageInputSchema = z.object({
  id: z.string().uuid().optional(),
  src: z.string().trim().min(1, "Image is required"),
  alt: z.string().trim().default(""),
  sortOrder: z.coerce.number().int().default(0),
});

export const productInputSchema = z.object({
  handle: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Handle must be lowercase letters, numbers, and hyphens only"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  category: z.string().trim().nullable().optional(),
  origin: z.string().trim().nullable().optional(),
  teaType: z.string().trim().nullable().optional(),
  flavourNotes: z.array(z.string().trim().min(1)).default([]),
  caffeineLevel: z.enum(["none", "low", "medium", "high", "unknown"]).default("unknown"),
  brewingTemperatureCelsius: z.coerce.number().int().nullable().optional(),
  brewingTimeMinutes: z.coerce.number().int().nullable().optional(),
  dosageGramsPerLitre: z.coerce.number().nullable().optional(),
  featured: z.boolean().default(false),
  titleEn: z.string().trim().min(1, "English title is required"),
  titleNl: z.string().trim().min(1, "Dutch title is required"),
  titleFr: z.string().trim().min(1, "French title is required"),
  shortDescriptionEn: z.string().trim().default(""),
  shortDescriptionNl: z.string().trim().default(""),
  shortDescriptionFr: z.string().trim().default(""),
  fullDescriptionEn: z.string().trim().default(""),
  fullDescriptionNl: z.string().trim().default(""),
  fullDescriptionFr: z.string().trim().default(""),
  ingredientsEn: z.string().trim().nullable().optional(),
  ingredientsNl: z.string().trim().nullable().optional(),
  ingredientsFr: z.string().trim().nullable().optional(),
  allergensEn: z.string().trim().nullable().optional(),
  allergensNl: z.string().trim().nullable().optional(),
  allergensFr: z.string().trim().nullable().optional(),
  seoTitleEn: z.string().trim().nullable().optional(),
  seoTitleNl: z.string().trim().nullable().optional(),
  seoTitleFr: z.string().trim().nullable().optional(),
  seoDescriptionEn: z.string().trim().nullable().optional(),
  seoDescriptionNl: z.string().trim().nullable().optional(),
  seoDescriptionFr: z.string().trim().nullable().optional(),
  variants: z.array(variantInputSchema).min(1, "At least one variant is required"),
  images: z.array(imageInputSchema).default([]),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type VariantInput = z.infer<typeof variantInputSchema>;
export type ImageInput = z.infer<typeof imageInputSchema>;
