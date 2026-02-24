/**
 * Seed script — populates the products table with sample data.
 *
 * Run from apps/web/:
 *   bun src/db/seed.ts
 *
 * Bun auto-loads .env.local so DATABASE_URL will be available.
 * Safe to re-run: uses onConflictDoUpdate on slug (idempotent).
 */

import { sql } from "drizzle-orm";
import { db } from "./index";
import { products } from "./schema";

const productList = [
  // ── Electronics ──────────────────────────────────────────────────────────
  {
    name: "Wireless Earbuds Pro",
    slug: "wireless-earbuds-pro",
    description:
      "Premium noise-cancelling wireless earbuds with 30-hour battery life and seamless multipoint connectivity.",
    priceInCents: 7999,
    imageUrl:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    category: "Electronics",
    stock: 25,
  },
  {
    name: "Portable Charger 20 000 mAh",
    slug: "portable-charger-20000",
    description:
      "Ultra-slim power bank with USB-C PD 65 W fast charging. Charges a laptop twice or a phone six times.",
    priceInCents: 3999,
    imageUrl:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
    category: "Electronics",
    stock: 40,
  },
  {
    name: "Smart Watch Series X",
    slug: "smart-watch-series-x",
    description:
      "Always-on AMOLED display, GPS, heart-rate monitor, and 7-day battery. Water-resistant to 50 m.",
    priceInCents: 19999,
    imageUrl:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
    category: "Electronics",
    stock: 15,
  },
  // ── Apparel ───────────────────────────────────────────────────────────────
  {
    name: "Classic Cotton T-Shirt",
    slug: "classic-cotton-tshirt",
    description:
      "100 % organic cotton, pre-washed for softness. Relaxed fit with a reinforced collar.",
    priceInCents: 2999,
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    category: "Apparel",
    stock: 60,
  },
  {
    name: "Essential Hoodie",
    slug: "essential-hoodie",
    description:
      "Heavyweight French terry hoodie with a brushed interior. Kangaroo pocket and ribbed cuffs.",
    priceInCents: 5999,
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
    category: "Apparel",
    stock: 30,
  },
  {
    name: "Classic Denim Jacket",
    slug: "classic-denim-jacket",
    description:
      "Washed selvedge denim jacket with brass buttons and a relaxed western silhouette.",
    priceInCents: 8999,
    imageUrl:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    category: "Apparel",
    stock: 20,
  },
  {
    name: "Tapered Jogger Pants",
    slug: "tapered-jogger-pants",
    description:
      "Four-way stretch fabric with a tapered fit. Side zip pockets and an elastic waistband.",
    priceInCents: 4499,
    imageUrl:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
    category: "Apparel",
    stock: 35,
  },
  // ── Accessories ───────────────────────────────────────────────────────────
  {
    name: "Slim Leather Wallet",
    slug: "slim-leather-wallet",
    description:
      "Full-grain vegetable-tanned leather. Six card slots and a cash compartment. RFID-blocking lining.",
    priceInCents: 4999,
    imageUrl:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    category: "Accessories",
    stock: 50,
  },
  {
    name: "Polarised Sunglasses",
    slug: "polarised-sunglasses",
    description:
      "UV400 polarised lenses in a recycled acetate frame. Includes a hard case and microfibre pouch.",
    priceInCents: 3499,
    imageUrl:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    category: "Accessories",
    stock: 45,
  },
  {
    name: "Structured Baseball Cap",
    slug: "structured-baseball-cap",
    description:
      "Six-panel twill cap with a curved brim and adjustable snap-back closure. One size fits all.",
    priceInCents: 2499,
    imageUrl:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
    category: "Accessories",
    stock: 55,
  },
];

console.log(`Seeding ${productList.length} products…`);

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

console.log(`✓ Done — ${productList.length} products upserted.`);
process.exit(0);
