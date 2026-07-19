"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { ROUTES } from "@/constants/routes";
import type { z } from "zod";

type FormValues = z.infer<typeof forgotPasswordSchema>;

const RESEND_COOLDOWN_SECONDS = 27;

export function ForgotPasswordForm() {
  const [step, setStep] = useState<"request" | "sent">("request");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (step !== "sent") return;
    const interval = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, [step]);

  async function sendResetLink(values: FormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error?.message ?? "Something went wrong");
        return;
      }
      setStep("sent");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "sent") {
    const email = form.getValues("email");
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-pill bg-primary/10 text-primary">
          <Mail className="size-8" />
        </span>
        <div>
          <h1 className="text-h3 font-bold text-foreground">Check Your Email</h1>
          <p className="mt-1 text-body text-muted-foreground">
            We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <p className="text-body text-muted-foreground">Click the link in the email to proceed.</p>
        <button
          type="button"
          onClick={() => sendResetLink({ email })}
          disabled={cooldown > 0}
          className="text-body font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
        >
          Resend Link {cooldown > 0 ? `(${cooldown}s)` : ""}
        </button>
        <p className="text-body text-muted-foreground">
          Remember your password?{" "}
          <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div>
        <h1 className="text-h3 font-bold text-foreground">Request Reset Link</h1>
        <p className="text-body text-muted-foreground">Enter your email and we&apos;ll send you a link to reset your password.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(sendResetLink)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="email" placeholder="dr.ayalagbe@example.com" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-body text-muted-foreground">
        Remember your password?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
