"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Notification } from "@/types";

/**
 * The current user's notifications. Used for both the Notifications screen
 * and the header's unread badge. Realtime pushes an update the moment a new
 * one lands (see useRealtimeNotifications), but this also polls on a short
 * interval as a guaranteed fallback — the badge must never depend on a
 * websocket connection actually holding up on every network/browser.
 */
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchJson<Notification[]>("/api/notifications"),
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000,
  });
}

export function useUnreadNotificationCount() {
  const { data } = useNotifications();
  return data?.filter((n) => !n.is_read).length ?? 0;
}
