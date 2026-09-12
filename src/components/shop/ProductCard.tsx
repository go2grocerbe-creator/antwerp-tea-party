import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { localePath, type Dictionary, type Locale } from "@/i18n";
import type { Product } from "@/lib/commerce";

export function ProductCard({
  product,
  locale,
  dictionary,
  previewToken,
}: {
  product: Product;
  locale: Locale;
  dictionary: Dictionary;
  /** Carries preview mode through to the product page — see docs/commerce-architecture.md. */
  previewToken?: string;
}) {
  const cheapestVariant = [...product.variants].sort((a, b) => a.price - b.price)[0];
  const stockLabel =
    cheapestVariant?.stockStatus === "out_of_stock"
      ? dictionary.shopPage.outOfStock
      : cheapestVariant?.stockStatus === "low_stock"
        ? dictionary.shopPage.lowStock
        : cheapestVariant?.stockStatus === "in_stock"
          ? dictionary.shopPage.inStock
          : null;

  return (
    <Link
      className="product-card"
      href={
        previewToken
          ? `${localePath(locale, `/shop/${product.handle}`)}?preview=${previewToken}`
          : localePath(locale, `/shop/${product.handle}`)
      }
    >
      <span className="product-card__image">
        <Image
          src={product.images[0]?.src ?? "/images/shop-interior-wide.jpg"}
          alt={product.images[0]?.alt || ""}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 28vw"
        />
        {stockLabel && <span className="product-card__stock">{stockLabel}</span>}
      </span>
      <span className="product-card__body">
        {product.category && <span className="product-card__category">{product.category}</span>}
        <strong className="product-card__title">{product.title[locale]}</strong>
        <span className="product-card__desc">{product.shortDescription[locale]}</span>
        {cheapestVariant && cheapestVariant.price > 0 ? (
          <span className="product-card__price">
            {dictionary.shopPage.priceFrom} {formatPrice(cheapestVariant.price, cheapestVariant.currency, locale)}
          </span>
        ) : (
          <span className="product-card__price product-card__price--pending">
            {dictionary.productPage.priceUnavailable}
          </span>
        )}
      </span>
    </Link>
  );
}
