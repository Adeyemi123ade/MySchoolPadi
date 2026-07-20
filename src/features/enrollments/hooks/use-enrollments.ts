"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Enrollment, EnrollmentWithCourse, Profile } from "@/types";

/** The current student's own enrollments, each with its full course row embedded. */
export function useEnrollments() {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: () => fetchJson<EnrollmentWithCourse[]>("/api/enrollments"),
    staleTime: 30 * 1000,
  });
}

type EnrollmentWithStudent = Enrollment & { student: Pick<Profile, "id" | "full_name" | "avatar_url"> | null };

/** The roster (enrolled students) for a course. Only the course's own lecturer or an admin can see this (RLS). */
export function useCourseRoster(courseId?: string) {
  return useQuery({
    queryKey: ["enrollments", "course", courseId],
    queryFn: () => fetchJson<EnrollmentWithStudent[]>(`/api/enrollments?courseId=${courseId}`),
    enabled: Boolean(courseId),
    staleTime: 30 * 1000,
  });
}

/** Enrolls the current user in a course by id. */
export function useEnrollInCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) =>
      fetchJson("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success("Enrolled");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Drops an enrollment by its own id. */
export function useDropEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: string) => fetchJson(`/api/enrollments/${enrollmentId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
