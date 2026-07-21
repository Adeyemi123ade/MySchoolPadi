"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Megaphone, X } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadError } from "@/components/shared/load-error";
import { Skeleton } from "@/components/ui/skeleton";
import { AnnouncementCard } from "@/features/announcements/components/announcement-card";
import { useAnnouncements } from "@/features/announcements/hooks/use-announcements";
import { useBookmarks } from "@/features/bookmarks/hooks/use-bookmarks";
import { useAnnouncementsLastSeen } from "@/features/announcements/lib/use-last-seen";
import { ROUTES } from "@/constants/routes";

type Tab = "all" | "unread" | "important" | "bookmarked";

export function AnnouncementsFeedView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") ?? undefined;

  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");

  const { data: announcements, isLoading, isError, refetch } = useAnnouncements({ courseId });
  const { data: bookmarks } = useBookmarks("announcement");
  const lastSeen = useAnnouncementsLastSeen();

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks?.map((b) => b.bookmarkable_id) ?? []),
    [bookmarks],
  );

  const filtered = useMemo(() => {
    let list = announcements ?? [];

    if (tab === "unread" && lastSeen) {
      list = list.filter((a) => new Date(a.published_at ?? a.created_at) > lastSeen);
    } else if (tab === "important") {
      list = list.filter((a) => a.priority === "important");
    } else if (tab === "bookmarked") {
      list = list.filter((a) => bookmarkedIds.has(a.id));
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q));
    }

    return list;
  }, [announcements, tab, lastSeen, bookmarkedIds, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-bold text-foreground">Announcements</h1>
      </div>

      {courseId && (
        <div className="flex w-fit items-center gap-2 rounded-pill bg-muted px-3 py-1.5 text-caption text-muted-foreground">
          Filtered by course
          <button
            type="button"
            onClick={() => router.push(ROUTES.announcements)}
            aria-label="Clear course filter"
            className="text-foreground hover:text-primary"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <SearchInput
        placeholder="Search announcements..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search announcements"
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="flex flex-col gap-3">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}

          {isError && <LoadError title="Couldn't load announcements" onRetry={() => refetch()} />}

          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState
              icon={Megaphone}
              title="No announcements here"
              description={
                tab === "bookmarked"
                  ? "Bookmark announcements to find them here later."
                  : tab === "unread"
                    ? "You're all caught up."
                    : "Nothing to show yet."
              }
            />
          )}

          {filtered.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
