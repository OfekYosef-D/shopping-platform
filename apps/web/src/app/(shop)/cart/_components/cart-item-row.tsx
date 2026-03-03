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
  type FormAction = (formData: FormData) => void;
  const decrementAction = updateCartQuantity.bind(null, id, quantity - 1) as unknown as FormAction;
  const incrementAction = updateCartQuantity.bind(null, id, quantity + 1) as unknown as FormAction;
  const removeAction = removeFromCart.bind(null, productId) as unknown as FormAction;

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted/50">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            ללא תמונה
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link href={`/products/${slug}`} className="block truncate font-medium hover:underline">
          {name}
        </Link>
        <p className="text-sm text-muted-foreground">{formatPrice(priceInCents)}</p>
      </div>

      <div className="flex items-center gap-2">
        <form action={decrementAction}>
          <Button type="submit" variant="outline" size="icon" className="h-8 w-8" aria-label="הפחתת כמות">
            <Minus className="h-3 w-3" />
          </Button>
        </form>
        <span data-testid="quantity" className="w-6 text-center text-sm font-medium">
          {quantity}
        </span>
        <form action={incrementAction}>
          <Button type="submit" variant="outline" size="icon" className="h-8 w-8" aria-label="הגדלת כמות">
            <Plus className="h-3 w-3" />
          </Button>
        </form>
      </div>

      <p className="w-20 text-left font-semibold">{formatPrice(priceInCents * quantity)}</p>

      <form action={removeAction}>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          data-testid="remove-button"
          aria-label="הסרת מוצר"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
