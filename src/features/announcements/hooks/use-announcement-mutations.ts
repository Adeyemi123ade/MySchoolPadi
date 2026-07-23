"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Announcement, AnnouncementPriority } from "@/types";

export interface AnnouncementInput {
  title: string;
  body: string;
  priority: AnnouncementPriority;
  courseId?: string;
  schoolId?: string;
}

function invalidateAnnouncements(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["announcements"] });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AnnouncementInput) =>
      fetchJson<Announcement>("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => invalidateAnnouncements(queryClient),
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: Partial<AnnouncementInput> & { id: string }) =>
      fetchJson<Announcement>(`/api/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => invalidateAnnouncements(queryClient),
  });
}

export function usePublishAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchJson<Announcement>(`/api/announcements/${id}/publish`, { method: "POST" }),
    onSuccess: () => invalidateAnnouncements(queryClient),
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchJson<{ success: boolean }>(`/api/announcements/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateAnnouncements(queryClient),
  });
}
