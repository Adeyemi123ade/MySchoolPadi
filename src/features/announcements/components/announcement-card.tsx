"use client";

import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { Bookmark } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBookmarks, useToggleBookmark } from "@/features/bookmarks/hooks/use-bookmarks";
import { useAuth } from "@/hooks/use-auth";
import { announcementBadge } from "@/features/announcements/lib/badge";
import { ROUTES } from "@/constants/routes";
import type { AnnouncementWithAuthor } from "@/types";

export function AnnouncementCard({ announcement }: { announcement: AnnouncementWithAuthor }) {
  const { profile } = useAuth();
  const { data: bookmarks } = useBookmarks("announcement");
  const toggleBookmark = useToggleBookmark();

  const badge = announcementBadge(announcement);
  const isBookmarked = bookmarks?.some((b) => b.bookmarkable_id === announcement.id) ?? false;

  function handleBookmarkClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!profile) return;
    toggleBookmark.mutate({ type: "announcement", id: announcement.id, bookmarked: isBookmarked });
  }

  return (
    <Link
      href={ROUTES.announcement(announcement.id)}
      className="flex flex-col gap-2 rounded-md border border-border p-4 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant={badge.variant}>{badge.label}</Badge>
        <button
          type="button"
          onClick={handleBookmarkClick}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          aria-pressed={isBookmarked}
          className="text-muted-foreground hover:text-primary disabled:opacity-50"
          disabled={toggleBookmark.isPending}
        >
          <Bookmark className={cn("size-4", isBookmarked && "fill-primary text-primary")} />
        </button>
      </div>

      <h3 className="text-body font-semibold text-foreground">{announcement.title}</h3>

      <p className="text-caption text-muted-foreground">
        {announcement.author.full_name} &middot;{" "}
        {formatDistanceToNowStrict(new Date(announcement.published_at ?? announcement.created_at), { addSuffix: true })}
      </p>

      <p className="line-clamp-2 text-body text-muted-foreground">{announcement.body}</p>
    </Link>
  );
}
