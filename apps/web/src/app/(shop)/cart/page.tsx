import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { CartItemRow } from "./_components/cart-item-row";
import { ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const items = await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      productId: products.id,
      name: products.name,
      slug: products.slug,
      priceInCents: products.priceInCents,
      imageUrl: products.imageUrl,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, user.id));

  const total = items.reduce(
    (sum, item) => sum + item.priceInCents * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <main className="container mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-normal tracking-tight">Your Cart</h1>
          <p className="text-muted-foreground">Nothing here yet. Start shopping.</p>
        </div>
        <Link href="/products">
          <Button className="rounded-full px-8">Shop Products</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display mb-10 text-5xl font-normal tracking-tight sm:text-6xl">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items list */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <GlassCard key={item.id} className="p-0 overflow-hidden">
              <CartItemRow
                id={item.id}
                productId={item.productId}
                name={item.name}
                slug={item.slug}
                priceInCents={item.priceInCents}
                imageUrl={item.imageUrl}
                quantity={item.quantity}
              />
            </GlassCard>
          ))}
        </div>

        {/* Order summary — sticky */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <GlassCard className="space-y-4">
            <h2 className="font-semibold tracking-tight">Order Summary</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                  <span className="truncate pr-2">{item.name} × {item.quantity}</span>
                  <span className="shrink-0">{formatPrice(item.priceInCents * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border/40 pt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Shipping</span>
              <span className="text-sm text-muted-foreground">Calculated at checkout</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full rounded-full">
                Proceed to Checkout
              </Button>
            </Link>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
