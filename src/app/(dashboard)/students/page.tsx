import { Suspense } from "react";
import { StudentListView } from "@/features/students/components/student-list-view";

export default function StudentsPage() {
  return (
    <Suspense>
      <StudentListView />
    </Suspense>
  );
}
