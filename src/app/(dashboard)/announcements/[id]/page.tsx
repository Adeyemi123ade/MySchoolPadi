"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowLeft, Bookmark, Send, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadError } from "@/components/shared/load-error";
import { useAnnouncement, usePublishAnnouncement, useDeleteAnnouncement } from "@/features/announcements/hooks/use-announcements";
import { useBookmarks, useToggleBookmark } from "@/features/bookmarks/hooks/use-bookmarks";
import { useAuth } from "@/hooks/use-auth";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { announcementBadge } from "@/features/announcements/lib/badge";
import { ApiFetchError } from "@/lib/api/fetch-json";
import { ROUTES } from "@/constants/routes";
import { FileQuestion } from "lucide-react";

export default function AnnouncementDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile } = useAuth();

  const { data: announcement, isLoading, isError, error, refetch } = useAnnouncement(id);
  const notFound = error instanceof ApiFetchError && error.status === 404;
  const { data: bookmarks } = useBookmarks("announcement");
  const toggleBookmark = useToggleBookmark();
  const publish = usePublishAnnouncement();
  const remove = useDeleteAnnouncement();

  const isBookmarked = bookmarks?.some((b) => b.bookmarkable_id === id) ?? false;
  const isAuthor = announcement && profile?.id === announcement.author.id;

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: announcement?.title, url });
      } catch {
        // user cancelled the share sheet — no-op
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  function handleDelete() {
    if (!announcement) return;
    remove.mutate(announcement.id, { onSuccess: () => router.push(ROUTES.announcements) });
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" aria-label="Back" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>

        {announcement && (
          <div className="flex items-center gap-1">
            {profile && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                aria-pressed={isBookmarked}
                disabled={toggleBookmark.isPending}
                onClick={() =>
                  toggleBookmark.mutate({ type: "announcement", id: announcement.id, bookmarked: isBookmarked })
                }
              >
                <Bookmark className={cn("size-5", isBookmarked && "fill-primary text-primary")} />
              </Button>
            )}
            <Button variant="ghost" size="icon" aria-label="Share" onClick={handleShare}>
              <Share2 className="size-5" />
            </Button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-4 rounded-lg border border-border p-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {isError && notFound && (
        <EmptyState
          icon={FileQuestion}
          title="This announcement isn't available"
          description="It may have been removed, or you don't have access to it."
        />
      )}

      {isError && !notFound && <LoadError title="Couldn't load this announcement" onRetry={() => refetch()} />}

      {announcement && (
        <div className="flex flex-col gap-4 rounded-lg border border-border p-6">
          <Badge variant={announcementBadge(announcement).variant}>{announcementBadge(announcement).label}</Badge>

          <h1 className="text-h3 font-bold text-foreground">{announcement.title}</h1>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={announcement.author.avatar_url ?? undefined} alt={announcement.author.full_name ?? "Author"} />
              <AvatarFallback>{initials(announcement.author.full_name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-body font-medium text-foreground">{announcement.author.full_name}</p>
              <p className="text-caption text-muted-foreground">
                {announcement.author.department ? `${announcement.author.department} · ` : ""}
                {formatDistanceToNowStrict(new Date(announcement.published_at ?? announcement.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          <p className="whitespace-pre-wrap text-body text-foreground">{announcement.body}</p>

          {isAuthor && (
            <div className="flex gap-2 border-t border-border pt-4">
              {announcement.status === "draft" && (
                <Button onClick={() => publish.mutate(announcement.id)} disabled={publish.isPending}>
                  <Send /> Publish
                </Button>
              )}
              <Button variant="secondary" asChild>
                <Link href={`${ROUTES.newAnnouncement}?edit=${announcement.id}`}>Edit</Link>
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={remove.isPending}>
                <Trash2 /> Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
