"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Enrollment } from "@/types";

export function useEnrollInCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) =>
      fetchJson<Enrollment>("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["enrollments"] }),
  });
}

export function useDropEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentId: string) =>
      fetchJson<{ success: boolean }>(`/api/enrollments/${enrollmentId}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["enrollments"] }),
  });
}
