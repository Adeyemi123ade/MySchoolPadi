"use client";

import { useAuth } from "@/hooks/use-auth";
import { BackButton } from "@/components/layout/back-button";
import { AnnouncementsManager } from "@/features/announcements/components/announcements-manager";
import { AnnouncementsFeed } from "@/features/announcements/components/announcements-feed";
import { ROUTES } from "@/constants/routes";

export default function AnnouncementsPage() {
  const { profile } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <BackButton href={ROUTES.dashboard} label="Back to Dashboard" />
      {profile?.role === "lecturer" ? <AnnouncementsManager /> : <AnnouncementsFeed />}
    </div>
  );
}
