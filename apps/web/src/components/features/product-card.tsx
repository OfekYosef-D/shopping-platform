import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";
import { GlassCard } from "@/components/ui/glass-card";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  priceInCents: number;
  imageUrl: string | null;
  category?: string | null;
  index?: number;
  className?: string;
}

export function ProductCard({ id, name, slug, priceInCents, imageUrl, category, index = 0, className }: ProductCardProps) {
  return (
    <GlassCard
      data-testid="product-card"
      className={cn("group flex flex-col p-4 transition-all hover:shadow-2xl", className)}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link href={`/products/${slug}`} className="block flex-1">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/50">
          {category && (
            <span className="absolute left-2 top-2 z-10 rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur-sm dark:border-white/10 dark:bg-black/40">
              {category}
            </span>
          )}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            />
          ) : (
            <div
              data-testid="image-placeholder"
              className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground"
            >
              No Image
            </div>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-base font-medium leading-tight tracking-tight text-foreground">
            {name}
          </h3>
          <p className="text-sm font-semibold text-muted-foreground">
            {formatPrice(priceInCents)}
          </p>
        </div>
      </Link>
      <AddToCartButton productId={id} />
    </GlassCard>
  );
}
