export const SITE_NAME = "Mizronim";
export const SITE_DESCRIPTION = "Refined shopping for a refined taste.";
export const CURRENCY = "USD";

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
  }).format(priceInCents / 100);
}
