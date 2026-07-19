"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Course, CourseWithLecturer } from "@/types";

/** Courses visible to the current user, optionally scoped to a school or a title search. */
export function useCourses(params?: { schoolId?: string; search?: string }) {
  const search = new URLSearchParams();
  if (params?.schoolId) search.set("schoolId", params.schoolId);
  if (params?.search) search.set("search", params.search);

  return useQuery({
    queryKey: ["courses", params ?? {}],
    queryFn: () => fetchJson<CourseWithLecturer[]>(`/api/courses${search.toString() ? `?${search}` : ""}`),
    staleTime: 30 * 1000,
  });
}

/** The current lecturer's own courses. */
export function useMyCourses() {
  return useQuery({
    queryKey: ["courses", "mine"],
    queryFn: () => fetchJson<Course[]>("/api/courses?mine=1"),
    staleTime: 30 * 1000,
  });
}
