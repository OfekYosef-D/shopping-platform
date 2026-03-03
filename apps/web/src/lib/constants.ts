export const SITE_NAME = "בית השינה";
export const SITE_DESCRIPTION = "מזרונים, כריות ומוצרי שינה איכותיים עד הבית.";
export const CURRENCY = "ILS";
export const LOCALE = "he-IL";

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 2,
  }).format(priceInCents / 100);
}

export function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat(LOCALE).format(new Date(value));
}
