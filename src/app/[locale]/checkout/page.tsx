import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { EmbeddedCheckoutClient } from "@/components/checkout/EmbeddedCheckoutClient";
import { dictionaries, isLocale, localePath, type Locale } from "@/i18n";
import { getCurrentCartSummary } from "@/lib/commerce/actions";
import { isCheckoutAvailable } from "@/lib/stripe/config";

type CheckoutPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = dictionaries[localeParam];
  return { title: `${dictionary.checkoutPage.title} | ${dictionary.metadata.title}`, robots: { index: false } };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = dictionaries[locale];

  const { resolvedLines } = await getCurrentCartSummary();
  if (resolvedLines.length === 0) redirect(localePath(locale, "/cart"));

  return (
    <main className="checkout-page">
      <h1>{dictionary.checkoutPage.title}</h1>
      <Link className="text-link" href={localePath(locale, "/cart")}>
        {dictionary.checkoutPage.backToCart}
      </Link>

      {isCheckoutAvailable() ? (
        <EmbeddedCheckoutClient locale={locale} />
      ) : (
        <div className="checkout-unavailable">
          <strong>{dictionary.cartPage.checkoutUnavailableTitle}</strong>
          <p>{dictionary.cartPage.checkoutUnavailableBody}</p>
        </div>
      )}
    </main>
  );
}
