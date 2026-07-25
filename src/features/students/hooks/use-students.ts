"use client";

import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import { useMyCourses } from "@/features/courses/hooks/use-courses";

interface EnrolledStudent {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface EnrollmentRow {
  id: string;
  course_id: string;
  student: EnrolledStudent | null;
}

/** Students enrolled in a single course. */
export function useCourseStudents(courseId: string) {
  return useQuery({
    queryKey: ["courses", courseId, "enrollments"],
    queryFn: () => fetchJson<EnrollmentRow[]>(`/api/courses/${courseId}/enrollments`),
    staleTime: 30 * 1000,
    enabled: Boolean(courseId),
  });
}

/** Every distinct student enrolled across all of the current lecturer's courses. */
export function useAllMyStudents() {
  const { data: courses, isLoading: coursesLoading } = useMyCourses();

  const enrollmentQueries = useQueries({
    queries: (courses ?? []).map((course) => ({
      queryKey: ["courses", course.id, "enrollments"],
      queryFn: () => fetchJson<EnrollmentRow[]>(`/api/courses/${course.id}/enrollments`),
      staleTime: 30 * 1000,
    })),
  });

  const isLoading = coursesLoading || enrollmentQueries.some((q) => q.isLoading);
  const isError = enrollmentQueries.some((q) => q.isError);

  const students = useMemo(() => {
    const byId = new Map<string, EnrolledStudent & { courseCount: number }>();
    for (const query of enrollmentQueries) {
      for (const row of query.data ?? []) {
        if (!row.student) continue;
        const existing = byId.get(row.student.id);
        if (existing) existing.courseCount += 1;
        else byId.set(row.student.id, { ...row.student, courseCount: 1 });
      }
    }
    return Array.from(byId.values());
  }, [enrollmentQueries]);

  return { data: students, isLoading, isError };
}
