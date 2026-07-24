import { StudentRegistrationForm } from "@/features/auth/components/student-registration-form";
import { StudentSidePanel } from "@/features/auth/components/student-side-panel";

export default function StudentRegisterPage() {
  return (
    <div className="grid w-full max-w-4xl min-h-[calc(100vh-2rem)] overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:min-h-0 md:grid-cols-2">
      <div className="hidden bg-muted/40 md:block">
        <StudentSidePanel />
      </div>
      <div className="flex flex-col p-6 sm:items-center sm:justify-center sm:p-8">
        <StudentRegistrationForm />
      </div>
    </div>
  );
}
