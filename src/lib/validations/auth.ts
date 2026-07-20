import { z } from "zod";

/** At least 8 characters, one uppercase letter, one number, one special character — matches the Create New Password mockup's checklist. */
export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "One uppercase letter")
  .regex(/[0-9]/, "One number")
  .regex(/[^A-Za-z0-9]/, "One special character");

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: passwordSchema,
    fullName: z.string().min(1).max(120),
    role: z.enum(["student", "lecturer"]),
    phoneNumber: z.string().min(7).max(20),
    schoolId: z.string().uuid().optional(),
    matricNumber: z.string().min(1).max(50).optional(),
    department: z.string().min(1).max(120).optional(),
    staffId: z.string().min(1).max(50).optional(),
  })
  .refine((val) => val.role !== "student" || !!val.matricNumber, {
    message: "Matric/Registration number is required for students",
    path: ["matricNumber"],
  })
  .refine((val) => val.role !== "lecturer" || !!val.department, {
    message: "Department is required for lecturers",
    path: ["department"],
  })
  .refine((val) => val.role !== "lecturer" || !!val.staffId, {
    message: "Staff ID is required for lecturers",
    path: ["staffId"],
  });

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6, "Enter the 6-digit code"),
});

export const resendVerificationSchema = z.object({
  email: z.string().email(),
});
