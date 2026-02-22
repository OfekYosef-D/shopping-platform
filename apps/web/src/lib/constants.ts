export const SITE_NAME = "Shopping Platform";
export const SITE_DESCRIPTION = "A premium e-commerce experience.";
export const CURRENCY = "USD";

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
  }).format(priceInCents / 100);
}
