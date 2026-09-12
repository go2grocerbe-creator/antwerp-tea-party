"use client";

import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useMemo } from "react";
import type { Locale } from "@/i18n";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function EmbeddedCheckoutClient({ locale }: { locale: Locale }) {
  const options = useMemo(
    () => ({
      fetchClientSecret: async () => {
        const response = await fetch(`/api/checkout/session?locale=${locale}`, { method: "POST" });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error ?? "Could not start checkout.");
        }
        const { clientSecret } = await response.json();
        return clientSecret as string;
      },
    }),
    [locale],
  );

  return (
    <div className="embedded-checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
