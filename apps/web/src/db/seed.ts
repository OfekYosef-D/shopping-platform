/**
 * Seed script for the sleep-store catalog.
 *
 * Run from apps/web:
 *   bun src/db/seed.ts
 */

import { sql } from "drizzle-orm";
import { db } from "./index";
import { products } from "./schema";

const productList = [
  {
    name: "מזרן אורטופדי ויסקו פרימיום 160x200",
    slug: "orthopedic-memory-foam-mattress-160x200",
    description: "מזרן עם 7 אזורי תמיכה לשינה רציפה והפחתת נקודות לחץ.",
    priceInCents: 279900,
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    category: "מזרונים",
    stock: 16,
  },
  {
    name: "מזרן היברידי Comfort+ עם קפיצים מבודדים",
    slug: "comfort-plus-hybrid-spring-mattress",
    description: "שילוב בין קפיצים אישיים לשכבת נוחות אלסטית ליציבות מעולה.",
    priceInCents: 239900,
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
    category: "מזרונים",
    stock: 22,
  },
  {
    name: "מזרן זוגי קשיחות בינונית Balance",
    slug: "balance-medium-firm-mattress",
    description: "איזון מדויק בין רכות לתמיכה, מתאים לרוב תנוחות השינה.",
    priceInCents: 199900,
    imageUrl: "https://images.unsplash.com/photo-1616594039964-3d47f6b93e13?w=1200&q=80",
    category: "מזרונים",
    stock: 19,
  },
  {
    name: "מזרן נוער אנטי-בקטריאלי Junior Rest",
    slug: "junior-rest-youth-mattress",
    description: "בד נושם עם שכבת נוחות תומכת לשינה בריאה לילדים ובני נוער.",
    priceInCents: 129900,
    imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&q=80",
    category: "מזרונים",
    stock: 30,
  },
  {
    name: "כרית ויסקו ארגונומית לצוואר",
    slug: "ergonomic-memory-foam-pillow",
    description: "שומרת על קו צוואר טבעי ומפחיתה עומס בכתפיים.",
    priceInCents: 29900,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
    category: "כריות",
    stock: 55,
  },
  {
    name: "כרית פלומה רכה Cloud Soft",
    slug: "cloud-soft-pillow",
    description: "תחושת ענן נעימה עם תמיכה מאוזנת לשינה מפנקת.",
    priceInCents: 24900,
    imageUrl: "https://images.unsplash.com/photo-1578898887932-dce23a595ad4?w=1200&q=80",
    category: "כריות",
    stock: 42,
  },
  {
    name: "זוג כריות היפואלרגניות Sleep Duo",
    slug: "hypoallergenic-pillows-duo",
    description: "מילוי אוורירי ובד נושם, מתאים במיוחד לרגישים לאבק.",
    priceInCents: 19900,
    imageUrl: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80",
    category: "כריות",
    stock: 70,
  },
  {
    name: "כרית לטקס תומכת Side Sleeper",
    slug: "latex-side-sleeper-pillow",
    description: "גובה ותמיכה מתאימים במיוחד לשינה על הצד.",
    priceInCents: 34900,
    imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80",
    category: "כריות",
    stock: 34,
  },
  {
    name: "טופר ויסקו 7 ס״מ למזרן",
    slug: "memory-foam-topper-7cm",
    description: "משדרג כל מזרן קיים ומעניק רכות תומכת עם פיזור לחץ אחיד.",
    priceInCents: 75900,
    imageUrl: "https://images.unsplash.com/photo-1616628182509-6f8b4f8f7c45?w=1200&q=80",
    category: "טופרים",
    stock: 26,
  },
  {
    name: "טופר לטקס טבעי מאוורר",
    slug: "natural-latex-topper",
    description: "לטקס טבעי עם אוורור משופר לתחושת רעננות לאורך הלילה.",
    priceInCents: 92900,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    category: "טופרים",
    stock: 20,
  },
  {
    name: "מגן מזרן אטום לנוזלים",
    slug: "waterproof-mattress-protector",
    description: "הגנה מלאה למזרן מפני נוזלים עם שכבה עליונה נעימה ושקטה.",
    priceInCents: 14900,
    imageUrl: "https://images.unsplash.com/photo-1615874694520-474822394e73?w=1200&q=80",
    category: "אביזרי שינה",
    stock: 64,
  },
  {
    name: "סט מצעי כותנה סאטן 500 חוטים",
    slug: "cotton-sateen-bedding-set",
    description: "בד כותנה איכותי עם מגע חלק ונעים לשינה מפנקת.",
    priceInCents: 45900,
    imageUrl: "https://images.unsplash.com/photo-1582582429416-4508a1ccca42?w=1200&q=80",
    category: "אביזרי שינה",
    stock: 38,
  },
  {
    name: "שמיכת מעבר קלילה לכל עונה",
    slug: "all-season-light-duvet",
    description: "שמיכה נעימה במשקל מאוזן שמתאימה למזג האוויר בישראל.",
    priceInCents: 36900,
    imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80",
    category: "אביזרי שינה",
    stock: 34,
  },
  {
    name: "בסיס מיטה מרופד Minimal",
    slug: "minimal-upholstered-bed-base",
    description: "בסיס יציב בעיצוב נקי, משתלב עם כל חדר שינה מודרני.",
    priceInCents: 199900,
    imageUrl: "https://images.unsplash.com/photo-1616594039964-3d47f6b93e13?w=1200&q=80",
    category: "בסיסי מיטה",
    stock: 12,
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

console.log(`Done. ${productList.length} products upserted.`);
process.exit(0);
