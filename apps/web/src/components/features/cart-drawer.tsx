"use client";

import { AnimatePresence, motion } from "motion/react";
import { X, ShoppingCart, Package, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUIStore } from "@/stores/ui-store";
import { useCartQuery } from "@/hooks/use-cart-query";
import { removeFromCart, updateCartQuantity } from "@/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/constants";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { data, isLoading } = useCartQuery();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl"
            data-testid="cart-drawer"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border/40 px-6">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-semibold tracking-tight">Your Cart</span>
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
                aria-label="Close cart"
                data-testid="cart-close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {isLoading ? (
                <div className="space-y-4" aria-busy="true" data-testid="cart-loading">
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
                  <p className="text-sm text-muted-foreground">Your cart is empty</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={closeCart}
                    asChild
                  >
                    <Link href="/products">Browse Products</Link>
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
                              No Image
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
                            {formatPrice(item.priceInCents)} each
                          </span>

                          {/* Quantity controls + remove */}
                          <div className="flex items-center gap-2">
                            <form
                              action={updateCartQuantity.bind(
                                null,
                                item.id,
                                item.quantity - 1
                              )}
                            >
                              <button
                                type="submit"
                                className="flex h-6 w-6 items-center justify-center rounded-full border border-border/40 transition-colors hover:bg-muted"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                            </form>

                            <span
                              className="min-w-[1.5rem] text-center text-sm font-medium tabular-nums"
                              data-testid="drawer-quantity"
                            >
                              {item.quantity}
                            </span>

                            <form
                              action={updateCartQuantity.bind(
                                null,
                                item.id,
                                item.quantity + 1
                              )}
                            >
                              <button
                                type="submit"
                                className="flex h-6 w-6 items-center justify-center rounded-full border border-border/40 transition-colors hover:bg-muted"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </form>

                            <form
                              action={removeFromCart.bind(null, item.productId)}
                              className="ml-auto"
                            >
                              <button
                                type="submit"
                                className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                                data-testid="drawer-remove"
                              >
                                Remove
                              </button>
                            </form>
                          </div>
                        </div>

                        {/* Line subtotal */}
                        <span className="shrink-0 text-sm font-semibold tabular-nums">
                          {formatPrice(item.priceInCents * item.quantity)}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            {/* Sticky footer */}
            {items.length > 0 && (
              <div className="space-y-3 border-t border-border/40 px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-semibold tabular-nums">{formatPrice(total)}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button className="w-full rounded-full" asChild onClick={closeCart}>
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    asChild
                    onClick={closeCart}
                  >
                    <Link href="/cart">View Full Cart</Link>
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
