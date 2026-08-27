import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/HomePage";
import { dictionaries, isLocale, localePath, locales, type Locale } from "@/i18n";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  const dictionary = dictionaries[locale];

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: {
      canonical: localePath(locale),
      languages: {
        nl: localePath("nl"),
        fr: localePath("fr"),
        en: localePath("en"),
      },
    },
    openGraph: {
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      type: "website",
      locale: locale === "nl" ? "nl_BE" : locale === "fr" ? "fr_BE" : "en_US",
      images: [
        {
          url: "/images/shop-interior-wide.jpg",
          width: 1350,
          height: 1800,
          alt: "The Antwerp Tea Party interior",
        },
      ],
    },
  };
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale: Locale = localeParam;
  return <HomePage locale={locale} dictionary={dictionaries[locale]} />;
}
