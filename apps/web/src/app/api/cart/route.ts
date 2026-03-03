import { NextResponse } from "next/server";
import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

type GuestCartItem = { productId: string; quantity: number };

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

    if (guestItems.length === 0) {
      return NextResponse.json({ items: [], total: 0 });
    }

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

    // Map back to expected cart response format
    const items = guestItems.map(g => {
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
    }).filter(Boolean);

    const total = items.reduce(
      (sum, item) => sum + (item?.priceInCents || 0) * (item?.quantity || 0),
      0
    );

    return NextResponse.json({ items, total });
  }

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

  return NextResponse.json({ items, total });
}
