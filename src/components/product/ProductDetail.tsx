"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { localePath, type Dictionary, type Locale } from "@/i18n";
import type { Product } from "@/lib/commerce";
import { addToCartAction } from "@/lib/commerce/actions";

export function ProductDetail({
  product,
  locale,
  dictionary,
  previewToken,
}: {
  product: Product;
  locale: Locale;
  dictionary: Dictionary;
  previewToken?: string;
}) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [confirmation, setConfirmation] = useState(false);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? product.variants[0],
    [product.variants, variantId],
  );

  const outOfStock = variant?.stockStatus === "out_of_stock";
  const hasRealPrice = (variant?.price ?? 0) > 0;

  return (
    <article className="product-detail">
      <div className="product-detail__gallery">
        {product.images.map((image, index) => (
          <div className="product-detail__image" key={image.src + index}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
        ))}
      </div>

      <div className="product-detail__info">
        <Link className="text-link product-detail__back" href={localePath(locale, "/shop")}>
          {dictionary.productPage.backToShop}
        </Link>

        {product.category && <p className="eyebrow">{product.category}</p>}
        <h1>{product.title[locale]}</h1>
        <p className="product-detail__short">{product.shortDescription[locale]}</p>

        <p className="product-detail__price">
          {hasRealPrice && variant
            ? formatPrice(variant.price, variant.currency, locale)
            : dictionary.productPage.priceUnavailable}
        </p>

        <form
          action={async (formData) => {
            await addToCartAction(formData);
            setConfirmation(true);
          }}
          className="product-detail__form"
        >
          <input type="hidden" name="productHandle" value={product.handle} />
          {previewToken && <input type="hidden" name="preview" value={previewToken} />}

          {product.variants.length > 1 && (
            <fieldset className="variant-selector">
              <legend>{dictionary.productPage.weightLabel}</legend>
              {product.variants.map((v) => (
                <label key={v.id} className={`variant-selector__option ${v.id === variantId ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="variantId"
                    value={v.id}
                    checked={v.id === variantId}
                    onChange={() => {
                      setVariantId(v.id);
                      setConfirmation(false);
                    }}
                  />
                  {v.weightLabel}
                </label>
              ))}
            </fieldset>
          )}
          {product.variants.length <= 1 && <input type="hidden" name="variantId" value={variantId} />}

          <label className="quantity-field">
            <span>{dictionary.productPage.quantityLabel}</span>
            <input
              type="number"
              name="quantity"
              min={1}
              max={99}
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            />
          </label>

          {/* Only real stock state blocks adding to cart. A $0/pending price does not — draft
              products can never be published or reached publicly (see seed-data.ts and
              provider.ts), so this only affects owner/developer preview review, never a real
              customer purchase. */}
          <button type="submit" className="button" disabled={outOfStock}>
            {outOfStock ? dictionary.productPage.outOfStock : dictionary.productPage.addToCart}
          </button>

          <p aria-live="polite" className="product-detail__confirmation">
            {confirmation ? dictionary.productPage.added : ""}
          </p>
        </form>

        {(product.brewingTemperatureCelsius || product.brewingTimeMinutes) && (
          <div className="product-detail__brewing">
            <h2>{dictionary.productPage.brewingTitle}</h2>
            <dl>
              {product.brewingTemperatureCelsius && (
                <div>
                  <dt>{dictionary.productPage.brewingTemperature}</dt>
                  <dd>{product.brewingTemperatureCelsius}°C</dd>
                </div>
              )}
              {product.brewingTimeMinutes && (
                <div>
                  <dt>{dictionary.productPage.brewingTime}</dt>
                  <dd>{product.brewingTimeMinutes} min</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {product.fullDescription[locale] && <p className="product-detail__full">{product.fullDescription[locale]}</p>}

        {product.ingredients && (
          <div className="product-detail__meta">
            <h2>{dictionary.productPage.ingredientsTitle}</h2>
            <p>{product.ingredients[locale]}</p>
          </div>
        )}

        {product.allergens && (
          <div className="product-detail__meta">
            <h2>{dictionary.productPage.allergensTitle}</h2>
            <p>{product.allergens[locale]}</p>
          </div>
        )}
      </div>
    </article>
  );
}
