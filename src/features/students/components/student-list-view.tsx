"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Download, Users } from "lucide-react";

import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadError } from "@/components/shared/load-error";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMyCourses } from "@/features/courses/hooks/use-courses";
import { useCourseRoster } from "@/features/enrollments/hooks/use-enrollments";
import { initials } from "@/lib/format";

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function StudentListView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: courses, isLoading: loadingCourses, isError: coursesError, refetch: refetchCourses } = useMyCourses();

  const courseIdParam = searchParams.get("courseId");
  const [courseId, setCourseId] = useState<string | undefined>(courseIdParam ?? undefined);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!courseId && courses && courses.length > 0) {
      setCourseId(courses[0].id);
    }
  }, [courses, courseId]);

  const { data: roster, isLoading: loadingRoster, isError: rosterError, refetch: refetchRoster } = useCourseRoster(courseId);
  const selectedCourse = courses?.find((c) => c.id === courseId);

  const filtered = useMemo(() => {
    if (!query.trim()) return roster ?? [];
    const q = query.trim().toLowerCase();
    return (roster ?? []).filter((e) => e.student?.full_name?.toLowerCase().includes(q));
  }, [roster, query]);

  function handleExport() {
    if (!filtered.length) return;
    const rows: string[][] = [
      ["#", "Student Name", "Matric Number"],
      ...filtered.map((e, i) => [String(i + 1), e.student?.full_name ?? "Unknown", e.student?.matric_number ?? ""]),
    ];
    downloadCsv(`${selectedCourse?.code ?? "course"}-students.csv`, rows);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-h2 font-bold text-foreground">Students</h1>
        <Button variant="secondary" size="sm" onClick={handleExport} disabled={filtered.length === 0}>
          <Download /> Export
        </Button>
      </div>

      {loadingCourses ? (
        <Skeleton className="h-10 w-64" />
      ) : coursesError ? (
        <LoadError title="Couldn't load your courses" onRetry={() => refetchCourses()} />
      ) : courses && courses.length > 0 ? (
        <select
          value={courseId ?? ""}
          onChange={(e) => {
            setCourseId(e.target.value);
            router.replace(`?courseId=${e.target.value}`);
          }}
          className="h-11 w-fit rounded-sm border border-input bg-background px-4 text-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          aria-label="Select course"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.title}
            </option>
          ))}
        </select>
      ) : (
        <EmptyState icon={Users} title="No courses yet" description="Add a course before viewing its roster." />
      )}

      {courseId && (
        <>
          <SearchInput
            placeholder="Search students..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search students"
          />

          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-caption font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-2 text-caption font-medium text-muted-foreground">Student</th>
                  <th className="px-4 py-2 text-caption font-medium text-muted-foreground">Matric Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingRoster &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3" colSpan={3}>
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))}

                {!loadingRoster && rosterError && (
                  <tr>
                    <td className="px-4 py-8" colSpan={3}>
                      <LoadError title="Couldn't load this course's students" onRetry={() => refetchRoster()} />
                    </td>
                  </tr>
                )}

                {!loadingRoster && !rosterError && filtered.length === 0 && (
                  <tr>
                    <td className="px-4 py-8" colSpan={3}>
                      <EmptyState icon={Users} title="No students enrolled yet" />
                    </td>
                  </tr>
                )}

                {filtered.map((enrollment, i) => (
                  <tr key={enrollment.id}>
                    <td className="px-4 py-3 text-caption text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={enrollment.student?.avatar_url ?? undefined} alt={enrollment.student?.full_name ?? ""} />
                          <AvatarFallback>{initials(enrollment.student?.full_name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-body text-foreground">{enrollment.student?.full_name ?? "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-caption text-muted-foreground">{enrollment.student?.matric_number ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
