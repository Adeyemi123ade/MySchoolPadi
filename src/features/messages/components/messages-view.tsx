"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { LoadError } from "@/components/shared/load-error";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageItem } from "@/features/messages/components/message-item";
import { CreateMessageDialog } from "@/features/messages/components/create-message-dialog";
import { useMessages } from "@/features/messages/hooks/use-messages";
import { useMyCourses } from "@/features/courses/hooks/use-courses";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import { useAuth } from "@/hooks/use-auth";

export function MessagesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAuth();
  const isLecturer = profile?.role === "lecturer";

  const { data: myCourses, isLoading: loadingMyCourses } = useMyCourses();
  const { data: enrollments, isLoading: loadingEnrollments } = useEnrollments();

  const courses = isLecturer ? (myCourses ?? []) : (enrollments ?? []).map((e) => e.course);
  const loadingCourses = isLecturer ? loadingMyCourses : loadingEnrollments;

  const [courseId, setCourseId] = useState<string | undefined>(searchParams.get("courseId") ?? undefined);
  const { data: messages, isLoading, isError, refetch } = useMessages({ courseId });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-h2 font-bold text-foreground">Messages</h1>
        {isLecturer && <CreateMessageDialog />}
      </div>

      {loadingCourses ? (
        <Skeleton className="h-10 w-64" />
      ) : courses.length > 0 ? (
        <select
          value={courseId ?? ""}
          onChange={(e) => {
            const value = e.target.value || undefined;
            setCourseId(value);
            router.replace(value ? `?courseId=${value}` : "?");
          }}
          className="h-11 w-fit rounded-sm border border-input bg-background px-4 text-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          aria-label="Filter by course"
        >
          <option value="">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.title}
            </option>
          ))}
        </select>
      ) : null}

      <div className="flex flex-col gap-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}

        {isError && <LoadError title="Couldn't load messages" onRetry={() => refetch()} />}

        {!isLoading && !isError && (messages ?? []).length === 0 && (
          <EmptyState
            icon={MessageSquare}
            title="No messages yet"
            description={
              isLecturer
                ? "Send your first message to a course to get started."
                : "Messages from your lecturers will show up here."
            }
          />
        )}

        {(messages ?? []).map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
