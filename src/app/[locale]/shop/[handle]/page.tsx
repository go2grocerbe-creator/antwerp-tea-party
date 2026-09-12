import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { dictionaries, isLocale, localePath, type Locale } from "@/i18n";
import { getCommerceProvider } from "@/lib/commerce";

type ProductPageProps = {
  params: Promise<{ locale: string; handle: string }>;
  searchParams: Promise<{ preview?: string }>;
};

async function resolveProduct(handle: string, preview: string | undefined) {
  const previewToken = process.env.COMMERCE_PREVIEW_TOKEN;
  const includeDrafts = Boolean(previewToken) && preview === previewToken;
  return getCommerceProvider().getProductByHandle(handle, { includeDrafts });
}

export async function generateMetadata({ params, searchParams }: ProductPageProps): Promise<Metadata> {
  const { locale: localeParam, handle } = await params;
  if (!isLocale(localeParam)) notFound();
  const { preview } = await searchParams;
  const product = await resolveProduct(handle, preview);
  const dictionary = dictionaries[localeParam];

  if (!product) {
    return { title: `${dictionary.productPage.notFoundTitle} | ${dictionary.metadata.title}` };
  }

  const seoTitle = product.seoTitle?.[localeParam] || product.title[localeParam];
  const seoDescription = product.seoDescription?.[localeParam] || product.shortDescription[localeParam];

  return {
    title: `${seoTitle} | ${dictionary.metadata.title}`,
    description: seoDescription,
    alternates: { canonical: localePath(localeParam, `/shop/${product.handle}`) },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: product.images.slice(0, 1).map((image) => ({ url: image.src })),
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { locale: localeParam, handle } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = dictionaries[locale];

  const { preview } = await searchParams;
  const product = await resolveProduct(handle, preview);
  if (!product) notFound();
  const previewToken = process.env.COMMERCE_PREVIEW_TOKEN;
  const includeDrafts = Boolean(previewToken) && preview === previewToken;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title[locale],
    description: product.shortDescription[locale],
    image: product.images.map((image) => image.src),
    offers: product.variants
      .filter((v) => v.price > 0)
      .map((v) => ({
        "@type": "Offer",
        priceCurrency: v.currency,
        price: v.price,
        availability:
          v.stockStatus === "out_of_stock"
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/InStock",
        sku: v.sku ?? undefined,
      })),
  };

  return (
    <main className="product-page">
      {/* Structured data uses only verified fields already on the product record — no invented facts. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail
        product={product}
        locale={locale}
        dictionary={dictionary}
        previewToken={includeDrafts ? preview : undefined}
      />
    </main>
  );
}
