import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="font-display text-xl tracking-tight">{SITE_NAME}</p>
            <p className="text-sm text-muted-foreground">{SITE_DESCRIPTION}</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">חנות</p>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  מוצרים
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  סל קניות
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">חשבון</p>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  התחברות
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  אזור אישי
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_NAME}. כל הזכויות שמורות.
          </p>
          <p className="text-xs text-muted-foreground">נבנה עם Next.js</p>
        </div>
      </div>
    </footer>
  );
}
