"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { removeFromCart, updateCartQuantity } from "@/actions/cart.actions";
import { formatPrice } from "@/lib/constants";

export interface CartItemRowProps {
  id: string;
  productId: string;
  name: string;
  slug: string;
  priceInCents: number;
  imageUrl: string | null;
  quantity: number;
}

export function CartItemRow({
  id,
  productId,
  name,
  slug,
  priceInCents,
  imageUrl,
  quantity,
}: CartItemRowProps) {
  // Cast needed: React form action expects (fd) => void, but our server actions
  // return { success, message } — React ignores the return value at runtime.
  type FormAction = (formData: FormData) => void;
  const decrementAction = updateCartQuantity.bind(null, id, quantity - 1) as unknown as FormAction;
  const incrementAction = updateCartQuantity.bind(null, id, quantity + 1) as unknown as FormAction;
  const removeAction = removeFromCart.bind(null, productId) as unknown as FormAction;

  return (
    <div className="flex items-center gap-4 p-4">
      {/* Thumbnail */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted/50">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      {/* Name & price */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${slug}`}
          className="font-medium truncate hover:underline block"
        >
          {name}
        </Link>
        <p className="text-sm text-muted-foreground">{formatPrice(priceInCents)}</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <form action={decrementAction}>
          <Button type="submit" variant="outline" size="icon" className="h-8 w-8">
            <Minus className="h-3 w-3" />
          </Button>
        </form>
        <span
          data-testid="quantity"
          className="text-sm font-medium w-6 text-center"
        >
          {quantity}
        </span>
        <form action={incrementAction}>
          <Button type="submit" variant="outline" size="icon" className="h-8 w-8">
            <Plus className="h-3 w-3" />
          </Button>
        </form>
      </div>

      {/* Subtotal */}
      <p className="font-semibold w-20 text-right">
        {formatPrice(priceInCents * quantity)}
      </p>

      {/* Remove */}
      <form action={removeAction}>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          data-testid="remove-button"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
