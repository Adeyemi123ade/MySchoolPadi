"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, History, Search as SearchIcon, XCircle } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/shared/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useCourseByCode, useCourses } from "@/features/courses/hooks/use-courses";
import { useEnrollInCourse, useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import { ROUTES } from "@/constants/routes";

const RECENT_SEARCHES_KEY = "myschoolpadi:recent-course-codes";
const RECENT_SEARCHES_LIMIT = 5;

function readRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(code: string) {
  const existing = readRecentSearches().filter((c) => c !== code);
  const updated = [code, ...existing].slice(0, RECENT_SEARCHES_LIMIT);
  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

const HOW_IT_WORKS = [
  "Get the course code from your lecturer",
  "Enter the code above and click Find Course",
  "Confirm and enroll",
  "Start accessing course materials",
];

export function JoinCourseView() {
  const router = useRouter();
  const { profile } = useAuth();
  const { data: enrollments } = useEnrollments();
  const enrolledCourseIds = useMemo(() => new Set((enrollments ?? []).map((e) => e.course_id)), [enrollments]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <h1 className="text-h2 font-bold text-foreground">Join Course</h1>

      <Tabs defaultValue="code">
        <TabsList className="w-full">
          <TabsTrigger value="code" className="flex-1">
            Join with Course Code
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex-1">
            Browse Courses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex flex-col gap-4">
          <JoinByCode
            schoolId={profile?.school_id ?? undefined}
            enrolledCourseIds={enrolledCourseIds}
            onEnrolled={() => router.push(ROUTES.courses)}
          />

          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 text-body font-semibold text-foreground">How it works</p>
            <ul className="flex flex-col gap-2">
              {HOW_IT_WORKS.map((step) => (
                <li key={step} className="flex items-start gap-2 text-caption text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="browse">
          <BrowseCourses
            schoolId={profile?.school_id ?? undefined}
            enrolledCourseIds={enrolledCourseIds}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function JoinByCode({
  schoolId,
  enrolledCourseIds,
  onEnrolled,
}: {
  schoolId?: string;
  enrolledCourseIds: Set<string>;
  onEnrolled: () => void;
}) {
  const [code, setCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState<string | undefined>();
  const [recent, setRecent] = useState<string[]>(() => readRecentSearches());

  const { data: course, isLoading, isFetched } = useCourseByCode(schoolId, submittedCode);
  const enroll = useEnrollInCourse();

  function handleFind() {
    const trimmed = code.trim();
    if (!trimmed) return;
    setSubmittedCode(trimmed);
    saveRecentSearch(trimmed);
    setRecent(readRecentSearches());
  }

  const alreadyEnrolled = course ? enrolledCourseIds.has(course.id) : false;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          placeholder="e.g. CSC 301"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFind()}
          aria-label="Course code"
        />
        <Button onClick={handleFind} disabled={!code.trim() || isLoading}>
          <SearchIcon /> Find Course
        </Button>
      </div>

      {isLoading && <Skeleton className="h-24 w-full" />}

      {isFetched && !isLoading && submittedCode && !course && (
        <div className="flex items-center gap-2 rounded-md border border-border p-4 text-body text-muted-foreground">
          <XCircle className="size-5 shrink-0 text-destructive" />
          No course found with code &ldquo;{submittedCode}&rdquo;.
        </div>
      )}

      {course && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-border p-4">
          <div>
            <p className="text-body font-semibold text-foreground">{course.code}</p>
            <p className="text-caption text-muted-foreground">{course.title}</p>
            {course.lecturer?.full_name && (
              <p className="text-caption text-muted-foreground">{course.lecturer.full_name}</p>
            )}
          </div>
          <Button
            size="sm"
            disabled={alreadyEnrolled || enroll.isPending}
            onClick={() => enroll.mutate(course.id, { onSuccess: onEnrolled })}
          >
            {alreadyEnrolled ? "Already enrolled" : enroll.isPending ? "Enrolling..." : "Enroll"}
          </Button>
        </div>
      )}

      {recent.length > 0 && (
        <div>
          <p className="mb-2 text-caption font-medium text-muted-foreground">Recent Searches</p>
          <div className="flex flex-wrap gap-2">
            {recent.map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => {
                  setCode(entry);
                  setSubmittedCode(entry);
                }}
                className="flex items-center gap-1.5 rounded-pill border border-border px-3 py-1.5 text-caption text-foreground hover:bg-muted"
              >
                <History className="size-3.5 text-muted-foreground" />
                {entry}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BrowseCourses({ schoolId, enrolledCourseIds }: { schoolId?: string; enrolledCourseIds: Set<string> }) {
  const [query, setQuery] = useState("");
  const { data: courses, isLoading } = useCourses({ schoolId, search: query || undefined });
  const enroll = useEnrollInCourse();

  return (
    <div className="flex flex-col gap-3">
      <SearchInput
        placeholder="Search courses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search courses"
      />

      {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}

      {!isLoading && courses?.length === 0 && (
        <p className="rounded-md border border-border p-4 text-center text-body text-muted-foreground">
          No courses found.
        </p>
      )}

      {courses?.map((course) => {
        const enrolled = enrolledCourseIds.has(course.id);
        return (
          <div key={course.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-4">
            <div>
              <p className="text-body font-semibold text-foreground">{course.code}</p>
              <p className="text-caption text-muted-foreground">{course.title}</p>
              {course.lecturer?.full_name && (
                <p className="text-caption text-muted-foreground">{course.lecturer.full_name}</p>
              )}
            </div>
            <Button size="sm" disabled={enrolled || enroll.isPending} onClick={() => enroll.mutate(course.id)}>
              {enrolled ? "Enrolled" : "Enroll"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
