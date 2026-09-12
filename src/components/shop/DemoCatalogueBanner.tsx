import type { Dictionary } from "@/i18n";

/**
 * Shown on every route that lists or displays a seed/demo product, in every environment except
 * a real production deploy (VERCEL_ENV === "production"). The five current products are generic
 * demo teas, not Daniele's real catalogue - see src/lib/commerce/seed-data.ts and
 * docs/product-model.md "Demo catalogue vs. real data".
 */
export function isDemoCatalogueEnvironment() {
  return process.env.VERCEL_ENV !== "production";
}

export function DemoCatalogueBanner({ dictionary }: { dictionary: Dictionary }) {
  if (!isDemoCatalogueEnvironment()) return null;
  return (
    <p className="demo-catalogue-banner" role="status">
      {dictionary.shopPage.demoBanner}
    </p>
  );
}
