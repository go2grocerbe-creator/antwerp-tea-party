"use client";

import { useState } from "react";
import type { AdminProductDetail } from "@/lib/admin/products";
import type { ImageInput, VariantInput } from "@/lib/admin/schema";

const emptyVariant = (): VariantInput => ({
  weightLabel: "",
  weightGrams: null,
  price: 0,
  currency: "EUR",
  sku: "",
  stockStatus: "unknown",
  inventoryQuantity: null,
});

const emptyImage = (): ImageInput => ({ src: "", alt: "", sortOrder: 0 });

export function ProductForm({
  product,
  action,
}: {
  product?: AdminProductDetail;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [variants, setVariants] = useState<VariantInput[]>(product?.variants ?? [emptyVariant()]);
  const [images, setImages] = useState<ImageInput[]>(product?.images ?? []);

  return (
    <form action={action} className="admin-form">
      <input type="hidden" name="variantsJson" value={JSON.stringify(variants)} />
      <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />

      <fieldset>
        <legend>Identity</legend>
        <label>
          Handle (URL slug)
          <input name="handle" defaultValue={product?.handle} required pattern="[a-z0-9-]+" />
        </label>
        <label>
          Status
          <select name="status" defaultValue={product?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="admin-form__checkbox">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} />
          Featured
        </label>
      </fieldset>

      <fieldset>
        <legend>Titles</legend>
        <label>
          Title (EN)
          <input name="titleEn" defaultValue={product?.titleEn} required />
        </label>
        <label>
          Title (NL)
          <input name="titleNl" defaultValue={product?.titleNl} required />
        </label>
        <label>
          Title (FR)
          <input name="titleFr" defaultValue={product?.titleFr} required />
        </label>
      </fieldset>

      <fieldset>
        <legend>Descriptions</legend>
        <label>
          Short description (EN)
          <textarea name="shortDescriptionEn" defaultValue={product?.shortDescriptionEn} rows={2} />
        </label>
        <label>
          Short description (NL)
          <textarea name="shortDescriptionNl" defaultValue={product?.shortDescriptionNl} rows={2} />
        </label>
        <label>
          Short description (FR)
          <textarea name="shortDescriptionFr" defaultValue={product?.shortDescriptionFr} rows={2} />
        </label>
        <label>
          Full description (EN)
          <textarea name="fullDescriptionEn" defaultValue={product?.fullDescriptionEn} rows={4} />
        </label>
        <label>
          Full description (NL)
          <textarea name="fullDescriptionNl" defaultValue={product?.fullDescriptionNl} rows={4} />
        </label>
        <label>
          Full description (FR)
          <textarea name="fullDescriptionFr" defaultValue={product?.fullDescriptionFr} rows={4} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Classification</legend>
        <label>
          Category
          <input name="category" defaultValue={product?.category ?? ""} />
        </label>
        <label>
          Origin
          <input name="origin" defaultValue={product?.origin ?? ""} />
        </label>
        <label>
          Tea type
          <input name="teaType" defaultValue={product?.teaType ?? ""} />
        </label>
        <label>
          Flavour notes (comma-separated)
          <input name="flavourNotes" defaultValue={product?.flavourNotes.join(", ") ?? ""} />
        </label>
        <label>
          Caffeine level
          <select name="caffeineLevel" defaultValue={product?.caffeineLevel ?? "unknown"}>
            <option value="unknown">Unknown</option>
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>Brewing</legend>
        <label>
          Water temperature (°C)
          <input type="number" name="brewingTemperatureCelsius" defaultValue={product?.brewingTemperatureCelsius ?? ""} />
        </label>
        <label>
          Brewing time (minutes)
          <input type="number" name="brewingTimeMinutes" defaultValue={product?.brewingTimeMinutes ?? ""} />
        </label>
        <label>
          Dosage (g / litre)
          <input type="number" step="0.1" name="dosageGramsPerLitre" defaultValue={product?.dosageGramsPerLitre ?? ""} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Ingredients &amp; allergens</legend>
        <label>
          Ingredients (EN)
          <textarea name="ingredientsEn" defaultValue={product?.ingredientsEn ?? ""} rows={2} />
        </label>
        <label>
          Ingredients (NL)
          <textarea name="ingredientsNl" defaultValue={product?.ingredientsNl ?? ""} rows={2} />
        </label>
        <label>
          Ingredients (FR)
          <textarea name="ingredientsFr" defaultValue={product?.ingredientsFr ?? ""} rows={2} />
        </label>
        <label>
          Allergens (EN)
          <textarea name="allergensEn" defaultValue={product?.allergensEn ?? ""} rows={2} />
        </label>
        <label>
          Allergens (NL)
          <textarea name="allergensNl" defaultValue={product?.allergensNl ?? ""} rows={2} />
        </label>
        <label>
          Allergens (FR)
          <textarea name="allergensFr" defaultValue={product?.allergensFr ?? ""} rows={2} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Variants</legend>
        {variants.map((variant, index) => (
          <div className="admin-form__row" key={index}>
            <label>
              Weight label
              <input
                value={variant.weightLabel}
                onChange={(e) => updateVariant(index, { weightLabel: e.target.value })}
                placeholder="50 g"
                required
              />
            </label>
            <label>
              Weight (g)
              <input
                type="number"
                value={variant.weightGrams ?? ""}
                onChange={(e) => updateVariant(index, { weightGrams: e.target.value ? Number(e.target.value) : null })}
              />
            </label>
            <label>
              Price (EUR)
              <input
                type="number"
                step="0.01"
                value={variant.price}
                onChange={(e) => updateVariant(index, { price: Number(e.target.value) })}
                required
              />
            </label>
            <label>
              SKU
              <input value={variant.sku ?? ""} onChange={(e) => updateVariant(index, { sku: e.target.value })} />
            </label>
            <label>
              Stock status
              <select
                value={variant.stockStatus}
                onChange={(e) => updateVariant(index, { stockStatus: e.target.value as VariantInput["stockStatus"] })}
              >
                <option value="unknown">Unknown</option>
                <option value="in_stock">In stock</option>
                <option value="low_stock">Low stock</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </label>
            <label>
              Inventory quantity
              <input
                type="number"
                value={variant.inventoryQuantity ?? ""}
                onChange={(e) =>
                  updateVariant(index, { inventoryQuantity: e.target.value ? Number(e.target.value) : null })
                }
              />
            </label>
            <button type="button" className="text-link" onClick={() => removeVariant(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="text-link" onClick={() => setVariants((v) => [...v, emptyVariant()])}>
          Add variant
        </button>
      </fieldset>

      <fieldset>
        <legend>Images</legend>
        <p className="admin-form__hint">
          Paste an image path or URL (e.g. an existing <code>/images/...</code> asset). Direct Supabase
          Storage upload from this form is not built yet — see docs/handover.md.
        </p>
        {images.map((image, index) => (
          <div className="admin-form__row" key={index}>
            <label>
              Image src
              <input value={image.src} onChange={(e) => updateImage(index, { src: e.target.value })} required />
            </label>
            <label>
              Alt text
              <input value={image.alt} onChange={(e) => updateImage(index, { alt: e.target.value })} />
            </label>
            <button type="button" className="text-link" onClick={() => removeImage(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="text-link" onClick={() => setImages((v) => [...v, emptyImage()])}>
          Add image
        </button>
      </fieldset>

      <fieldset>
        <legend>SEO</legend>
        <label>
          SEO title (EN)
          <input name="seoTitleEn" defaultValue={product?.seoTitleEn ?? ""} />
        </label>
        <label>
          SEO description (EN)
          <textarea name="seoDescriptionEn" defaultValue={product?.seoDescriptionEn ?? ""} rows={2} />
        </label>
      </fieldset>

      <button type="submit" className="button">
        {product ? "Save changes" : "Create product"}
      </button>
    </form>
  );

  function updateVariant(index: number, patch: Partial<VariantInput>) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  function updateImage(index: number, patch: Partial<ImageInput>) {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, ...patch } : img)));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }
}
