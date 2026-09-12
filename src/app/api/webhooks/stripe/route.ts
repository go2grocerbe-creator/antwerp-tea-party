import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getStripeClient } from "@/lib/stripe/server";
import { isServiceRoleConfigured, createSupabaseServiceClient } from "@/lib/supabase/service-client";

/**
 * The only place an order is ever created — from a Stripe-signature-verified event, never from
 * the client and never from src/app/[locale]/checkout/return/page.tsx (which only reads status
 * back). See docs/commerce-architecture.md "Stripe checkout".
 */
export async function POST(request: NextRequest) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      await recordOrder(stripe, session);
    }
  }

  // Always acknowledge quickly once the event is verified, per Stripe's webhook guidance.
  return NextResponse.json({ received: true });
}

async function recordOrder(stripe: Stripe, session: Stripe.Checkout.Session) {
  if (!isServiceRoleConfigured()) {
    // No database to persist to yet - acknowledge the verified event without failing the
    // webhook. See docs/handover.md "Blocked" for what's needed to close this gap.
    console.warn(
      `Stripe checkout.session.completed for ${session.id} was verified but not persisted — Supabase service role is not configured.`,
    );
    return;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
  });

  const supabase = createSupabaseServiceClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .upsert(
      {
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
        customer_email: session.customer_details?.email ?? null,
        currency: session.currency ?? "eur",
        subtotal: (session.amount_total ?? 0) / 100,
        status: "paid",
      },
      { onConflict: "stripe_checkout_session_id" },
    )
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Failed to record order from Stripe webhook", orderError);
    return;
  }

  const items = lineItems.data.map((item) => {
    const product = item.price?.product;
    const metadata = product && typeof product === "object" && "metadata" in product ? product.metadata : {};
    return {
      order_id: order.id,
      product_handle: metadata.productHandle ?? "unknown",
      variant_id: metadata.variantId ?? "unknown",
      title_snapshot: item.description ?? "",
      weight_label_snapshot: item.description ?? "",
      unit_price: (item.price?.unit_amount ?? 0) / 100,
      quantity: item.quantity ?? 1,
      line_total: (item.amount_total ?? 0) / 100,
    };
  });

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(items);
    if (itemsError) console.error("Failed to record order items from Stripe webhook", itemsError);
  }
}
