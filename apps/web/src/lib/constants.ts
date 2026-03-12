export const SITE_NAME = "שינה ישירה";
export const SITE_DESCRIPTION = "מזרנים וכריות איכות ישירות מהיבואן.";
export const CURRENCY = "ILS";

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: CURRENCY,
  }).format(priceInCents / 100);
}
