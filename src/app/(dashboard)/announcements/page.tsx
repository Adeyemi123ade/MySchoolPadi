"use client";

import { useAuth } from "@/hooks/use-auth";
import { AnnouncementsManager } from "@/features/announcements/components/announcements-manager";
import { AnnouncementsFeed } from "@/features/announcements/components/announcements-feed";

export default function AnnouncementsPage() {
  const { profile } = useAuth();

  if (profile?.role === "lecturer") return <AnnouncementsManager />;
  return <AnnouncementsFeed />;
}
