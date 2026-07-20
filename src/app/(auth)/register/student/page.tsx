import { StudentRegistrationForm } from "@/features/auth/components/student-registration-form";
import { StudentSidePanel } from "@/features/auth/components/student-side-panel";

export default function StudentRegisterPage() {
  return (
    <div className="grid w-full max-w-4xl overflow-hidden rounded-lg border border-border bg-card shadow-lg md:grid-cols-2">
      <div className="hidden bg-muted/40 md:block">
        <StudentSidePanel />
      </div>
      <div className="flex items-center justify-center p-8">
        <StudentRegistrationForm />
      </div>
    </div>
  );
}
