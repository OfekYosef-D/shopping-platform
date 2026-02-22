import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/constants";

interface ProductCardProps {
  name: string;
  slug: string;
  priceInCents: number;
  imageUrl: string | null;
  className?: string;
}

export function ProductCard({ name, slug, priceInCents, imageUrl, className }: ProductCardProps) {
  return (
    <a
      href={`/products/${slug}`}
      className={cn(
        "group block rounded-2xl border border-border/40 bg-card p-4 transition-all hover:shadow-lg",
        className
      )}
    >
      <div className="aspect-square overflow-hidden rounded-xl bg-muted">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium leading-tight">{name}</h3>
        <p className="text-sm text-muted-foreground">{formatPrice(priceInCents)}</p>
      </div>
    </a>
  );
}
