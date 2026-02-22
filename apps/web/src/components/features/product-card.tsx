import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  priceInCents: number;
  imageUrl: string | null;
  className?: string;
}

export function ProductCard({ id, name, slug, priceInCents, imageUrl, className }: ProductCardProps) {
  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-lg shadow-xl transition-all hover:shadow-2xl dark:bg-black/20",
        className
      )}
    >
      <Link href={`/products/${slug}`} className="block flex-1">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/50">
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
    </div>
  );
}
