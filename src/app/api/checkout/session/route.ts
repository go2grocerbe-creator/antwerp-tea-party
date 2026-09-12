import { NextRequest, NextResponse } from "next/server";
import { getCurrentCart } from "@/lib/commerce/actions";
import { resolveCart } from "@/lib/commerce";
import type { CartLine, Product, ProductVariant } from "@/lib/commerce/types";
import { isStripeConfigured, getSiteUrl } from "@/lib/stripe/config";
import { getStripeClient } from "@/lib/stripe/server";
import { isLocale, defaultLocale } from "@/i18n";

/**
 * Creates a Stripe Embedded Checkout session for the current cart. Server-side only:
 * authoritative price always comes from resolveCart() (re-reads the catalogue), never from the
 * request body — the client cannot influence what gets charged. See
 * docs/commerce-architecture.md "Stripe checkout".
 */
export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Checkout is not configured yet." }, { status: 503 });
  }

  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale = isLocale(localeParam ?? undefined) ? localeParam! : defaultLocale;

  const cart = await getCurrentCart();
  if (!cart) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const { resolvedLines, currency } = await resolveCart(cart);
  if (resolvedLines.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  if (currency.toUpperCase() !== "EUR") {
    // Bancontact only settles in EUR — see docs/commerce-architecture.md.
    return NextResponse.json({ error: "Only EUR checkout is supported." }, { status: 400 });
  }

  const stripe = getStripeClient();

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      payment_method_types: ["card", "bancontact"],
      line_items: resolvedLines.map(
        ({ product, variant, line }: { product: Product; variant: ProductVariant; line: CartLine }) => ({
        quantity: line.quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(variant.price * 100),
          product_data: {
            name: `${product.title[locale as keyof typeof product.title]} — ${variant.weightLabel}`,
            metadata: { productHandle: product.handle, variantId: variant.id },
          },
        },
      })),
      metadata: { cartId: cart.id },
      return_url: `${getSiteUrl()}/${locale}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe checkout session creation failed", error);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
}
