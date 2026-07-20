"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavLink } from "./nav-link";
import { getSidebarNavItems } from "@/constants/nav";
import { useAuth } from "@/hooks/use-auth";

export function MobileNavSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { profile } = useAuth();
  const items = getSidebarNavItems(profile?.role);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Main navigation" className="flex flex-col gap-1">
          {items.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
