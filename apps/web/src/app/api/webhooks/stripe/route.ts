import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { orders, cartItems, orderItems, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId in session metadata" }, { status: 400 });
    }

    // Mark the order as paid and retrieve its ID
    const [updatedOrder] = await db
      .update(orders)
      .set({ status: "paid", updatedAt: new Date() })
      .where(eq(orders.stripeSessionId, session.id))
      .returning({ id: orders.id });

    if (updatedOrder) {
      // Decrement stock for each purchased item (floor at 0 to avoid negatives)
      const purchased = await db
        .select({ productId: orderItems.productId, quantity: orderItems.quantity })
        .from(orderItems)
        .where(eq(orderItems.orderId, updatedOrder.id));

      for (const item of purchased) {
        await db
          .update(products)
          .set({
            stock: sql`GREATEST(${products.stock} - ${item.quantity}, 0)`,
          })
          .where(eq(products.id, item.productId));
      }
    }

    // Clear the user's cart
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  return NextResponse.json({ received: true });
}
