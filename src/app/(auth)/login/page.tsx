import { Suspense } from "react";
import { AuthBrandingPanel } from "@/features/auth/components/auth-branding-panel";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="grid w-full max-w-4xl overflow-hidden rounded-lg border border-border bg-card shadow-lg md:grid-cols-2">
      <div className="hidden bg-muted/40 md:block">
        <AuthBrandingPanel />
      </div>
      <div className="flex items-center justify-center p-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
