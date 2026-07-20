"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "./password-input";
import { PasswordRequirements } from "./password-requirements";
import { passwordSchema } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { ROUTES } from "@/constants/routes";

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Exchanges the recovery token in the URL fragment (from the emailed link)
  // for a session, and syncs it to cookies so /api/auth/reset-password can
  // see it. Supabase does this automatically the first time a browser
  // client is created on this page, but nothing else on this page
  // otherwise instantiates one.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession();
  }, []);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password }),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error?.message ?? "Could not reset password. The link may have expired.");
        return;
      }

      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <div className="relative flex size-24 items-center justify-center">
          <Sparkles className="absolute -top-2 -left-4 size-5 text-secondary" />
          <Sparkles className="absolute -right-4 -bottom-1 size-4 text-primary" />
          <span className="flex size-20 items-center justify-center rounded-pill bg-success text-success-foreground">
            <CheckCircle2 className="size-10" />
          </span>
        </div>
        <div>
          <h1 className="text-h3 font-bold text-foreground">Password Reset Successful!</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Your password has been reset successfully. You can now sign in using your new password.
          </p>
        </div>
        <Button size="lg" className="w-full" onClick={() => router.push(ROUTES.login)}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div>
        <h1 className="text-h3 font-bold text-foreground">Create New Password!</h1>
        <p className="text-body text-muted-foreground">Enter your new password below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Enter new password" autoComplete="new-password" {...field} />
                </FormControl>
                <PasswordRequirements password={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Confirm new password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
