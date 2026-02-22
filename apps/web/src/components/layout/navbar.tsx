import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Products
          </Link>
          <Link href="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cart
          </Link>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
