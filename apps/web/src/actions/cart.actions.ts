"use server";

import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  _prevState: unknown,
  _formData: FormData
) {
  try {
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

    revalidatePath("/cart");
    revalidatePath("/products");
    return { success: true, message: existing ? "Cart updated" : "Added to cart" };
  } catch (_error) {
    return { success: false, message: "Failed to add to cart" };
  }
}

export async function removeFromCart(
  userId: string,
  productId: string,
  _prevState: unknown,
  _formData: FormData
) {
  try {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));

    revalidatePath("/cart");
    return { success: true, message: "Removed from cart" };
  } catch (_error) {
    return { success: false, message: "Failed to remove from cart" };
  }
}

export async function updateCartQuantity(
  itemId: string,
  quantity: number,
  _prevState: unknown,
  _formData: FormData
) {
  try {
    if (quantity <= 0) {
      await db.delete(cartItems).where(eq(cartItems.id, itemId));
    } else {
      await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
    }

    revalidatePath("/cart");
    return { success: true, message: quantity <= 0 ? "Item removed" : "Quantity updated" };
  } catch (_error) {
    return { success: false, message: "Failed to update quantity" };
  }
}
