import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { dictionaries, isLocale, localePath, type Locale } from "@/i18n";
import { getCommerceProvider } from "@/lib/commerce";

type ShopPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = dictionaries[localeParam];

  return {
    title: `${dictionary.shopPage.title} | ${dictionary.metadata.title}`,
    description: dictionary.shopPage.intro,
    alternates: { canonical: localePath(localeParam, "/shop") },
  };
}

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = dictionaries[locale];

  // Draft-preview mode: lets the shop owner/developer review unpublished drafts before they go
  // live, without ever exposing them to regular visitors. See docs/commerce-architecture.md.
  const { preview } = await searchParams;
  const previewToken = process.env.COMMERCE_PREVIEW_TOKEN;
  const includeDrafts = Boolean(previewToken) && preview === previewToken;

  const products = await getCommerceProvider().listPublishedProducts({ includeDrafts });

  return (
    <main className="shop-page">
      <div className="shop-page__intro">
        <p className="eyebrow">{dictionary.shopPage.eyebrow}</p>
        <h1>{dictionary.shopPage.title}</h1>
        <p>{dictionary.shopPage.intro}</p>
        {includeDrafts && <p className="preview-banner">Preview mode — showing unpublished drafts.</p>}
      </div>
      <ProductGrid
        products={products}
        locale={locale}
        dictionary={dictionary}
        previewToken={includeDrafts ? preview : undefined}
      />
    </main>
  );
}
