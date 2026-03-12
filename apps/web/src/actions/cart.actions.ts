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
  prevState: unknown,
  formData: FormData,
) {
  void prevState;
  void formData;

  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return { success: false, message: "יש להתחבר כדי להוסיף מוצרים לסל." };

    const existing = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.userId, user.id),
        eq(cartItems.productId, productId),
      ),
    });

    if (existing) {
      await db
        .update(cartItems)
        .set({ quantity: existing.quantity + quantity })
        .where(eq(cartItems.id, existing.id));
    } else {
      await db
        .insert(cartItems)
        .values({ userId: user.id, productId, quantity });
    }

    revalidatePath("/cart");
    revalidatePath("/products");
    return {
      success: true,
      message: existing ? "הסל עודכן בהצלחה." : "המוצר נוסף לסל.",
    };
  } catch {
    return { success: false, message: "לא הצלחנו להוסיף את המוצר לסל." };
  }
}

export async function removeFromCart(productId: string, formData: FormData) {
  void formData;

  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: "יש להתחבר כדי לנהל את הסל." };

    await db
      .delete(cartItems)
      .where(
        and(eq(cartItems.userId, user.id), eq(cartItems.productId, productId)),
      );

    revalidatePath("/cart");
    return { success: true, message: "המוצר הוסר מהסל." };
  } catch {
    return { success: false, message: "לא הצלחנו להסיר את המוצר מהסל." };
  }
}

export async function updateCartQuantity(
  itemId: string,
  quantity: number,
  formData: FormData,
) {
  void formData;

  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: "יש להתחבר כדי לנהל את הסל." };

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
    return {
      success: true,
      message: quantity <= 0 ? "המוצר הוסר מהסל." : "הכמות עודכנה בהצלחה.",
    };
  } catch {
    return { success: false, message: "לא הצלחנו לעדכן את הכמות." };
  }
}
