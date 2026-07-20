"use client";

import Link from "next/link";
import { Megaphone } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAnnouncements } from "@/features/announcements/hooks/use-announcements";
import { AnnouncementCard } from "@/features/announcements/components/announcement-card";
import { TodaysOverviewCard } from "@/features/dashboard/components/todays-overview-card";
import { timeBasedGreeting } from "@/features/dashboard/lib/greeting";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadError } from "@/components/shared/load-error";
import { ROUTES } from "@/constants/routes";

const RECENT_ANNOUNCEMENTS_LIMIT = 3;

export function StudentDashboardView() {
  const { profile } = useAuth();
  const { data: announcements, isLoading, isError, refetch } = useAnnouncements();

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const recent = announcements?.slice(0, RECENT_ANNOUNCEMENTS_LIMIT) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-foreground">
          {timeBasedGreeting()}, {firstName} 👋
        </h1>
        <p className="text-body text-muted-foreground">Here&apos;s what&apos;s happening in your school.</p>
      </div>

      <TodaysOverviewCard
        stats={[
          { label: "Announcements", value: announcements?.length ?? 0 },
          // Lectures/Assignments/Events aren't modeled in the schema yet —
          // shown as 0 rather than fabricating numbers.
          { label: "Lectures Today", value: 0 },
          { label: "Assignments", value: 0 },
          { label: "Events", value: 0 },
        ]}
      />

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-h4 font-semibold text-foreground">Recent Announcements</h2>
          <Link href={ROUTES.announcements} className="text-body font-medium text-primary hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {isLoading &&
            Array.from({ length: RECENT_ANNOUNCEMENTS_LIMIT }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}

          {isError && <LoadError title="Couldn't load your announcements" onRetry={() => refetch()} />}

          {!isLoading && !isError && recent.length === 0 && (
            <EmptyState icon={Megaphone} title="No announcements yet" description="New announcements from your courses will show up here." />
          )}

          {recent.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </div>
    </div>
  );
}
