"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Bookmark, BookmarkableType } from "@/types";

/** The current user's bookmarks, optionally filtered by type. */
export function useBookmarks(type?: BookmarkableType) {
  return useQuery({
    queryKey: ["bookmarks", type ?? "all"],
    queryFn: () => fetchJson<Bookmark[]>(`/api/bookmarks${type ? `?type=${type}` : ""}`),
    staleTime: 30 * 1000,
  });
}

/** Adds or removes a bookmark, invalidating the bookmarks list on success. */
export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id, bookmarked }: { type: BookmarkableType; id: string; bookmarked: boolean }) =>
      fetchJson("/api/bookmarks", {
        method: bookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
