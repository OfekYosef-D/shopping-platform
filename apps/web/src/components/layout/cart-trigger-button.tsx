"use client";

import { useUIStore } from "@/stores/ui-store";
import { useCartQuery } from "@/hooks/use-cart-query";
import { ShoppingCart } from "lucide-react";

interface CartTriggerButtonProps {
  initialCount: number;
}

export function CartTriggerButton({ initialCount }: CartTriggerButtonProps) {
  const openCart = useUIStore((s) => s.openCart);
  const { data } = useCartQuery();
  const count = data?.items?.length ?? initialCount;

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`Open cart${count > 0 ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
    >
      <ShoppingCart className="h-4 w-4" />
      Cart
      {count > 0 && (
        <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
          {count}
        </span>
      )}
    </button>
  );
}
