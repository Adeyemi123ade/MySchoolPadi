"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";
import { Bell, BellOff, Megaphone, Settings, UserPlus, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/features/notifications/hooks/use-notifications";
import type { Notification, NotificationType } from "@/types";

type Tab = "all" | "unread" | "announcement" | "system";

const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  announcement: Megaphone,
  enrollment: UserPlus,
  payment: Wallet,
  system: Settings,
};

function groupByDay(notifications: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = [];
  const buckets = new Map<string, Notification[]>();

  for (const n of notifications) {
    const date = new Date(n.created_at);
    const label = isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : "Earlier";
    if (!buckets.has(label)) buckets.set(label, []);
    buckets.get(label)!.push(n);
  }

  for (const label of ["Today", "Yesterday", "Earlier"]) {
    const items = buckets.get(label);
    if (items?.length) groups.push({ label, items });
  }

  return groups;
}

export function NotificationsView() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("all");
  const { data: notifications, isLoading, isError } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const filtered = useMemo(() => {
    let list = notifications ?? [];
    if (tab === "unread") list = list.filter((n) => !n.is_read);
    else if (tab === "announcement") list = list.filter((n) => n.type === "announcement");
    else if (tab === "system") list = list.filter((n) => n.type === "system");
    return list;
  }, [notifications, tab]);

  const groups = useMemo(() => groupByDay(filtered), [filtered]);
  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0;

  function handleClick(notification: Notification) {
    if (!notification.is_read) markRead.mutate(notification.id);
    if (notification.link) router.push(notification.link);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-bold text-foreground">Notifications</h1>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
          <TabsTrigger value="announcement">Announcements</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="flex flex-col gap-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}

          {isError && (
            <p className="rounded-md border border-border p-4 text-body text-muted-foreground">
              Couldn&apos;t load notifications right now.
            </p>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState
              icon={BellOff}
              title="No notifications"
              description={tab === "unread" ? "You're all caught up." : "Nothing here yet."}
            />
          )}

          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              <p className="text-caption font-semibold text-muted-foreground">{group.label}</p>
              {group.items.map((notification) => {
                const Icon = TYPE_ICON[notification.type] ?? Bell;
                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleClick(notification)}
                    className={cn(
                      "flex items-start gap-3 rounded-md border border-border p-4 text-left transition-colors hover:bg-muted/50",
                      !notification.is_read && "bg-primary/5",
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-medium text-foreground">{notification.title}</p>
                      {notification.body && (
                        <p className="truncate text-caption text-muted-foreground">{notification.body}</p>
                      )}
                      <p className="mt-1 text-caption text-muted-foreground">
                        {formatDistanceToNowStrict(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.is_read && <span className="mt-1.5 size-2 shrink-0 rounded-pill bg-primary" />}
                  </button>
                );
              })}
            </div>
          ))}

          {unreadCount > 0 && (
            <Button
              variant="secondary"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="mt-2"
            >
              Mark all as read
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
