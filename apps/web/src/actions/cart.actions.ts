"use server";

import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function addToCart(userId: string, productId: string, quantity = 1) {
  const existing = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)),
  });

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ userId, productId, quantity });
  }
}

export async function removeFromCart(userId: string, productId: string) {
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));
}

export async function updateCartQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
  }
}
