/** Server-side: is a Stripe secret key configured? Never expose the result's basis (the key
 * itself) to the client. */
export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Client-safe: NEXT_PUBLIC_ vars are inlined at build time, so this works in a "use client"
 * component without a round trip. Used to decide whether to show a real checkout link or the
 * "not connected yet" message on the cart page. */
export function isStripePublishableConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function isCheckoutAvailable() {
  return isStripeConfigured() && isStripePublishableConfigured();
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
