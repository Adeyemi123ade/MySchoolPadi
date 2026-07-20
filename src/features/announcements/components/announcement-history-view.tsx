"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadError } from "@/components/shared/load-error";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AnnouncementHistoryItem } from "@/features/announcements/components/announcement-history-item";
import { useMyAnnouncements } from "@/features/announcements/hooks/use-announcements";
import { ROUTES } from "@/constants/routes";

// Only "draft" and "published" exist in the schema (announcement_status
// enum) — no "Scheduled" or "Archived" state is modeled yet, so those tabs
// from the mockup are intentionally left out rather than shown as
// permanently-empty fake tabs.
type Tab = "all" | "published" | "drafts";

export function AnnouncementHistoryView() {
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");

  const { data: announcements, isLoading, isError, refetch } = useMyAnnouncements();

  const filtered = useMemo(() => {
    let list = announcements ?? [];

    if (tab === "published") list = list.filter((a) => a.status === "published");
    else if (tab === "drafts") list = list.filter((a) => a.status === "draft");

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q));
    }

    return list;
  }, [announcements, tab, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-bold text-foreground">Announcements</h1>
        <Button asChild>
          <Link href={ROUTES.newAnnouncement}>
            <Plus /> New Announcement
          </Link>
        </Button>
      </div>

      <SearchInput
        placeholder="Search your announcements..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search announcements"
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="flex flex-col gap-3">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}

          {isError && <LoadError title="Couldn't load your announcements" onRetry={() => refetch()} />}

          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState
              icon={Megaphone}
              title="No announcements here"
              description={tab === "drafts" ? "Drafts you save will show up here." : "Publish your first announcement to get started."}
              action={
                <Button size="sm" asChild>
                  <Link href={ROUTES.newAnnouncement}>New Announcement</Link>
                </Button>
              }
            />
          )}

          {filtered.map((announcement) => (
            <AnnouncementHistoryItem key={announcement.id} announcement={announcement} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
