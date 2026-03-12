"use client";

import { AnimatePresence, motion } from "motion/react";
import { X, ShoppingCart, Package, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useUIStore } from "@/stores/ui-store";
import { useCartQuery } from "@/hooks/use-cart-query";
import { removeFromCart, updateCartQuantity } from "@/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { data, isLoading } = useCartQuery();
  const queryClient = useQueryClient();
  const [activeMutationKey, setActiveMutationKey] = useState<string | null>(
    null,
  );
  const [isMutating, startMutation] = useTransition();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  function runCartMutation(
    mutationKey: string,
    mutation: () => Promise<{ success: boolean; message: string }>,
  ) {
    if (isMutating) return;
    setActiveMutationKey(mutationKey);

    startMutation(async () => {
      try {
        const result = await mutation();
        if (!result.success) {
          toast.error(result.message || "לא ניתן לעדכן את הסל כרגע");
        }
      } catch {
        toast.error("לא ניתן לעדכן את הסל כרגע");
      } finally {
        await queryClient.invalidateQueries({ queryKey: ["cart"] });
        setActiveMutationKey(null);
      }
    });
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
            data-testid="cart-overlay"
          />

          {/* Drawer panel */}
          <motion.div
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl"
            data-testid="cart-drawer"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border/40 px-6">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-semibold tracking-tight">הסל שלך</span>
                {items.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                    {items.length}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={closeCart}
                aria-label="סגירת סל"
                data-testid="cart-close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {isLoading ? (
                <div
                  className="space-y-4"
                  aria-busy="true"
                  data-testid="cart-loading"
                >
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex animate-pulse gap-3">
                      <div className="h-16 w-16 shrink-0 rounded-lg bg-muted" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 w-3/4 rounded bg-muted" />
                        <div className="h-3 w-1/2 rounded bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center gap-4 py-16 text-center"
                  data-testid="cart-empty"
                >
                  <Package className="h-12 w-12 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">הסל שלך ריק</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={closeCart}
                    asChild
                  >
                    <Link href="/products">למעבר למוצרים</Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-3" data-testid="cart-items">
                  {items.map(
                    (item: {
                      id: string;
                      quantity: number;
                      productId: string;
                      name: string;
                      slug: string;
                      priceInCents: number;
                      imageUrl: string | null;
                    }) => (
                      <li
                        key={item.id}
                        className="flex gap-3 rounded-xl border border-border/30 p-3"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                              אין תמונה
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <Link
                            href={`/products/${item.slug}`}
                            className="truncate text-sm font-medium hover:underline"
                            onClick={closeCart}
                          >
                            {item.name}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {formatPrice(item.priceInCents)} ליחידה
                          </span>

                          {/* Quantity controls + remove */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-border/40 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="הקטנת כמות"
                              disabled={
                                isMutating &&
                                activeMutationKey === `qty:${item.id}`
                              }
                              onClick={() =>
                                runCartMutation(`qty:${item.id}`, () =>
                                  updateCartQuantity(
                                    item.id,
                                    item.quantity - 1,
                                    new FormData(),
                                  ),
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </button>

                            <span
                              className="min-w-[1.5rem] text-center text-sm font-medium tabular-nums"
                              data-testid="drawer-quantity"
                            >
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-border/40 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="הגדלת כמות"
                              disabled={
                                isMutating &&
                                activeMutationKey === `qty:${item.id}`
                              }
                              onClick={() =>
                                runCartMutation(`qty:${item.id}`, () =>
                                  updateCartQuantity(
                                    item.id,
                                    item.quantity + 1,
                                    new FormData(),
                                  ),
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </button>

                            <button
                              type="button"
                              className="mr-auto cursor-pointer text-xs text-muted-foreground transition-colors hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                              data-testid="drawer-remove"
                              disabled={
                                isMutating &&
                                activeMutationKey === `remove:${item.id}`
                              }
                              onClick={() =>
                                runCartMutation(`remove:${item.id}`, () =>
                                  removeFromCart(
                                    item.productId,
                                    new FormData(),
                                  ),
                                )
                              }
                            >
                              הסרה
                            </button>
                          </div>
                        </div>

                        {/* Line subtotal */}
                        <span className="shrink-0 text-sm font-semibold tabular-nums">
                          {formatPrice(item.priceInCents * item.quantity)}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>

            {/* Sticky footer */}
            {items.length > 0 && (
              <div className="space-y-3 border-t border-border/40 px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    סכום ביניים
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full rounded-full"
                    asChild
                    onClick={closeCart}
                  >
                    <Link href="/checkout">לתשלום</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    asChild
                    onClick={closeCart}
                  >
                    <Link href="/cart">לצפייה בסל המלא</Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
