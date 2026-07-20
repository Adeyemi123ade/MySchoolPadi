import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800">
      <div
        aria-hidden
        className="absolute -top-32 right-[-10%] size-[26rem] rounded-full bg-secondary/30 blur-[110px]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-[-10%] size-[22rem] rounded-full bg-primary/25 blur-[110px]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06),_transparent_60%)]"
      />

      <div className="relative mx-auto grid max-w-7xl items-end gap-4 px-4 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-20">
        <div className="flex flex-col items-start gap-6 pb-14 lg:pb-24">
          <span className="flex items-center gap-2 rounded-pill border border-white/15 bg-white/10 px-3 py-1.5 text-caption font-medium text-white/90">
            <span className="size-1.5 shrink-0 rounded-pill bg-success" />
            Free for every student &amp; lecturer &middot; No credit card required
          </span>

          <h1 className="text-display font-bold text-white">
            Everything about
            <br />
            <span className="text-secondary">your school life.</span>
            <br />
            One clear feed.
          </h1>

          <p className="max-w-md text-body-lg text-white/70">
            MySchoolPadi brings course announcements, schedules and updates out of scattered group
            chats and into one organised place — built separately for how students and lecturers
            actually use it.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="bg-secondary text-white hover:bg-secondary/90" asChild>
              <Link href={ROUTES.register}>
                Get Started — It&apos;s Free
                <ArrowRight />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="border-white/25 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {["Role-based dashboards", "Real-time announcements", "Secure verified accounts"].map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-caption text-white/60">
                <CheckCircle2 className="size-3.5 shrink-0 text-secondary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto flex w-full max-w-sm justify-center lg:max-w-none lg:justify-end">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-x-6 top-6 bottom-0 rounded-full bg-secondary/35 blur-3xl"
            />
            <Image
              src="/images/auth/student-illustration.webp"
              alt="A MySchoolPadi student, smiling, carrying textbooks and a backpack"
              width={458}
              height={648}
              priority
              className="relative z-10 h-auto w-[240px] object-contain sm:w-[300px] lg:w-[380px] xl:w-[420px]"
            />

            <div className="absolute bottom-10 -left-4 z-20 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-xl sm:-left-10">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-success/10 text-success">
                <Bell className="size-4" />
              </span>
              <div>
                <p className="text-caption font-semibold text-foreground">New announcement</p>
                <p className="text-caption text-muted-foreground">CSC 301 &middot; just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
