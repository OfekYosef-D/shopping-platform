import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { orders, cartItems, orderItems, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { env } from "@/lib/env/server";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  await db.transaction(async (tx) => {
    const [order] = await tx
      .select({ id: orders.id, userId: orders.userId, status: orders.status })
      .from(orders)
      .where(eq(orders.stripeSessionId, session.id))
      .limit(1);

    if (!order) {
      return;
    }

    if (order.status !== "paid") {
      await tx
        .update(orders)
        .set({ status: "paid", updatedAt: new Date() })
        .where(eq(orders.id, order.id));

      const purchased = await tx
        .select({ productId: orderItems.productId, quantity: orderItems.quantity })
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      for (const item of purchased) {
        await tx
          .update(products)
          .set({
            stock: sql`GREATEST(${products.stock} - ${item.quantity}, 0)`,
          })
          .where(eq(products.id, item.productId));
      }
    }

    await tx.delete(cartItems).where(eq(cartItems.userId, order.userId));
  });

  return NextResponse.json({ received: true });
}
