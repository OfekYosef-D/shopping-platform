export interface FallbackProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceInCents: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "מזרן ויסקו אורטופדי Premium Sleep",
    slug: "premium-sleep-visco-mattress",
    description:
      "מזרן ויסקו תומך ונושם עם שכבות ספוג צפיפות גבוהה לשינה יציבה ונוחה.",
    priceInCents: 329900,
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop",
    category: "מזרנים",
    stock: 12,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "מזרן קפיצים היברידי Comfort Plus",
    slug: "comfort-plus-hybrid-mattress",
    description:
      "שילוב קפיצים מבודדים וספוג איכותי לפיזור לחצים ותמיכה מלאה לאורך הלילה.",
    priceInCents: 289900,
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80&auto=format&fit=crop",
    category: "מזרנים",
    stock: 8,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "כרית לטקס אנטומית AirFlow",
    slug: "airflow-latex-pillow",
    description:
      "כרית לטקס גמישה עם תעלות אוורור לשמירה על טמפרטורה נעימה ותמיכה בצוואר.",
    priceInCents: 32900,
    imageUrl:
      "https://images.unsplash.com/photo-1616627452850-2f9f7f9f2b5e?w=1200&q=80&auto=format&fit=crop",
    category: "כריות",
    stock: 40,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "כרית ויסקו אורתופדית Neck Support",
    slug: "neck-support-memory-pillow",
    description:
      "כרית ויסקו אורטופדית להפחתת עומס מצוואר וכתפיים, מתאימה לשינה על הצד והגב.",
    priceInCents: 27900,
    imageUrl:
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=1200&q=80&auto=format&fit=crop",
    category: "כריות",
    stock: 26,
  },
];
