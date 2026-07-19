import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-full max-w-md items-center justify-center rounded-lg border border-border bg-card p-8 shadow-lg">
      <ForgotPasswordForm />
    </div>
  );
}
