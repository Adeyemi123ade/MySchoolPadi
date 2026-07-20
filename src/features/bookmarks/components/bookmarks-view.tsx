"use client";

import { useMemo, useState } from "react";
import { Bookmark as BookmarkIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { AnnouncementCard } from "@/features/announcements/components/announcement-card";
import { CourseCard } from "@/features/courses/components/course-card";
import { useAnnouncements } from "@/features/announcements/hooks/use-announcements";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { useBookmarks } from "@/features/bookmarks/hooks/use-bookmarks";
import { useAuth } from "@/hooks/use-auth";

type Tab = "all" | "announcement" | "course";

export function BookmarksView() {
  const [tab, setTab] = useState<Tab>("all");
  const { profile } = useAuth();

  const { data: announcementBookmarks, isLoading: loadingAnnouncementBookmarks } = useBookmarks("announcement");
  const { data: courseBookmarks, isLoading: loadingCourseBookmarks } = useBookmarks("course");
  const { data: announcements } = useAnnouncements();
  const { data: courses } = useCourses({ schoolId: profile?.school_id ?? undefined });

  const bookmarkedAnnouncementIds = useMemo(
    () => new Set(announcementBookmarks?.map((b) => b.bookmarkable_id) ?? []),
    [announcementBookmarks],
  );
  const bookmarkedCourseIds = useMemo(
    () => new Set(courseBookmarks?.map((b) => b.bookmarkable_id) ?? []),
    [courseBookmarks],
  );

  const bookmarkedAnnouncements = useMemo(
    () => (announcements ?? []).filter((a) => bookmarkedAnnouncementIds.has(a.id)),
    [announcements, bookmarkedAnnouncementIds],
  );
  const bookmarkedCourses = useMemo(
    () => (courses ?? []).filter((c) => bookmarkedCourseIds.has(c.id)),
    [courses, bookmarkedCourseIds],
  );

  const isLoading = loadingAnnouncementBookmarks || loadingCourseBookmarks;
  const isEmpty = bookmarkedAnnouncements.length === 0 && bookmarkedCourses.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-h2 font-bold text-foreground">Bookmarks</h1>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="announcement">Announcements</TabsTrigger>
          <TabsTrigger value="course">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="flex flex-col gap-3">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}

          {!isLoading && tab === "all" && isEmpty && (
            <EmptyState
              icon={BookmarkIcon}
              title="Your important updates saved"
              description="Bookmarked items will appear here for easy access anytime."
            />
          )}

          {!isLoading && tab === "announcement" && bookmarkedAnnouncements.length === 0 && (
            <EmptyState icon={BookmarkIcon} title="No bookmarked announcements" />
          )}

          {!isLoading && tab === "course" && bookmarkedCourses.length === 0 && (
            <EmptyState icon={BookmarkIcon} title="No bookmarked courses" />
          )}

          {(tab === "all" || tab === "announcement") &&
            bookmarkedAnnouncements.map((a) => <AnnouncementCard key={a.id} announcement={a} />)}

          {(tab === "all" || tab === "course") && bookmarkedCourses.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {bookmarkedCourses.map((c) => (
                <CourseCard key={c.id} variant="student" course={c} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
