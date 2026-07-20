import Link from "next/link";
import { GraduationCap, Presentation } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ROUTES } from "@/constants/routes";

const ROLES = [
  {
    href: ROUTES.registerStudent,
    icon: GraduationCap,
    title: "I'm a Student",
    description: "Access your courses, announcements, and academic updates.",
  },
  {
    href: ROUTES.registerLecturer,
    icon: Presentation,
    title: "I'm a Lecturer",
    description: "Manage your courses, post announcements, and track engagement.",
  },
] as const;

export default function RegisterPage() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-8 rounded-lg border border-border bg-card p-8 shadow-lg">
      <Logo />

      <div className="text-center">
        <h1 className="text-h2 font-bold text-foreground">Create your account</h1>
        <p className="mt-1 text-body text-muted-foreground">Tell us who you are to get started.</p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        {ROLES.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="group flex flex-col items-center gap-3 rounded-md border border-border p-6 text-center transition-colors hover:border-primary hover:bg-primary/5"
          >
            <span className="flex size-14 items-center justify-center rounded-pill bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <role.icon className="size-7" />
            </span>
            <span className="text-h4 font-semibold text-foreground">{role.title}</span>
            <span className="text-body text-muted-foreground">{role.description}</span>
          </Link>
        ))}
      </div>

      <p className="text-body text-muted-foreground">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
