import Link from "next/link";
import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { formatPrice } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { CartItemRow } from "./_components/cart-item-row";
import { ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

type GuestCartItem = { productId: string; quantity: number };

type CartItem = {
  id: string;
  quantity: number;
  productId: string;
  name: string;
  slug: string;
  priceInCents: number;
  imageUrl: string | null;
};

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let items: CartItem[] = [];
  let total = 0;

  if (!user) {
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("guest_cart");
    let guestItems: GuestCartItem[] = [];
    if (cartCookie) {
      try {
        guestItems = JSON.parse(cartCookie.value) as GuestCartItem[];
      } catch {
        guestItems = [];
      }
    }

    if (guestItems.length > 0) {
      const productIds = guestItems.map(item => item.productId);
      const dbProducts = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          priceInCents: products.priceInCents,
          imageUrl: products.imageUrl,
        })
        .from(products)
        .where(inArray(products.id, productIds));

      items = guestItems.map(g => {
        const p = dbProducts.find(product => product.id === g.productId);
        if (!p) return null;
        return {
          id: g.productId, // Use productId as cartItemId for guest
          quantity: g.quantity,
          productId: p.id,
          name: p.name,
          slug: p.slug,
          priceInCents: p.priceInCents,
          imageUrl: p.imageUrl,
        };
      }).filter((item): item is CartItem => item !== null);
      
      total = items.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0);
    }
  } else {
    items = await db
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

    total = items.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0);
  }

  if (items.length === 0) {
    return (
      <main className="container mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-normal tracking-tight">סל הקניות שלך</h1>
          <p className="text-muted-foreground">הסל עדיין ריק. זה הזמן לבחור את המוצר הבא.</p>
        </div>
        <Link href="/products">
          <Button className="rounded-full px-8">למוצרים</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display mb-10 text-5xl font-normal tracking-tight sm:text-6xl">סל הקניות שלך</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <GlassCard key={item.id} className="overflow-hidden p-0">
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

        <div className="lg:sticky lg:top-24 lg:self-start">
          <GlassCard className="space-y-4">
            <h2 className="font-semibold tracking-tight">סיכום הזמנה</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                  <span className="truncate pe-2">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="shrink-0">{formatPrice(item.priceInCents * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-4">
              <span className="text-sm text-muted-foreground">משלוח</span>
              <span className="text-sm text-muted-foreground">יחושב בשלב התשלום</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>סה״כ</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full rounded-full">
                מעבר לתשלום
              </Button>
            </Link>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
