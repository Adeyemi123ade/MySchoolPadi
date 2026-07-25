"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/constants/nav";

export function NavLink({
  item,
  className,
  collapsed = false,
  onDoubleClick,
}: {
  item: NavItem;
  className?: string;
  collapsed?: boolean;
  onDoubleClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
      onDoubleClick={onDoubleClick}
      className={cn(
        "flex items-center gap-3 rounded-sm px-3 py-2 text-body font-medium transition-colors",
        collapsed && "justify-center px-0",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <Icon className="size-5 shrink-0" />
      {!collapsed && item.label}
    </Link>
  );
}
