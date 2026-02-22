import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const allProducts = await db.select().from(products);

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allProducts.map((product) => (
          <div key={product.id} className="group">
            <p>{product.name}</p>
          </div>
        ))}
        {allProducts.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-20">
            No products yet.
          </p>
        )}
      </div>
    </main>
  );
}
