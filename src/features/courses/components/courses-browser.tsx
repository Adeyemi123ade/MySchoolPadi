"use client";

import { useAuth } from "@/hooks/use-auth";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { Skeleton } from "@/components/ui/skeleton";

export function CoursesBrowser() {
  const { profile } = useAuth();
  const { data: courses, isLoading, isError } = useCourses({ schoolId: profile?.school_id ?? undefined });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-foreground">Courses</h1>
        <p className="text-body text-muted-foreground">Courses available at your school.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}

        {isError && (
          <p className="rounded-md border border-border p-4 text-body text-muted-foreground sm:col-span-2">
            Couldn&apos;t load courses right now.
          </p>
        )}

        {!isLoading && !isError && courses?.length === 0 && (
          <p className="rounded-md border border-border p-4 text-body text-muted-foreground sm:col-span-2">
            No courses listed yet.
          </p>
        )}

        {courses?.map((course) => (
          <div key={course.id} className="flex flex-col gap-2 rounded-md border border-border p-4">
            <p className="text-caption font-medium text-primary">{course.code}</p>
            <h3 className="text-body font-semibold text-foreground">{course.title}</h3>
            {course.description && <p className="line-clamp-2 text-body text-muted-foreground">{course.description}</p>}
            {course.lecturer?.full_name && (
              <p className="text-caption text-muted-foreground">Taught by {course.lecturer.full_name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
