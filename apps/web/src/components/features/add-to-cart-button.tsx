"use client";

import { useActionState, useOptimistic } from "react";
import { addToCart } from "@/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  // In a real app, we'd get the userId from auth context/session
  userId?: string;
}

export function AddToCartButton({ productId, userId = "guest-user" }: AddToCartButtonProps) {
  // Bind the server action with the required arguments
  const boundAddToCart = addToCart.bind(null, userId, productId, 1);
  
  const [state, formAction, isPending] = useActionState(boundAddToCart, {
    success: false,
    message: "",
  });

  // Optimistic UI state for the button
  const [optimisticState, addOptimistic] = useOptimistic(
    { isAdding: false },
    (state, newIsAdding: boolean) => ({ isAdding: newIsAdding })
  );

  const isAdding = isPending || optimisticState.isAdding;

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
        className="w-full bg-white/10 text-foreground backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-sm"
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
