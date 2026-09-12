import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dictionaries, isLocale, localePath, type Locale } from "@/i18n";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getStripeClient } from "@/lib/stripe/server";

type ReturnPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export const metadata: Metadata = { robots: { index: false } };

export default async function CheckoutReturnPage({ params, searchParams }: ReturnPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = dictionaries[locale];

  const { session_id: sessionId } = await searchParams;

  // The order itself is created by the Stripe webhook (src/app/api/webhooks/stripe/route.ts)
  // from a verified payment event, never from this page — a visitor could reload or share this
  // URL, so it only ever reads status back from Stripe, it never writes anything.
  let complete = false;
  if (sessionId && isStripeConfigured()) {
    try {
      const session = await getStripeClient().checkout.sessions.retrieve(sessionId);
      complete = session.status === "complete";
    } catch {
      complete = false;
    }
  }

  return (
    <main className="checkout-return">
      {complete ? (
        <>
          <h1>{dictionary.checkoutPage.successTitle}</h1>
          <p>{dictionary.checkoutPage.successBody}</p>
        </>
      ) : (
        <>
          <h1>{dictionary.checkoutPage.incompleteTitle}</h1>
          <p>{dictionary.checkoutPage.incompleteBody}</p>
          <Link className="button" href={localePath(locale, "/cart")}>
            {dictionary.checkoutPage.backToCart}
          </Link>
        </>
      )}
      <Link className="text-link" href={localePath(locale, "/shop")}>
        {dictionary.checkoutPage.backToShop}
      </Link>
    </main>
  );
}
