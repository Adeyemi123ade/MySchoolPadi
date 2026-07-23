"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useAllMyStudents, useCourseStudents } from "@/features/students/hooks/use-students";

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function StudentRow({ name, avatarUrl, badge }: { name: string | null; avatarUrl: string | null; badge?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border p-3">
      <Avatar>
        <AvatarImage src={avatarUrl ?? undefined} alt={name ?? "Student"} />
        <AvatarFallback>{initials(name)}</AvatarFallback>
      </Avatar>
      <p className="flex-1 text-body font-medium text-foreground">{name ?? "Unnamed student"}</p>
      {badge && <Badge variant="outline">{badge}</Badge>}
    </div>
  );
}

function AllStudentsList() {
  const { data: students, isLoading, isError } = useAllMyStudents();

  if (isLoading) return <div className="flex flex-col gap-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>;
  if (isError) return <p className="text-body text-muted-foreground">Couldn&apos;t load your students right now.</p>;
  if (students.length === 0) return <p className="text-body text-muted-foreground">No students enrolled yet.</p>;

  return (
    <div className="flex flex-col gap-2">
      {students.map((student) => (
        <StudentRow
          key={student.id}
          name={student.full_name}
          avatarUrl={student.avatar_url}
          badge={`${student.courseCount} course${student.courseCount === 1 ? "" : "s"}`}
        />
      ))}
    </div>
  );
}

function CourseStudentsList({ courseId }: { courseId: string }) {
  const { data: enrollments, isLoading, isError } = useCourseStudents(courseId);

  if (isLoading) return <div className="flex flex-col gap-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>;
  if (isError) return <p className="text-body text-muted-foreground">Couldn&apos;t load students for this course.</p>;
  if (enrollments?.length === 0) return <p className="text-body text-muted-foreground">No students enrolled in this course yet.</p>;

  return (
    <div className="flex flex-col gap-2">
      {enrollments?.map((enrollment) => (
        <StudentRow key={enrollment.id} name={enrollment.student?.full_name ?? null} avatarUrl={enrollment.student?.avatar_url ?? null} />
      ))}
    </div>
  );
}

function StudentsPageContent() {
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  if (profile && profile.role !== "lecturer") {
    return <p className="text-body text-muted-foreground">This page is only available to lecturers.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-foreground">Students</h1>
        <p className="text-body text-muted-foreground">
          {courseId ? "Students enrolled in this course." : "Every student enrolled across your courses."}
        </p>
      </div>

      {courseId ? <CourseStudentsList courseId={courseId} /> : <AllStudentsList />}
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <StudentsPageContent />
    </Suspense>
  );
}
