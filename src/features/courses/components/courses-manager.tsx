"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CourseFormDialog } from "./course-form-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useMyCourses } from "@/features/courses/hooks/use-courses";
import { useDeleteCourse } from "@/features/courses/hooks/use-course-mutations";
import { ROUTES } from "@/constants/routes";

export function CoursesManager() {
  const { profile } = useAuth();
  const { data: courses, isLoading, isError } = useMyCourses();
  const deleteCourse = useDeleteCourse();

  const [formOpen, setFormOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  async function handleDelete() {
    if (!pendingDeleteId) return;
    try {
      await deleteCourse.mutateAsync(pendingDeleteId);
      toast.success("Course deleted.");
    } catch {
      toast.error("Couldn't delete. Try again.");
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-body text-muted-foreground">Courses you teach.</p>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="size-4" /> New Course
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}

        {isError && (
          <p className="rounded-md border border-border p-4 text-body text-muted-foreground sm:col-span-2">
            Couldn&apos;t load your courses right now.
          </p>
        )}

        {!isLoading && !isError && courses?.length === 0 && (
          <p className="rounded-md border border-border p-4 text-body text-muted-foreground sm:col-span-2">
            No courses yet — create your first one.
          </p>
        )}

        {courses?.map((course) => (
          <div key={course.id} className="flex flex-col gap-2 rounded-md border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-caption font-medium text-primary">{course.code}</p>
                <h3 className="text-body font-semibold text-foreground">{course.title}</h3>
              </div>
            </div>
            {course.description && <p className="line-clamp-2 text-body text-muted-foreground">{course.description}</p>}
            <div className="mt-auto flex gap-2 pt-2">
              <Button asChild type="button" variant="secondary" size="sm">
                <Link href={`${ROUTES.students}?courseId=${course.id}`}>View Students</Link>
              </Button>
              <Button type="button" variant="danger" size="sm" onClick={() => setPendingDeleteId(course.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CourseFormDialog open={formOpen} onOpenChange={setFormOpen} schoolId={profile?.school_id} />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Are you sure you want to delete this?"
        description="This course and its enrollments and announcements will be permanently removed."
        isLoading={deleteCourse.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
