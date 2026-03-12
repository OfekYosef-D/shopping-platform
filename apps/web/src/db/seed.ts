/**
 * Seed script - populates the products table with demo data.
 *
 * Run from apps/web:
 *   bun src/db/seed.ts
 */

import { sql } from "drizzle-orm";
import { db } from "./index";
import { products } from "./schema";

const productList = [
  {
    name: "מזרן ויסקו אורטופדי פרימיום",
    slug: "premium-orthopedic-memory-foam",
    description:
      "מזרן ויסקו תומך במיוחד עם שכבת נוחות מפנקת, מתאים לכל תנוחות השינה.",
    priceInCents: 249900,
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    category: "מזרנים",
    stock: 18,
  },
  {
    name: "מזרן קפיצים מבודדים 160x200",
    slug: "pocket-spring-mattress-160x200",
    description:
      "קפיצים מבודדים להפחתת תזוזות, תמיכה אופטימלית ונוחות רציפה לאורך כל הלילה.",
    priceInCents: 189900,
    imageUrl:
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
    category: "מזרנים",
    stock: 22,
  },
  {
    name: "מזרן לטקס טבעי",
    slug: "natural-latex-mattress",
    description:
      "מזרן לטקס מאוורר עם גמישות גבוהה, נוחות טבעית ועמידות לשנים רבות.",
    priceInCents: 279900,
    imageUrl:
      "https://images.unsplash.com/photo-1616594039964-3f7e25492e92?w=800&q=80",
    category: "מזרנים",
    stock: 12,
  },
  {
    name: "מזרן היברידי זוגי",
    slug: "hybrid-double-mattress",
    description:
      "שילוב שכבות ספוג וקפיצים לנוחות מאוזנת ותמיכה מלאה בעמוד השדרה.",
    priceInCents: 219900,
    imageUrl:
      "https://images.unsplash.com/photo-1631048500397-2d5eb06f16b9?w=800&q=80",
    category: "מזרנים",
    stock: 16,
  },
  {
    name: "כרית ויסקו אנטומית",
    slug: "anatomic-memory-pillow",
    description: "כרית אנטומית המתאימה את עצמה לצוואר ולראש ומפחיתה עומסים.",
    priceInCents: 19900,
    imageUrl:
      "https://images.unsplash.com/photo-1629949009765-2beac65dc60d?w=800&q=80",
    category: "כריות",
    stock: 55,
  },
  {
    name: "כרית שינה קירור ג'ל",
    slug: "cooling-gel-pillow",
    description: "כרית עם שכבת ג'ל מקררת לשינה נעימה גם בלילות חמים.",
    priceInCents: 22900,
    imageUrl:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
    category: "כריות",
    stock: 48,
  },
  {
    name: "כרית לטקס תומכת צוואר",
    slug: "latex-neck-support-pillow",
    description: "כרית לטקס אלסטית עם תמיכה מוגברת לאזור הצוואר והכתפיים.",
    priceInCents: 23900,
    imageUrl:
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&q=80",
    category: "כריות",
    stock: 34,
  },
  {
    name: "כרית מיקרופייבר רכה",
    slug: "soft-microfiber-pillow",
    description:
      "כרית רכה במיוחד במילוי מיקרופייבר איכותי, מתאימה לשינה על הגב והצד.",
    priceInCents: 14900,
    imageUrl:
      "https://images.unsplash.com/photo-1582582494700-0d773a3077c2?w=800&q=80",
    category: "כריות",
    stock: 70,
  },
  {
    name: "טופר ויסקו 7 ס״מ",
    slug: "memory-foam-topper-7cm",
    description:
      "שכבת ויסקו לשדרוג מיידי של כל מזרן, להוספת רכות ותמיכה מדויקת.",
    priceInCents: 89900,
    imageUrl:
      "https://images.unsplash.com/photo-1600490036275-35f5f1656861?w=800&q=80",
    category: "אביזרי שינה",
    stock: 27,
  },
  {
    name: "מגן מזרן נושם",
    slug: "breathable-mattress-protector",
    description:
      "מגן מזרן איכותי ודוחה נוזלים עם בד נושם לשמירה על המזרן לאורך זמן.",
    priceInCents: 12900,
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    category: "אביזרי שינה",
    stock: 80,
  },
];

console.log(`Seeding ${productList.length} products...`);

await db
  .insert(products)
  .values(productList)
  .onConflictDoUpdate({
    target: products.slug,
    set: {
      name: sql`excluded.name`,
      description: sql`excluded.description`,
      priceInCents: sql`excluded.price_in_cents`,
      imageUrl: sql`excluded.image_url`,
      category: sql`excluded.category`,
      stock: sql`excluded.stock`,
      updatedAt: sql`now()`,
    },
  });

console.log(`Done - ${productList.length} products upserted.`);
process.exit(0);
