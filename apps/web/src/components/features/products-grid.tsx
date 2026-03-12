"use client";

import { useState } from "react";
import { ProductCard } from "@/components/features/product-card";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  priceInCents: number;
  imageUrl: string | null;
  category: string | null;
  description?: string | null;
}

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  const categories = [
    "הכל",
    ...Array.from(
      new Set(products.map((p) => p.category).filter(Boolean) as string[]),
    ),
  ];
  const [active, setActive] = useState("הכל");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const searchFiltered = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q),
      )
    : products;
  const filtered =
    active === "הכל"
      ? searchFiltered
      : searchFiltered.filter((p) => p.category === active);

  return (
    <div>
      <div className="mb-6">
        <Input
          data-testid="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש מזרן או כרית..."
          className="max-w-sm"
        />
      </div>

      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-[background-color,color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5",
                active === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/40 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              priceInCents={product.priceInCents}
              imageUrl={product.imageUrl}
              category={product.category}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div
          data-testid="empty-state"
          className="flex flex-col items-center justify-center gap-4 py-24 text-center"
        >
          <Package className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            {q
              ? "לא נמצאו מוצרים התואמים לחיפוש."
              : "אין עדיין מוצרים בקטגוריה הזו."}
          </p>
        </div>
      )}
    </div>
  );
}
