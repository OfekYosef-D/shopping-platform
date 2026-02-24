"use client";

import Link from "next/link";
import { useUIStore } from "@/stores/ui-store";
import { useCartQuery } from "@/hooks/use-cart-query";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, LayoutDashboard, Package, LogIn, UserPlus } from "lucide-react";
import { LogoutButton } from "./logout-button";


interface MobileMenuProps {
  user: { email?: string | null } | null;
  initialCount: number;
}

export function MobileMenu({ user, initialCount }: MobileMenuProps) {
  const { isMobileMenuOpen, closeMobileMenu, openCart } = useUIStore();
  const { data } = useCartQuery();
  const count = data?.items?.length ?? initialCount;

  if (!isMobileMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
        onClick={closeMobileMenu}
      />
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/40 px-6">
          <span className="font-display text-xl tracking-tight">Mizronim</span>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={closeMobileMenu}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 p-4">
          <Link
            href="/products"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
          <button
            type="button"
            onClick={() => { closeMobileMenu(); openCart(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
            {count > 0 && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {count}
              </span>
            )}
          </button>
          {user && (
            <Link
              href="/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-border/40" />

        {/* Auth section */}
        <div className="flex flex-col gap-1 p-4">
          {user ? (
            <>
              <p className="truncate px-3 py-1 text-xs text-muted-foreground">{user.email}</p>
              <div onClick={closeMobileMenu}>
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
