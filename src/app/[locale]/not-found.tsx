import Link from "next/link";
import { headers } from "next/headers";
import { defaultLocale, dictionaries, isLocale, localePath } from "@/i18n";

export default async function LocaleNotFound() {
  const requestHeaders = await headers();
  const localeParam = requestHeaders.get("x-locale") ?? defaultLocale;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const dictionary = dictionaries[locale];

  return (
    <main className="not-found-page">
      <h1>{dictionary.productPage.notFoundTitle}</h1>
      <p>{dictionary.productPage.notFoundBody}</p>
      <Link className="button" href={localePath(locale, "/shop")}>
        {dictionary.productPage.backToShop}
      </Link>
    </main>
  );
}
