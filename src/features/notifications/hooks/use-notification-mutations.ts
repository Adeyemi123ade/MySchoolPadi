"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";

function invalidateNotifications(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["notifications"] });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchJson<{ success: boolean }>(`/api/notifications/${id}`, { method: "PATCH" }),
    onSuccess: () => invalidateNotifications(queryClient),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchJson<{ success: boolean }>("/api/notifications/mark-all-read", { method: "POST" }),
    onSuccess: () => invalidateNotifications(queryClient),
  });
}
