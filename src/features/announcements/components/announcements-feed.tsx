"use client";

import { useAnnouncements } from "@/features/announcements/hooks/use-announcements";
import { AnnouncementCard } from "@/features/announcements/components/announcement-card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnnouncementsFeed() {
  const { data: announcements, isLoading, isError } = useAnnouncements();

  return (
    <div className="flex flex-col gap-6">
      <p className="text-body text-muted-foreground">Updates from your school and courses.</p>

      <div className="flex flex-col gap-3">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}

        {isError && (
          <p className="rounded-md border border-border p-4 text-body text-muted-foreground">
            Couldn&apos;t load announcements right now.
          </p>
        )}

        {!isLoading && !isError && announcements?.length === 0 && (
          <p className="rounded-md border border-border p-4 text-body text-muted-foreground">No announcements yet.</p>
        )}

        {announcements?.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>
    </div>
  );
}
