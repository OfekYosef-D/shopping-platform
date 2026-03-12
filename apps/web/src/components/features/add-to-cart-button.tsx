"use client";

import { useActionState, useEffect, useRef } from "react";
import { addToCart } from "@/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const queryClient = useQueryClient();
  const boundAddToCart = addToCart.bind(null, productId, 1);

  const [state, formAction, isPending] = useActionState(boundAddToCart, {
    success: false,
    message: "",
  });

  const wasPendingRef = useRef(false);
  useEffect(() => {
    if (wasPendingRef.current && !isPending) {
      if (state.success) {
        toast.success("המוצר נוסף לסל");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else if (state.message) {
        toast.error(state.message);
      }
    }
    wasPendingRef.current = isPending;
  }, [isPending, state.success, state.message, queryClient]);

  return (
    <form action={formAction} className="mt-4 w-full">
      <Button
        type="submit"
        disabled={isPending}
        className="w-full border border-black/10 bg-black/5 text-foreground shadow-sm transition-[background-color,transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:bg-black/10 hover:shadow-md dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            מוסיף...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            הוספה לסל
          </>
        )}
      </Button>
      {state?.message && !state.success && (
        <p className="text-destructive text-xs mt-2 text-center">
          {state.message}
        </p>
      )}
    </form>
  );
}
