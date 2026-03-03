"use server";

import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

type GuestCartItem = { productId: string; quantity: number };

async function getGuestCart(): Promise<GuestCartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("guest_cart");
  if (!cartCookie) return [];
  try {
    return JSON.parse(cartCookie.value) as GuestCartItem[];
  } catch {
    return [];
  }
}

async function setGuestCart(cart: GuestCartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set("guest_cart", JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function addToCart(
  productId: string,
  quantity: number,
  _prevState: unknown,
  _formData: FormData
) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      // Guest cart via cookie
      const cart = await getGuestCart();
      const existingItem = cart.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ productId, quantity });
      }
      
      await setGuestCart(cart);
      revalidatePath("/cart");
      revalidatePath("/products");
      return { success: true, message: existingItem ? "הסל עודכן." : "המוצר נוסף לסל." };
    }

    // Authenticated user via DB
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
    return { success: true, message: existing ? "הסל עודכן." : "המוצר נוסף לסל." };
  } catch (_error) {
    return { success: false, message: "לא הצלחנו להוסיף את המוצר לסל." };
  }
}

export async function removeFromCart(
  productId: string,
  _formData: FormData
) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      // Guest cart via cookie
      const cart = await getGuestCart();
      const updatedCart = cart.filter(item => item.productId !== productId);
      await setGuestCart(updatedCart);
      
      revalidatePath("/cart");
      return { success: true, message: "המוצר הוסר מהסל." };
    }

    // Authenticated user via DB
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, user.id), eq(cartItems.productId, productId)));

    revalidatePath("/cart");
    return { success: true, message: "המוצר הוסר מהסל." };
  } catch (_error) {
    return { success: false, message: "לא הצלחנו להסיר את המוצר מהסל." };
  }
}

export async function updateCartQuantity(
  itemId: string,
  quantity: number,
  _formData: FormData
) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      // Guest cart via cookie
      // Note: for guests, itemId is actually the productId currently
      const cart = await getGuestCart();
      
      if (quantity <= 0) {
        const updatedCart = cart.filter(item => item.productId !== itemId);
        await setGuestCart(updatedCart);
      } else {
        const existingItem = cart.find(item => item.productId === itemId);
        if (existingItem) {
          existingItem.quantity = quantity;
          await setGuestCart(cart);
        }
      }
      
      revalidatePath("/cart");
      return { success: true, message: quantity <= 0 ? "המוצר הוסר מהסל." : "הכמות עודכנה." };
    }

    // Authenticated user via DB
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
    return { success: true, message: quantity <= 0 ? "המוצר הוסר מהסל." : "הכמות עודכנה." };
  } catch (_error) {
    return { success: false, message: "לא הצלחנו לעדכן את הכמות." };
  }
}
