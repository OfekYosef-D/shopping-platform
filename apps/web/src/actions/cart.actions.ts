"use server";

import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function addToCart(
  productId: string,
  quantity: number,
  _prevState: unknown,
  _formData: FormData
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: "Please sign in to add items to cart" };

    const existing = await db.query.cartItems.findFirst({
      where: and(eq(cartItems.userId, user.id), eq(cartItems.productId, productId)),
    });

    if (existing) {
      await db
        .update(cartItems)
        .set({ quantity: existing.quantity + quantity })
        .where(eq(cartItems.id, existing.id));
    } else {
      await db.insert(cartItems).values({ userId: user.id, productId, quantity });
    }

    revalidatePath("/cart");
    revalidatePath("/products");
    return { success: true, message: existing ? "Cart updated" : "Added to cart" };
  } catch (_error) {
    return { success: false, message: "Failed to add to cart" };
  }
}

export async function removeFromCart(
  productId: string,
  _formData: FormData
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: "Please sign in" };

    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, user.id), eq(cartItems.productId, productId)));

    revalidatePath("/cart");
    return { success: true, message: "Removed from cart" };
  } catch (_error) {
    return { success: false, message: "Failed to remove from cart" };
  }
}

export async function updateCartQuantity(
  itemId: string,
  quantity: number,
  _formData: FormData
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: "Please sign in" };

    if (quantity <= 0) {
      await db
        .delete(cartItems)
        .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, user.id)));
    } else {
      await db
        .update(cartItems)
        .set({ quantity })
        .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, user.id)));
    }

    revalidatePath("/cart");
    return { success: true, message: quantity <= 0 ? "Item removed" : "Quantity updated" };
  } catch (_error) {
    return { success: false, message: "Failed to update quantity" };
  }
}
