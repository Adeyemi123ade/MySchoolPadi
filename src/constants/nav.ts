import { Bell, Bookmark, LayoutDashboard, Megaphone, User } from "lucide-react";
import { BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Sidebar (desktop) + mobile drawer nav — per User Flow Map "Navigation Map (App Structure)". */
export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Courses", href: ROUTES.courses, icon: BookOpen },
  { label: "Announcements", href: ROUTES.announcements, icon: Megaphone },
  { label: "Notifications", href: ROUTES.notifications, icon: Bell },
  { label: "Bookmarks", href: ROUTES.bookmarks, icon: Bookmark },
  { label: "Profile", href: ROUTES.profile, icon: User },
];

/** Bottom nav (mobile) — matches the Design System's 5-item bottom nav mockup (Home/Courses/Announcements/Notifications/Profile). */
export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Courses", href: ROUTES.courses, icon: BookOpen },
  { label: "Announcements", href: ROUTES.announcements, icon: Megaphone },
  { label: "Notifications", href: ROUTES.notifications, icon: Bell },
  { label: "Profile", href: ROUTES.profile, icon: User },
];
