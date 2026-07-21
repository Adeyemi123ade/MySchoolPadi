"use client";

import { useAuth } from "@/hooks/use-auth";
import { MyCoursesView } from "@/features/courses/components/my-courses-view";
import { CourseManagementView } from "@/features/courses/components/course-management-view";

export default function CoursesPage() {
  const { profile } = useAuth();

  return profile?.role === "lecturer" ? <CourseManagementView /> : <MyCoursesView />;
}
