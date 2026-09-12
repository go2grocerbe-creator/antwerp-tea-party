import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { formatPrice } from "@/lib/format";
import { dictionaries, isLocale, localePath, type Locale } from "@/i18n";
import { getCurrentCartSummary } from "@/lib/commerce/actions";
import { isCheckoutAvailable } from "@/lib/stripe/config";

type CartPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: CartPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = dictionaries[localeParam];
  return { title: `${dictionary.cartPage.title} | ${dictionary.metadata.title}`, robots: { index: false } };
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = dictionaries[locale];

  const { resolvedLines, subtotal, currency } = await getCurrentCartSummary();
  const checkoutAvailable = resolvedLines.length > 0 && isCheckoutAvailable();

  return (
    <main className="cart-page">
      <h1>{dictionary.cartPage.title}</h1>

      {resolvedLines.length === 0 ? (
        <div className="cart-page__empty">
          <p>{dictionary.cartPage.empty}</p>
          <Link className="button" href={localePath(locale, "/shop")}>
            {dictionary.cartPage.emptyCta}
          </Link>
        </div>
      ) : (
        <>
          <ul className="cart-lines">
            {resolvedLines.map(({ line, product, variant, lineTotal }) => (
              <CartLineItem
                key={line.id}
                lineId={line.id}
                product={product}
                variant={variant}
                quantity={line.quantity}
                lineTotal={lineTotal}
                locale={locale}
                dictionary={dictionary}
              />
            ))}
          </ul>

          <div className="cart-summary">
            <div className="cart-summary__row">
              <span>{dictionary.cartPage.subtotal}</span>
              <strong>{formatPrice(subtotal, currency, locale)}</strong>
            </div>
            <p className="cart-summary__note">{dictionary.cartPage.subtotalNote}</p>

            {checkoutAvailable ? (
              <Link className="button" href={localePath(locale, "/checkout")}>
                {dictionary.cartPage.checkout}
              </Link>
            ) : (
              <div className="checkout-unavailable" role="status">
                <strong>{dictionary.cartPage.checkoutUnavailableTitle}</strong>
                <p>{dictionary.cartPage.checkoutUnavailableBody}</p>
              </div>
            )}

            <Link className="text-link" href={localePath(locale, "/shop")}>
              {dictionary.cartPage.continueShopping}
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
