import { LecturerRegistrationForm } from "@/features/auth/components/lecturer-registration-form";
import { LecturerSidePanel } from "@/features/auth/components/lecturer-side-panel";

export default function LecturerRegisterPage() {
  return (
    <div className="grid w-full max-w-4xl overflow-hidden rounded-lg border border-border bg-card shadow-lg md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <LecturerRegistrationForm />
      </div>
      <div className="hidden bg-muted/40 md:block">
        <LecturerSidePanel />
      </div>
    </div>
  );
}
