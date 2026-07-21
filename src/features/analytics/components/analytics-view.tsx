"use client";

import { BarChart3, BookOpen, Megaphone, PieChart, Users } from "lucide-react";

import { StatCard } from "@/features/dashboard/components/stat-card";
import { useMyCourses } from "@/features/courses/hooks/use-courses";
import { useMyAnnouncements } from "@/features/announcements/hooks/use-announcements";

function EmptyChartCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col rounded-lg border border-border p-5">
      <h3 className="text-body font-semibold text-foreground">{title}</h3>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
        <PieChart className="size-8 text-muted-foreground" strokeWidth={1.5} />
        <p className="text-body text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function AnalyticsView() {
  const { data: courses } = useMyCourses();
  const { data: announcements } = useMyAnnouncements();

  const published = announcements?.filter((a) => a.status === "published").length ?? 0;
  // Sum of each course's enrolled_count — see the dashboard's Total Students for the same caveat.
  const totalStudents = courses?.reduce((sum, c) => sum + c.enrolled_count, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h2 font-bold text-foreground">Analytics</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Courses" value={courses?.length ?? 0} accent="primary" />
        <StatCard icon={Megaphone} label="Published Announcements" value={published} accent="success" />
        <StatCard icon={Users} label="Total Students" value={totalStudents} accent="secondary" />
        {/* Views/read-rate metrics aren't backed by any view or engagement tracking yet — see README. */}
        <StatCard icon={BarChart3} label="Avg. Read Rate" value="—" accent="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EmptyChartCard
          title="Views Over Time"
          description="No view tracking yet — this chart will populate once announcement views are recorded."
        />
        <EmptyChartCard
          title="Announcement Performance"
          description="No read-receipt tracking yet — nothing to break down by read/unread."
        />
      </div>

      <EmptyChartCard
        title="Top Courses by Engagement"
        description="No engagement metric exists yet beyond enrollment counts — see each course under Course Management for real enrolled-student numbers."
      />
    </div>
  );
}
