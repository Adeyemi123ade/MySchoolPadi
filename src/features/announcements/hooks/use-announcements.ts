"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Announcement, AnnouncementWithAuthor } from "@/types";

/**
 * Published announcements visible to the current user. Polls on a short
 * interval so the feed picks up newly published announcements on its own —
 * see the note on useNotifications() for why this doesn't rely solely on
 * the realtime push.
 */
export function useAnnouncements(params?: { courseId?: string; schoolId?: string }) {
  const search = new URLSearchParams();
  if (params?.courseId) search.set("courseId", params.courseId);
  if (params?.schoolId) search.set("schoolId", params.schoolId);

  return useQuery({
    queryKey: ["announcements", params ?? {}],
    queryFn: () =>
      fetchJson<AnnouncementWithAuthor[]>(`/api/announcements${search.toString() ? `?${search}` : ""}`),
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000,
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

/** A single announcement by id — used for the detail/drill-down page. */
export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: ["announcements", id],
    queryFn: () => fetchJson<AnnouncementWithAuthor>(`/api/announcements/${id}`),
    staleTime: 30 * 1000,
    enabled: Boolean(id),
  });
}
