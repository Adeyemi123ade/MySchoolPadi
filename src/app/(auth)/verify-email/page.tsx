import { Suspense } from "react";
import { EmailVerificationForm } from "@/features/auth/components/email-verification-form";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <EmailVerificationForm />
    </Suspense>
  );
}
