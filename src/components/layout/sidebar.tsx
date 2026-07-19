import { NavLink } from "./nav-link";
import { SIDEBAR_NAV_ITEMS } from "@/constants/nav";

export function Sidebar() {
  return (
    <nav aria-label="Main navigation" className="flex h-full w-64 flex-col gap-1 border-r border-border bg-background p-4">
      {SIDEBAR_NAV_ITEMS.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </nav>
  );
}
