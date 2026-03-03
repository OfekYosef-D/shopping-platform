import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenuButton } from "./mobile-menu-button";
import { MobileMenu } from "./mobile-menu";
import { CartTriggerButton } from "./cart-trigger-button";
import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { SITE_NAME } from "@/lib/constants";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartCount = 0;
  if (user) {
    const [result] = await db
      .select({ count: count() })
      .from(cartItems)
      .where(eq(cartItems.userId, user.id));
    cartCount = result?.count ?? 0;
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="font-display text-2xl tracking-tight transition-opacity hover:opacity-80">
            {SITE_NAME}
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              מוצרים
            </Link>
            <CartTriggerButton initialCount={cartCount} />
            {user ? (
              <>
                <span className="hidden max-w-40 truncate text-sm text-muted-foreground lg:block">
                  {user.email}
                </span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  התחברות
                </Link>
                <Link href="/register" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  הרשמה
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <MobileMenuButton />
          </div>
        </div>
      </nav>

      <MobileMenu user={user} initialCount={cartCount} />
    </>
  );
}
