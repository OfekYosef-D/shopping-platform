"use client";

import { useActionState, useOptimistic, useEffect, useRef } from "react";
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

  const [optimisticState, addOptimistic] = useOptimistic(
    { isAdding: false },
    (_state, newIsAdding: boolean) => ({ isAdding: newIsAdding })
  );

  const isAdding = isPending || optimisticState.isAdding;

  // Track previous state to detect a fresh success transition
  const prevSuccessRef = useRef(false);
  useEffect(() => {
    if (state.success && !prevSuccessRef.current) {
      toast.success("Added to cart!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
    prevSuccessRef.current = state.success;
  }, [state.success, queryClient]);

  return (
    <form
      action={(formData) => {
        addOptimistic(true);
        formAction(formData);
      }}
      className="mt-4 w-full"
    >
      <Button
        type="submit"
        disabled={isAdding}
        className="w-full border border-black/10 bg-black/5 text-foreground backdrop-blur-md hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-300 shadow-sm"
      >
        {isAdding ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>
      {state?.message && !state.success && (
        <p className="text-destructive text-xs mt-2 text-center">{state.message}</p>
      )}
    </form>
  );
}
