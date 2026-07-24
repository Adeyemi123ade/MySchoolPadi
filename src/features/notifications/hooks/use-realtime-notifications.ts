"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Notification } from "@/types";

/**
 * Subscribes to the current user's notifications over Supabase Realtime so
 * new announcements arrive instantly — no manual refresh. Mounted once in
 * the dashboard shell so it's active on every authenticated page.
 */
export function useRealtimeNotifications() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!profile) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${profile.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${profile.id}` },
        (payload) => {
          const notification = payload.new as Notification;

          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          if (notification.type === "announcement") {
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
          }

          toast(notification.title, {
            description: notification.body ?? undefined,
            action: notification.link
              ? { label: "View", onClick: () => (window.location.href = notification.link!) }
              : undefined,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, queryClient]);
}
