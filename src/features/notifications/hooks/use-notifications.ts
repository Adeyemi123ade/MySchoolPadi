"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Notification } from "@/types";

/** The current user's notifications. Used for both the Notifications screen and the header's unread badge. */
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchJson<Notification[]>("/api/notifications"),
    staleTime: 30 * 1000,
  });
}

export function useUnreadNotificationCount() {
  const { data } = useNotifications();
  return data?.filter((n) => !n.is_read).length ?? 0;
}
