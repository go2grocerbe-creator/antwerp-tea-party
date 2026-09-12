"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { productInputSchema } from "./schema";
import { createAdminProduct, setAdminProductStatus, updateAdminProduct } from "./products";

function parseProductForm(formData: FormData) {
  const raw = {
    handle: formData.get("handle"),
    status: formData.get("status"),
    category: formData.get("category") || null,
    origin: formData.get("origin") || null,
    teaType: formData.get("teaType") || null,
    flavourNotes: String(formData.get("flavourNotes") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    caffeineLevel: formData.get("caffeineLevel"),
    brewingTemperatureCelsius: formData.get("brewingTemperatureCelsius") || null,
    brewingTimeMinutes: formData.get("brewingTimeMinutes") || null,
    dosageGramsPerLitre: formData.get("dosageGramsPerLitre") || null,
    featured: formData.get("featured") === "on",
    titleEn: formData.get("titleEn"),
    titleNl: formData.get("titleNl"),
    titleFr: formData.get("titleFr"),
    shortDescriptionEn: formData.get("shortDescriptionEn") ?? "",
    shortDescriptionNl: formData.get("shortDescriptionNl") ?? "",
    shortDescriptionFr: formData.get("shortDescriptionFr") ?? "",
    fullDescriptionEn: formData.get("fullDescriptionEn") ?? "",
    fullDescriptionNl: formData.get("fullDescriptionNl") ?? "",
    fullDescriptionFr: formData.get("fullDescriptionFr") ?? "",
    ingredientsEn: formData.get("ingredientsEn") || null,
    ingredientsNl: formData.get("ingredientsNl") || null,
    ingredientsFr: formData.get("ingredientsFr") || null,
    allergensEn: formData.get("allergensEn") || null,
    allergensNl: formData.get("allergensNl") || null,
    allergensFr: formData.get("allergensFr") || null,
    seoTitleEn: formData.get("seoTitleEn") || null,
    seoTitleNl: formData.get("seoTitleNl") || null,
    seoTitleFr: formData.get("seoTitleFr") || null,
    seoDescriptionEn: formData.get("seoDescriptionEn") || null,
    seoDescriptionNl: formData.get("seoDescriptionNl") || null,
    seoDescriptionFr: formData.get("seoDescriptionFr") || null,
    variants: JSON.parse(String(formData.get("variantsJson") ?? "[]")),
    images: JSON.parse(String(formData.get("imagesJson") ?? "[]")),
  };

  return productInputSchema.parse(raw);
}

export async function createProductAction(formData: FormData) {
  await requireAdminSession();
  const input = parseProductForm(formData);
  const id = await createAdminProduct(input);
  revalidatePath("/admin");
  revalidatePath("/shop");
  redirect(`/admin/products/${id}?created=1`);
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdminSession();
  const input = parseProductForm(formData);
  await updateAdminProduct(id, input);
  revalidatePath("/admin");
  revalidatePath("/shop");
  revalidatePath(`/shop/${input.handle}`);
  redirect(`/admin/products/${id}?saved=1`);
}

export async function setProductStatusAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["draft", "published", "archived"].includes(status)) {
    throw new Error("Missing or invalid id/status");
  }
  await setAdminProductStatus(id, status as "draft" | "published" | "archived");
  revalidatePath("/admin");
  revalidatePath("/shop");
}
