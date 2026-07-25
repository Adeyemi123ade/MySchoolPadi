"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/constants/nav";

const DOUBLE_TAP_WINDOW_MS = 350;

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
  const lastTapRef = useRef(0);

  // Native dblclick isn't reliably synthesized from a touch double-tap
  // across mobile browsers, so detect the second rapid tap manually
  // instead of relying on onDoubleClick. Navigation itself still happens
  // via the Link's normal click — this only adds the extra callback.
  function handleClick() {
    if (!onDoubleClick) return;
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_WINDOW_MS) {
      onDoubleClick();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
      onClick={handleClick}
      className={cn(
        "flex touch-manipulation items-center gap-3 rounded-sm px-3 py-2 text-body font-medium transition-colors",
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
