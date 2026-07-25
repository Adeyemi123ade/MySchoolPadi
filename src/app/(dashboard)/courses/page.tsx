"use client";

import { useAuth } from "@/hooks/use-auth";
import { BackButton } from "@/components/layout/back-button";
import { CoursesManager } from "@/features/courses/components/courses-manager";
import { CoursesBrowser } from "@/features/courses/components/courses-browser";
import { ROUTES } from "@/constants/routes";

export default function CoursesPage() {
  const { profile } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <BackButton href={ROUTES.dashboard} label="Back to Dashboard" />
      {profile?.role === "lecturer" ? <CoursesManager /> : <CoursesBrowser />}
    </div>
  );
}
