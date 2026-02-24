import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AddToCartButton } from "@/components/features/add-to-cart-button";
import { formatPrice } from "@/lib/constants";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) notFound();

  const inStock = product.stock > 0;

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">
      <Link
        href="/products"
        className="mb-10 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Image — sticky on desktop */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/50 shadow-xl">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground text-sm">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          {product.category && (
            <span className="w-fit rounded-full border border-border/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {product.category}
            </span>
          )}

          <h1 className="font-display text-4xl font-normal tracking-tight sm:text-5xl">
            {product.name}
          </h1>

          <p className="text-3xl font-semibold tracking-tight">{formatPrice(product.priceInCents)}</p>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {/* Stock badge */}
          <div>
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                {product.stock} in stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                Out of stock
              </span>
            )}
          </div>

          <GlassCard className="p-4">
            {inStock ? (
              <AddToCartButton productId={product.id} />
            ) : (
              <p className="text-center text-sm text-muted-foreground italic">
                This product is currently unavailable.
              </p>
            )}
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
