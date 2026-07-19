"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import type { AnnouncementWithAuthor } from "@/types";

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
