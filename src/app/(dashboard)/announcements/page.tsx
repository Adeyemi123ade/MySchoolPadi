"use client";

import { Suspense } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AnnouncementsFeedView } from "@/features/announcements/components/announcements-feed-view";
import { AnnouncementHistoryView } from "@/features/announcements/components/announcement-history-view";

export default function AnnouncementsPage() {
  const { profile } = useAuth();

  return (
    <Suspense>
      {profile?.role === "lecturer" ? <AnnouncementHistoryView /> : <AnnouncementsFeedView />}
    </Suspense>
  );
}
