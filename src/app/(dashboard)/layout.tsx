import { DashboardShell } from "@/components/layout/dashboard-shell";

// Dashboard Layout — Header + Sidebar + Main Content + Footer regions
// (per Frontend Architecture: Layout Architecture). This is navigation
// chrome shared by every dashboard route; individual screens still need
// their own content built out.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
