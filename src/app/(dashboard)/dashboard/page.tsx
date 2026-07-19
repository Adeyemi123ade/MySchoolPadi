"use client";

import { useAuth } from "@/hooks/use-auth";
import { StudentDashboardView } from "@/features/dashboard/components/student-dashboard-view";
import { LecturerDashboardView } from "@/features/dashboard/components/lecturer-dashboard-view";

export default function DashboardPage() {
  const { profile } = useAuth();

  if (profile?.role === "lecturer") return <LecturerDashboardView />;
  return <StudentDashboardView />;
}
