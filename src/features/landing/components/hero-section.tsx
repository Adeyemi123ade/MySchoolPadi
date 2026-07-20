import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";

const FEATURE_HIGHLIGHTS = [
  "One feed for every course announcement",
  "Separate dashboards for students and lecturers",
  "Secure accounts with email verification",
];

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col items-start gap-6">
          <span className="rounded-pill border border-primary/20 bg-primary/10 px-3 py-1 text-caption font-medium text-primary">
            Now in early access
          </span>

          <h1 className="text-h1 font-bold text-foreground">
            Everything about your school life, in one clear feed.
          </h1>

          <p className="text-body-lg text-muted-foreground">
            MySchoolPadi brings course announcements, schedules and updates out of scattered group
            chats and into a single, organised place — built separately for how students and
            lecturers actually use it.
          </p>

          <ul className="flex flex-col gap-2">
            {FEATURE_HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-body text-foreground">
                <CheckCircle2 className="size-5 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href={ROUTES.register}>Get Started — It&apos;s Free</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href={ROUTES.login}>Log in</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="rounded-xl border border-border bg-card p-3 shadow-xl">
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-muted-foreground">Good morning,</p>
                  <p className="text-body font-semibold text-foreground">Amaka 👋</p>
                </div>
                <div className="size-9 rounded-pill bg-primary/10" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md border border-border p-3">
                  <p className="text-h4 font-bold text-foreground">4</p>
                  <p className="text-caption text-muted-foreground">Announcements</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-h4 font-bold text-foreground">3</p>
                  <p className="text-caption text-muted-foreground">Courses</p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <div className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="success">NEW</Badge>
                  </div>
                  <p className="mt-2 text-body font-semibold text-foreground">
                    CSC 301 — Assignment 3 posted
                  </p>
                  <p className="text-caption text-muted-foreground">Dr. Bello &middot; 2h ago</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="warning">REMINDER</Badge>
                  </div>
                  <p className="mt-2 text-body font-semibold text-foreground">
                    Mid-semester test moves to Friday
                  </p>
                  <p className="text-caption text-muted-foreground">Dr. Okonkwo &middot; 1d ago</p>
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="absolute -right-6 -top-6 -z-10 size-40 rounded-full bg-secondary/20 blur-2xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-8 -left-8 -z-10 size-40 rounded-full bg-primary/20 blur-2xl"
          />
        </div>
      </div>
    </section>
  );
}
