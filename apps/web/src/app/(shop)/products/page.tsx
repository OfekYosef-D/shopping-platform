import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductsGrid } from "@/components/features/products-grid";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const allProducts = await db.select().from(products);

  return (
    <main className="container mx-auto max-w-7xl px-4 py-12">
      {/* Page header */}
      <div className="mb-10 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Catalogue</p>
        <h1 className="font-display text-5xl font-normal tracking-tight sm:text-6xl">
          Our Collection
        </h1>
        <p className="text-muted-foreground">Handpicked products for discerning taste.</p>
      </div>

      {allProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
          <Package className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">No products yet. Check back soon.</p>
        </div>
      ) : (
        <ProductsGrid products={allProducts} />
      )}
    </main>
  );
}
