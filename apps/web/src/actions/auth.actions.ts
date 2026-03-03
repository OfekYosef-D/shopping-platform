"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { users, cartItems } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

export type AuthState = { success: boolean; message: string } | null;

type GuestCartItem = { productId: string; quantity: number };

async function mergeGuestCartIntoDB(userId: string) {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("guest_cart");
  if (!cartCookie) return;

  let guestItems: GuestCartItem[] = [];
  try {
    guestItems = JSON.parse(cartCookie.value) as GuestCartItem[];
  } catch {
    return;
  }

  if (guestItems.length === 0) return;

  for (const item of guestItems) {
    const existing = await db.query.cartItems.findFirst({
      where: and(eq(cartItems.userId, userId), eq(cartItems.productId, item.productId)),
    });

    if (existing) {
      await db
        .update(cartItems)
        .set({ quantity: existing.quantity + item.quantity })
        .where(eq(cartItems.id, existing.id));
    } else {
      await db.insert(cartItems).values({
        userId,
        productId: item.productId,
        quantity: item.quantity,
      });
    }
  }

  // Clear the guest cookie after merging
  cookieStore.set("guest_cart", "", { maxAge: 0, path: "/" });
}

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.user) {
    await mergeGuestCartIntoDB(data.user.id);
  }

  redirect("/products");
}

export async function register(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { success: false, message: "יש למלא את כל השדות." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data.user) {
    return { success: false, message: "ההרשמה נכשלה. נסו שוב." };
  }

  // Create matching profile in public.users table
  await db
    .insert(users)
    .values({ id: data.user.id, email, name })
    .onConflictDoNothing();

  redirect("/products");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
