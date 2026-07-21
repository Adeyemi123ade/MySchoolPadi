"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

/** The current lecturer's own courses, each with its real enrolled-student count. */
export function useMyCourses() {
  return useQuery({
    queryKey: ["courses", "mine"],
    queryFn: () => fetchJson<(Course & { enrolled_count: number })[]>("/api/courses?mine=1"),
    staleTime: 30 * 1000,
  });
}

/** Looks up a single course by its exact code within a school. Used by the "Join with Course Code" flow; disabled until both args are present. */
export function useCourseByCode(schoolId?: string, code?: string) {
  return useQuery({
    queryKey: ["courses", "by-code", schoolId, code],
    queryFn: () =>
      fetchJson<CourseWithLecturer | null>(
        `/api/courses?code=${encodeURIComponent(code!)}&schoolId=${encodeURIComponent(schoolId!)}`,
      ),
    enabled: Boolean(schoolId && code),
  });
}

/** Creates a course. Requires role lecturer/admin server-side; invalidates the lecturer's own-courses list on success. */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { code: string; title: string; description?: string; schoolId: string }) =>
      fetchJson<Course>("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
