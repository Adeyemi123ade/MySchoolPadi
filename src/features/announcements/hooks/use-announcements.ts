"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Announcement, AnnouncementWithAuthor } from "@/types";

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
