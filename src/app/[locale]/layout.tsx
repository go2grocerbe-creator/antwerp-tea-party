import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { dictionaries, isLocale, type Locale } from "@/i18n";
import { getCurrentCartSummary } from "@/lib/commerce/actions";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale: Locale = localeParam;
  const dictionary = dictionaries[locale];
  const { totalQuantity } = await getCurrentCartSummary();

  return (
    <>
      <SiteHeader locale={locale} dictionary={dictionary} cartCount={totalQuantity} />
      {children}
      <SiteFooter dictionary={dictionary} />
    </>
  );
}
