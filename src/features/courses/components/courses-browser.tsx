"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { useMyEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import { useEnrollInCourse, useDropEnrollment } from "@/features/enrollments/hooks/use-enrollment-mutations";

export function CoursesBrowser() {
  const { profile } = useAuth();
  const { data: courses, isLoading, isError } = useCourses({ schoolId: profile?.school_id ?? undefined });
  const { data: enrollments } = useMyEnrollments();
  const enrollInCourse = useEnrollInCourse();
  const dropEnrollment = useDropEnrollment();

  const [pendingDropCourseId, setPendingDropCourseId] = useState<string | null>(null);

  const enrollmentByCourseId = new Map((enrollments ?? []).map((e) => [e.course_id, e]));

  async function handleEnroll(courseId: string) {
    try {
      await enrollInCourse.mutateAsync(courseId);
      toast.success("Enrolled.");
    } catch {
      toast.error("Couldn't enroll. Try again.");
    }
  }

  async function handleDrop() {
    const enrollment = pendingDropCourseId ? enrollmentByCourseId.get(pendingDropCourseId) : undefined;
    if (!enrollment) return;
    try {
      await dropEnrollment.mutateAsync(enrollment.id);
      toast.success("Dropped.");
    } catch {
      toast.error("Couldn't drop the course. Try again.");
    } finally {
      setPendingDropCourseId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
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

        {courses?.map((course) => {
          const isEnrolled = enrollmentByCourseId.has(course.id);
          return (
            <div key={course.id} className="flex flex-col gap-2 rounded-md border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-caption font-medium text-primary">{course.code}</p>
                {isEnrolled && (
                  <Badge variant="success" className="px-1.5 py-0 text-[10px] leading-4">
                    Enrolled
                  </Badge>
                )}
              </div>
              <h3 className="text-body font-semibold text-foreground">{course.title}</h3>
              {course.description && (
                <p className="line-clamp-2 text-body text-muted-foreground">{course.description}</p>
              )}
              {course.lecturer?.full_name && (
                <p className="text-caption text-muted-foreground">Taught by {course.lecturer.full_name}</p>
              )}
              <div className="mt-auto pt-2">
                {isEnrolled ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setPendingDropCourseId(course.id)}
                  >
                    Drop
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollInCourse.isPending}
                  >
                    Enroll
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={pendingDropCourseId !== null}
        onOpenChange={(open) => !open && setPendingDropCourseId(null)}
        title="Drop this course?"
        description="You'll stop seeing its announcements and lose access unless you enroll again."
        confirmLabel="Drop"
        isLoading={dropEnrollment.isPending}
        onConfirm={handleDrop}
      />
    </div>
  );
}
