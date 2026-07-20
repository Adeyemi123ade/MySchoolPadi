"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, IdCard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "./password-input";
import { PasswordRequirements } from "./password-requirements";
import { PhoneInput } from "./phone-input";
import { RegistrationStepper } from "./registration-stepper";
import { useSchools } from "@/features/auth/hooks/use-schools";
import { passwordSchema } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/services";
import { ROUTES } from "@/constants/routes";

const STEPS = ["Personal Info", "Institution Info", "Account Security"];

const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "English",
  "Law",
  "Medicine",
  "Engineering",
  "Business Administration",
] as const;

const schema = z
  .object({
    fullName: z.string().min(1, "Full name is required").max(120),
    email: z.string().email(),
    countryCode: z.string(),
    phoneNumber: z.string().min(7, "Enter a valid phone number").max(20),
    department: z.string().min(1, "Department is required"),
    staffId: z.string().min(1, "Staff ID/Employee number is required").max(50),
    schoolId: z.string().optional(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["fullName", "email", "phoneNumber", "department", "staffId"],
  2: ["schoolId"],
  3: ["password", "confirmPassword"],
};

export function LecturerRegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: schools, isLoading: schoolsLoading } = useSchools();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      countryCode: "+234",
      phoneNumber: "",
      department: "",
      staffId: "",
      schoolId: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  async function handleNext() {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await authService.signUp(supabase, {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        role: "lecturer",
        phoneNumber: `${values.countryCode}${values.phoneNumber}`,
        department: values.department,
        staffId: values.staffId,
        schoolId: values.schoolId,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      router.push(`${ROUTES.verifyEmail}?email=${encodeURIComponent(values.email)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <RegistrationStepper steps={STEPS} currentStep={step} />

      <div>
        <h1 className="text-h3 font-bold text-foreground">Create Lecturer Account</h1>
        <p className="text-body text-muted-foreground">Fill in your details to get started</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          onKeyDown={(e) => {
            if (e.key === "Enter" && step < STEPS.length) e.preventDefault();
          }}
        >
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Dr. Ayalagbe Chukwudi" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        countryCode={form.watch("countryCode")}
                        onCountryCodeChange={(code) => form.setValue("countryCode", code)}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff ID / Employee Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IdCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="CS/LECT/2018/045" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" size="lg" className="w-full" onClick={handleNext}>
                Next Step →
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="schoolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution / School</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange} disabled={schoolsLoading}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={schoolsLoading ? "Loading schools..." : "Select your institution"} />
                        </SelectTrigger>
                        <SelectContent>
                          {schools?.map((school) => (
                            <SelectItem key={school.id} value={school.id}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {!schoolsLoading && schools?.length === 0 && (
                      <p className="text-caption text-muted-foreground">
                        No institutions listed yet — you can skip this and it&apos;ll be assigned during verification.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" size="lg" className="flex-1" onClick={handleNext}>
                  Next Step →
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Create a password" autoComplete="new-password" {...field} />
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Confirm your password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>

      <p className="text-center text-body text-muted-foreground">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
