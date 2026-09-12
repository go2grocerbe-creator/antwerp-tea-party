import type { Locale } from "@/i18n";

const intlLocale: Record<Locale, string> = { en: "en-BE", nl: "nl-BE", fr: "fr-BE" };

export function formatPrice(amount: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(intlLocale[locale], { style: "currency", currency }).format(amount);
}
