"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import type { EnrollmentWithCourse } from "@/types";

/** The current student's own enrollments, each with its course embedded. */
export function useMyEnrollments() {
  return useQuery({
    queryKey: ["enrollments", "mine"],
    queryFn: () => fetchJson<EnrollmentWithCourse[]>("/api/enrollments"),
    staleTime: 30 * 1000,
  });
}
