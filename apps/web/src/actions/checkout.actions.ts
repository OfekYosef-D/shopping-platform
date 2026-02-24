"use server";

import Stripe from "stripe";
import { db } from "@/db";
import { cartItems, products, orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function createCheckoutSession(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Load cart items joined with product data
  const items = await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      productId: products.id,
      name: products.name,
      priceInCents: products.priceInCents,
      imageUrl: products.imageUrl,
      stock: products.stock,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, user.id));

  if (items.length === 0) throw new Error("Your cart is empty.");

  // Validate stock availability
  for (const item of items) {
    if (item.stock < item.quantity) {
      throw new Error(`"${item.name}" only has ${item.stock} units available.`);
    }
  }

  const totalInCents = items.reduce(
    (sum, item) => sum + item.priceInCents * item.quantity,
    0
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
        },
        unit_amount: item.priceInCents,
      },
      quantity: item.quantity,
    })),
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/cart`,
    metadata: { userId: user.id },
  });

  // Persist order + line items atomically before redirecting so the webhook can match
  await db.transaction(async (tx) => {
    const [newOrder] = await tx
      .insert(orders)
      .values({
        userId: user.id,
        status: "pending",
        totalInCents,
        stripeSessionId: session.id,
      })
      .returning({ id: orders.id });

    await tx.insert(orderItems).values(
      items.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        productName: item.name,
        priceInCents: item.priceInCents,
        quantity: item.quantity,
      }))
    );
  });

  return session.url!;
}
