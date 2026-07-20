import Link from "next/link";
import { BookOpen, Bookmark, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { courseAccent } from "@/features/courses/lib/course-accent";
import { useBookmarks, useToggleBookmark } from "@/features/bookmarks/hooks/use-bookmarks";
import { useAuth } from "@/hooks/use-auth";
import type { Course, CourseWithLecturer, EnrollmentStatus } from "@/types";

const ACCENT_CLASSES = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  secondary: "bg-secondary/10 text-secondary",
  destructive: "bg-destructive/10 text-destructive",
} as const;

const STATUS_BADGE: Record<EnrollmentStatus, { label: string; variant: "success" | "secondary" | "outline" }> = {
  active: { label: "Active", variant: "success" },
  completed: { label: "Completed", variant: "secondary" },
  dropped: { label: "Dropped", variant: "outline" },
};

type CourseCardProps =
  | { variant: "student"; course: Course | CourseWithLecturer; status?: EnrollmentStatus }
  | { variant: "lecturer"; course: Course & { enrolled_count: number } };

export function CourseCard(props: CourseCardProps) {
  const { course } = props;
  const { profile } = useAuth();
  const accent = courseAccent(course.code);
  const lecturerName = "lecturer" in course ? course.lecturer?.full_name : undefined;

  const { data: bookmarks } = useBookmarks("course");
  const toggleBookmark = useToggleBookmark();
  const isBookmarked = bookmarks?.some((b) => b.bookmarkable_id === course.id) ?? false;

  // No standalone course-detail screen exists yet — link to the nearest real,
  // already-built view instead of a route that would 404.
  const href =
    props.variant === "student"
      ? `${ROUTES.announcements}?courseId=${course.id}`
      : `${ROUTES.students}?courseId=${course.id}`;

  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-md", ACCENT_CLASSES[accent])}>
          <BookOpen className="size-5" />
        </span>
        <div className="flex items-center gap-2">
          {props.variant === "student" && props.status && (
            <Badge variant={STATUS_BADGE[props.status].variant}>{STATUS_BADGE[props.status].label}</Badge>
          )}
          {profile && (
            <button
              type="button"
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark course"}
              aria-pressed={isBookmarked}
              disabled={toggleBookmark.isPending}
              onClick={(e) => {
                e.preventDefault();
                toggleBookmark.mutate({ type: "course", id: course.id, bookmarked: isBookmarked });
              }}
              className="text-muted-foreground hover:text-primary disabled:opacity-50"
            >
              <Bookmark className={cn("size-4", isBookmarked && "fill-primary text-primary")} />
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-body font-semibold text-foreground">{course.code}</p>
        <p className="text-caption text-muted-foreground">{course.title}</p>
      </div>

      {props.variant === "student" ? (
        lecturerName && <p className="text-caption text-muted-foreground">{lecturerName}</p>
      ) : (
        <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
          <Users className="size-3.5" />
          {props.course.enrolled_count} {props.course.enrolled_count === 1 ? "student" : "students"}
        </p>
      )}
    </Link>
  );
}
