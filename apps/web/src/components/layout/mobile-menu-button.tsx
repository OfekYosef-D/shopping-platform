"use client";

import { useUIStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function MobileMenuButton() {
  const { toggleMobileMenu } = useUIStore();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 md:hidden"
      onClick={toggleMobileMenu}
      aria-label="Open menu"
    >
      <Menu className="h-4 w-4" />
    </Button>
  );
}
