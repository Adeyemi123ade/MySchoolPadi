import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex w-full max-w-md items-center justify-center rounded-lg border border-border bg-card p-8 shadow-lg">
      <ResetPasswordForm />
    </div>
  );
}
