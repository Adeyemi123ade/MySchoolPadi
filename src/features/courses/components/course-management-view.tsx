"use client";

import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";

import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadError } from "@/components/shared/load-error";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseCard } from "@/features/courses/components/course-card";
import { CreateCourseDialog } from "@/features/courses/components/create-course-dialog";
import { useMyCourses } from "@/features/courses/hooks/use-courses";

export function CourseManagementView() {
  const [query, setQuery] = useState("");
  const { data: courses, isLoading, isError, refetch } = useMyCourses();

  const filtered = useMemo(() => {
    if (!query.trim()) return courses ?? [];
    const q = query.trim().toLowerCase();
    return (courses ?? []).filter((c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [courses, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-bold text-foreground">My Courses</h1>
        <CreateCourseDialog />
      </div>

      <SearchInput
        placeholder="Search your courses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search courses"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}

        {isError && (
          <div className="col-span-full">
            <LoadError title="Couldn't load your courses" onRetry={() => refetch()} />
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Add your first course to start publishing announcements to it."
            />
          </div>
        )}

        {filtered.map((course) => (
          <CourseCard key={course.id} variant="lecturer" course={course} />
        ))}
      </div>
    </div>
  );
}
