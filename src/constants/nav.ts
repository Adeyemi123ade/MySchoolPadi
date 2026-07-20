import {
  Bell,
  BookOpen,
  Bookmark,
  CalendarDays,
  BarChart3,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Settings,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROUTES } from "./routes";
import type { UserRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Sidebar (desktop) + mobile drawer nav for students — per User Flow Map "Navigation Map (App Structure)". */
const STUDENT_SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Courses", href: ROUTES.courses, icon: BookOpen },
  { label: "Announcements", href: ROUTES.announcements, icon: Megaphone },
  { label: "Notifications", href: ROUTES.notifications, icon: Bell },
  { label: "Bookmarks", href: ROUTES.bookmarks, icon: Bookmark },
  { label: "Profile", href: ROUTES.profile, icon: User },
];

/** Sidebar nav for lecturers — per Lecturer Dashboard mockup. */
const LECTURER_SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Courses", href: ROUTES.courses, icon: BookOpen },
  { label: "Announcements", href: ROUTES.announcements, icon: Megaphone },
  { label: "Students", href: ROUTES.students, icon: Users },
  { label: "Analytics", href: ROUTES.analytics, icon: BarChart3 },
  { label: "Calendar", href: ROUTES.calendar, icon: CalendarDays },
  { label: "Messages", href: ROUTES.messages, icon: MessageSquare },
  { label: "Settings", href: ROUTES.settings, icon: Settings },
];

const STUDENT_BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Courses", href: ROUTES.courses, icon: BookOpen },
  { label: "Announcements", href: ROUTES.announcements, icon: Megaphone },
  { label: "Notifications", href: ROUTES.notifications, icon: Bell },
  { label: "Profile", href: ROUTES.profile, icon: User },
];

const LECTURER_BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Courses", href: ROUTES.courses, icon: BookOpen },
  { label: "Students", href: ROUTES.students, icon: Users },
  { label: "Analytics", href: ROUTES.analytics, icon: BarChart3 },
  { label: "Profile", href: ROUTES.profile, icon: User },
];

export function getSidebarNavItems(role?: UserRole | null): NavItem[] {
  return role === "lecturer" ? LECTURER_SIDEBAR_NAV_ITEMS : STUDENT_SIDEBAR_NAV_ITEMS;
}

export function getBottomNavItems(role?: UserRole | null): NavItem[] {
  return role === "lecturer" ? LECTURER_BOTTOM_NAV_ITEMS : STUDENT_BOTTOM_NAV_ITEMS;
}
