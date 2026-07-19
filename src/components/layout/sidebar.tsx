"use client";

import { NavLink } from "./nav-link";
import { getSidebarNavItems } from "@/constants/nav";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const { profile } = useAuth();
  const items = getSidebarNavItems(profile?.role);

  return (
    <nav aria-label="Main navigation" className="flex h-full w-64 flex-col gap-1 border-r border-border bg-background p-4">
      {items.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </nav>
  );
}
