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
  const userId = profile?.id;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    let cancelled = false;

    async function subscribe() {
      // The websocket needs the user's JWT explicitly handed to it before
      // subscribing — @supabase/ssr keeps the session in cookies for HTTP
      // requests, but Realtime's RLS check needs `realtime.setAuth()` too,
      // otherwise INSERT events matching the `user_id = auth.uid()` policy
      // are silently dropped instead of delivered.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled || !session) return;
      supabase.realtime.setAuth(session.access_token);

      const channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
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
        .subscribe((status, err) => {
          // Deliberately not gated to dev-only — this is the only way to see
          // whether the websocket actually connected on a deployed preview.
          // eslint-disable-next-line no-console
          console.log("[realtime notifications]", status, err ?? "");
        });

      return channel;
    }

    const channelPromise = subscribe();

    return () => {
      cancelled = true;
      channelPromise.then((channel) => {
        if (channel) supabase.removeChannel(channel);
      });
    };
  }, [userId, queryClient]);
}
