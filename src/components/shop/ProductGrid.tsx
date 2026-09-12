import { ProductCard } from "@/components/shop/ProductCard";
import type { Dictionary, Locale } from "@/i18n";
import type { Product } from "@/lib/commerce";

export function ProductGrid({
  products,
  locale,
  dictionary,
  previewToken,
}: {
  products: Product[];
  locale: Locale;
  dictionary: Dictionary;
  previewToken?: string;
}) {
  if (products.length === 0) {
    return (
      <p className="product-grid__empty" role="status">
        {dictionary.shopPage.empty}
      </p>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          dictionary={dictionary}
          previewToken={previewToken}
        />
      ))}
    </div>
  );
}
