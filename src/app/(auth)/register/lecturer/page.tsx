import { LecturerRegistrationForm } from "@/features/auth/components/lecturer-registration-form";
import { LecturerSidePanel } from "@/features/auth/components/lecturer-side-panel";

export default function LecturerRegisterPage() {
  return (
    <div className="grid w-full max-w-4xl min-h-[calc(100vh-2rem)] overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:min-h-0 md:grid-cols-2">
      <div className="flex flex-col p-6 sm:items-center sm:justify-center sm:p-8">
        <LecturerRegistrationForm />
      </div>
      <div className="hidden bg-muted/40 md:block">
        <LecturerSidePanel />
      </div>
    </div>
  );
}
