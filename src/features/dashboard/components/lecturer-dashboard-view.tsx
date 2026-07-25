"use client";

import { BarChart3, BookOpen, Megaphone, Users } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useMyCourses } from "@/features/courses/hooks/use-courses";
import { useMyAnnouncements } from "@/features/announcements/hooks/use-announcements";
import { useAllMyStudents } from "@/features/students/hooks/use-students";
import { timeBasedGreeting } from "@/features/dashboard/lib/greeting";
import { ROUTES } from "@/constants/routes";
import { StatCard } from "./stat-card";
import { AnnouncementSummaryCard } from "./announcement-summary-card";
import { EngagementOverviewCard } from "./engagement-overview-card";
import { UpcomingLecturesCard } from "./upcoming-lectures-card";
import { RecentAnnouncementsCard } from "./recent-announcements-card";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Formatted manually, not via Intl — see the student dashboard's overview
// card for why (SSR/CSR locale-formatting mismatch).
function formatToday(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

const RECENT_ANNOUNCEMENTS_LIMIT = 5;

export function LecturerDashboardView() {
  const { profile } = useAuth();
  const { data: courses } = useMyCourses();
  const { data: announcements } = useMyAnnouncements();
  const { data: students } = useAllMyStudents();
  const studentCount = students.length;

  const lastName = profile?.full_name?.split(" ").at(-1) ?? "there";
  const published = announcements?.filter((a) => a.status === "published").length ?? 0;
  const drafts = announcements?.filter((a) => a.status === "draft").length ?? 0;
  const recent = announcements?.slice(0, RECENT_ANNOUNCEMENTS_LIMIT) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-h2 font-bold text-foreground">
            {timeBasedGreeting()}, Dr. {lastName} 👋
          </h1>
          <p className="text-body text-muted-foreground">Here&apos;s what&apos;s happening in your classes today.</p>
        </div>
        <span className="shrink-0 rounded-pill border border-border px-3 py-1.5 text-caption text-muted-foreground">
          {formatToday(new Date())}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Courses" value={courses?.length ?? 0} accent="primary" href={ROUTES.courses} />
        <StatCard
          icon={Megaphone}
          label="Announcements"
          value={announcements?.length ?? 0}
          accent="success"
          href={ROUTES.announcements}
        />
        <StatCard icon={Users} label="Total Students" value={studentCount} accent="secondary" href={ROUTES.students} />
        {/* Avg. Engagement isn't backed by an aggregate query yet — see README. */}
        <StatCard icon={BarChart3} label="Avg. Engagement" value="—" accent="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AnnouncementSummaryCard summary={{ published, scheduled: 0, drafts, totalViews: 0 }} />
        <EngagementOverviewCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <UpcomingLecturesCard />
        <RecentAnnouncementsCard announcements={recent} />
      </div>
    </div>
  );
}
