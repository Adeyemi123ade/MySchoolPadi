"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import {
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/features/notifications/hooks/use-notification-mutations";
import type { Notification } from "@/types";

export default function NotificationsPage() {
  const router = useRouter();
  const { data: notifications, isLoading, isError } = useNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0;

  function handleOpen(notification: Notification) {
    if (!notification.is_read) markAsRead.mutate(notification.id);
    if (notification.link) router.push(notification.link);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-body text-muted-foreground">Stay on top of what&apos;s new.</p>
        {unreadCount > 0 && (
          <Button type="button" variant="secondary" size="sm" onClick={() => markAllAsRead.mutate()}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}

        {isError && (
          <p className="rounded-md border border-border p-4 text-body text-muted-foreground">
            Couldn&apos;t load notifications right now.
          </p>
        )}

        {!isLoading && !isError && notifications?.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-md border border-border p-10 text-center">
            <Bell className="size-8 text-muted-foreground" />
            <p className="text-body text-muted-foreground">You&apos;re all caught up.</p>
          </div>
        )}

        {notifications?.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() => handleOpen(notification)}
            className={cn(
              "flex flex-col gap-1 rounded-md border border-border p-4 text-left transition-colors hover:border-primary/40",
              !notification.is_read && "bg-primary/5",
            )}
          >
            <div className="flex items-center gap-2">
              {!notification.is_read && <span className="size-2 shrink-0 rounded-pill bg-primary" />}
              <p className="text-body font-semibold text-foreground">{notification.title}</p>
            </div>
            {notification.body && <p className="text-body text-muted-foreground">{notification.body}</p>}
            <p className="text-caption text-muted-foreground">
              {formatDistanceToNowStrict(new Date(notification.created_at), { addSuffix: true })}
            </p>
          </button>
        ))}
      </div>

      {notifications && notifications.length > 0 && (
        <p className="text-center text-caption text-muted-foreground">
          Looking for a specific announcement?{" "}
          <Link href="/announcements" className="font-medium text-primary hover:underline">
            View all announcements
          </Link>
        </p>
      )}
    </div>
  );
}
