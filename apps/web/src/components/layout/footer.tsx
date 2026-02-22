import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="container mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
