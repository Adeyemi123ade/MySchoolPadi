"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Announcement, AnnouncementPriority, AnnouncementWithAuthor } from "@/types";

/** Published announcements visible to the current user. */
export function useAnnouncements(params?: { courseId?: string; schoolId?: string }) {
  const search = new URLSearchParams();
  if (params?.courseId) search.set("courseId", params.courseId);
  if (params?.schoolId) search.set("schoolId", params.schoolId);

  return useQuery({
    queryKey: ["announcements", params ?? {}],
    queryFn: () =>
      fetchJson<AnnouncementWithAuthor[]>(`/api/announcements${search.toString() ? `?${search}` : ""}`),
    staleTime: 30 * 1000,
  });
}

/** The current lecturer's own announcements — drafts included. */
export function useMyAnnouncements() {
  return useQuery({
    queryKey: ["announcements", "mine"],
    queryFn: () => fetchJson<Announcement[]>("/api/announcements?mine=1"),
    staleTime: 30 * 1000,
  });
}

/** Fetches a single announcement by id. */
export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: ["announcements", id],
    queryFn: () => fetchJson<AnnouncementWithAuthor>(`/api/announcements/${id}`),
    enabled: Boolean(id),
  });
}

export type CreateAnnouncementInput = {
  title: string;
  body: string;
  courseId?: string;
  schoolId?: string;
  priority?: AnnouncementPriority;
};

/** Creates a draft announcement. */
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAnnouncementInput) =>
      fetchJson<Announcement>("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Publishes a draft announcement. */
export function usePublishAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetchJson<Announcement>(`/api/announcements/${id}/publish`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement published");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Deletes an announcement (draft or published). */
export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetchJson(`/api/announcements/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
