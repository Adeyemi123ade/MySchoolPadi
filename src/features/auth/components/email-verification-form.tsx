"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ShieldCheck, HelpCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { OtpInput } from "./otp-input";
import { RegistrationSuccess } from "./registration-success";
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/services";
import { ROUTES } from "@/constants/routes";

const CODE_TTL_SECONDS = 165; // 02:45, matches the mockup
const RESEND_COOLDOWN_SECONDS = 23;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function EmailVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [expiresIn, setExpiresIn] = useState(CODE_TTL_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setExpiresIn((s) => Math.max(0, s - 1));
      setResendCooldown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleVerify() {
    if (code.length !== 6) return;
    setIsVerifying(true);
    try {
      const supabase = createClient();
      const { error } = await authService.verifyEmailOtp(supabase, email, code);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Email verified!");
      setIsVerified(true);
    } finally {
      setIsVerifying(false);
    }
  }

  function handleProceedToDashboard() {
    router.push(ROUTES.dashboard);
    router.refresh();
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    const supabase = createClient();
    const { error } = await authService.resendVerification(supabase, email);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Verification code resent.");
    setExpiresIn(CODE_TTL_SECONDS);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  }

  if (isVerified) {
    return <RegistrationSuccess onProceed={handleProceedToDashboard} />;
  }

  return (
    <div className="grid w-full max-w-4xl gap-8 rounded-lg border border-border bg-card p-8 shadow-lg lg:grid-cols-[1fr_1.2fr_1fr]">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-body font-semibold text-foreground">Why Verify?</h3>
          <ul className="mt-3 flex flex-col gap-2 text-body text-muted-foreground">
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-primary" /> Secure your account
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-primary" /> Prevent unauthorized access
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-primary" /> Receive important updates
            </li>
          </ul>
        </div>

        <div className="rounded-md border border-border p-4">
          <h3 className="text-body font-semibold text-foreground">Didn&apos;t receive code?</h3>
          <p className="mt-1 text-caption text-muted-foreground">
            Check your spam folder or request a new code.
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="mt-2 text-caption font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            Resend Code {resendCooldown > 0 ? `(${resendCooldown}s)` : ""}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-pill bg-primary/10 text-primary">
          <Mail className="size-8" />
        </span>
        <div>
          <h1 className="text-h3 font-bold text-foreground">Verify Your Email</h1>
          <p className="mt-1 text-body text-muted-foreground">
            We&apos;ve sent a 6-digit code to <span className="font-medium text-foreground">{email || "your email"}</span>
          </p>
        </div>

        <OtpInput value={code} onChange={setCode} disabled={isVerifying} />

        <p className="text-caption text-muted-foreground">
          Code expires in <span className="font-medium text-foreground">{formatTime(expiresIn)}</span>
        </p>

        <Button size="lg" className="w-full" onClick={handleVerify} disabled={code.length !== 6 || isVerifying}>
          {isVerifying ? "Verifying..." : "Verify Email"}
        </Button>

        <a href={ROUTES.register} className="text-body font-medium text-primary hover:underline">
          Change Email Address
        </a>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-md border border-border p-4">
          <h3 className="text-body font-semibold text-foreground">Security Note</h3>
          <p className="mt-1 text-caption text-muted-foreground">
            If you didn&apos;t request this code, please ignore this email or contact support immediately.
          </p>
        </div>

        <div className="rounded-md border border-border p-4">
          <div className="flex items-center gap-2 text-body font-semibold text-foreground">
            <HelpCircle className="size-4 text-primary" />
            Need Help?
          </div>
          <p className="mt-1 text-caption text-muted-foreground">
            If you&apos;re still having trouble, contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
