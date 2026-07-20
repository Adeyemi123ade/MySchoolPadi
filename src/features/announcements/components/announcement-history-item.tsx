"use client";

import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { MoreVertical, Send, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePublishAnnouncement, useDeleteAnnouncement } from "@/features/announcements/hooks/use-announcements";
import { ROUTES } from "@/constants/routes";
import type { Announcement } from "@/types";

export function AnnouncementHistoryItem({ announcement }: { announcement: Announcement }) {
  const publish = usePublishAnnouncement();
  const remove = useDeleteAnnouncement();
  const isDraft = announcement.status === "draft";

  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-border p-4">
      <Link href={ROUTES.announcement(announcement.id)} className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Badge variant={isDraft ? "outline" : "success"}>{isDraft ? "DRAFT" : "PUBLISHED"}</Badge>
        </div>
        <p className="truncate text-body font-semibold text-foreground">{announcement.title}</p>
        <p className="text-caption text-muted-foreground">
          {isDraft
            ? `Created ${formatDistanceToNowStrict(new Date(announcement.created_at), { addSuffix: true })}`
            : `Published ${formatDistanceToNowStrict(new Date(announcement.published_at ?? announcement.created_at), { addSuffix: true })}`}
        </p>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Announcement actions">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isDraft && (
            <DropdownMenuItem onSelect={() => publish.mutate(announcement.id)} disabled={publish.isPending}>
              <Send /> Publish
            </DropdownMenuItem>
          )}
          <DropdownMenuItem variant="destructive" onSelect={() => remove.mutate(announcement.id)} disabled={remove.isPending}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
