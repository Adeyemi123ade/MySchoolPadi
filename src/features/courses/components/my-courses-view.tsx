"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/features/courses/components/course-card";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import { ROUTES } from "@/constants/routes";

type Tab = "active" | "completed";

export function MyCoursesView() {
  const [tab, setTab] = useState<Tab>("active");
  const { data: enrollments, isLoading, isError } = useEnrollments();

  const filtered = useMemo(() => (enrollments ?? []).filter((e) => e.status === tab), [enrollments, tab]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-bold text-foreground">My Courses</h1>
        <Button size="sm" asChild>
          <Link href={ROUTES.joinCourse}>
            <Plus /> Join Course
          </Link>
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="active">Current Semester</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="grid gap-3 sm:grid-cols-2">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}

          {isError && (
            <p className="col-span-full rounded-md border border-border p-4 text-body text-muted-foreground">
              Couldn&apos;t load your courses right now.
            </p>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={BookOpen}
                title={tab === "active" ? "No courses yet" : "No completed courses"}
                description={tab === "active" ? "Join a course with a course code to get started." : "Courses you finish will show up here."}
                action={
                  tab === "active" && (
                    <Button size="sm" asChild>
                      <Link href={ROUTES.joinCourse}>Join Course</Link>
                    </Button>
                  )
                }
              />
            </div>
          )}

          {filtered.map((enrollment) => (
            <CourseCard key={enrollment.id} variant="student" course={enrollment.course} status={enrollment.status} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
