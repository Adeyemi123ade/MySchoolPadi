"use client";

import { useAuth } from "@/hooks/use-auth";
import { CoursesManager } from "@/features/courses/components/courses-manager";
import { CoursesBrowser } from "@/features/courses/components/courses-browser";

export default function CoursesPage() {
  const { profile } = useAuth();

  if (profile?.role === "lecturer") return <CoursesManager />;
  return <CoursesBrowser />;
}
