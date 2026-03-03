import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductsGrid } from "@/components/features/products-grid";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const allProducts = await db.select().from(products);

  return (
    <main className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 space-y-2">
        <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground">קטלוג שינה</p>
        <h1 className="font-display text-5xl font-normal tracking-tight sm:text-6xl">מזרונים, כריות ועוד</h1>
        <p className="text-muted-foreground">בחרו את המוצרים שיעזרו לכם לישון טוב יותר בכל לילה.</p>
      </div>

      {allProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
          <Package className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">אין כרגע מוצרים במלאי. נעדכן בקרוב.</p>
        </div>
      ) : (
        <ProductsGrid products={allProducts} />
      )}
    </main>
  );
}
