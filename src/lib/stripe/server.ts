import Stripe from "stripe";

/**
 * Server-only Stripe client. Never import this from a Client Component — the secret key must
 * never reach the browser. Throws if STRIPE_SECRET_KEY isn't set; callers should check
 * isStripeConfigured() (src/lib/stripe/config.ts) first and render a "not available" state.
 */
export function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set — see docs/commerce-architecture.md");
  return new Stripe(key, { apiVersion: "2026-08-26.dahlia" });
}
