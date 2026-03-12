import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductsGrid } from "@/components/features/products-grid";
import { Package } from "lucide-react";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let allProducts: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    priceInCents: number;
    imageUrl: string | null;
    category: string | null;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  try {
    allProducts = await db.select().from(products);
  } catch (error) {
    console.error("Failed to load products from DB, using fallback catalog.", error);
    allProducts = FALLBACK_PRODUCTS.map((product) => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-12">
      {/* Page header */}
      <div className="mb-10 space-y-2">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
          קטלוג
        </p>
        <h1 className="font-display text-5xl font-normal tracking-tight sm:text-6xl">
          מזרנים וכריות לשינה מושלמת
        </h1>
        <p className="text-muted-foreground">
          מבחר מזרנים, כריות ואביזרי שינה במחיר יבואן ישיר.
        </p>
      </div>

      {allProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
          <Package className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            עדיין לא נוספו מוצרים. חזרו בקרוב.
          </p>
        </div>
      ) : (
        <ProductsGrid products={allProducts} />
      )}
    </main>
  );
}
