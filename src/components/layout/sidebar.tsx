"use client";

import { NavLink } from "./nav-link";
import { getSidebarNavItems } from "@/constants/nav";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Sidebar({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  /** Fired on a double-click of a nav item — collapses the sidebar while keeping the destination navigation. */
  onNavigate?: () => void;
}) {
  const { profile } = useAuth();
  const items = getSidebarNavItems(profile?.role);

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "flex h-full flex-col gap-1 border-r border-border bg-background p-2 transition-[width] duration-150",
        collapsed ? "w-14 items-center" : "w-56 p-4",
      )}
    >
      {items.map((item) => (
        <NavLink key={item.href} item={item} collapsed={collapsed} onDoubleClick={onNavigate} />
      ))}
    </nav>
  );
}
