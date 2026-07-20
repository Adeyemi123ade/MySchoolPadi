import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

const FEATURE_HIGHLIGHTS = [
  "Role-based dashboards",
  "Real-time announcements",
  "Secure verified accounts",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#2c1a68] via-[#1a0f3d] to-[#12091f] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,255,0.28),transparent_60%)]"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 pt-14 sm:gap-6 sm:px-6 sm:pt-20 md:pt-24 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/5 px-3 py-1.5 text-caption font-medium text-white/80">
          <span className="size-1.5 rounded-full bg-success" />
          Free for every student &amp; lecturer &middot; No credit card required
        </span>

        <h1 className="max-w-2xl text-h1 font-bold leading-tight sm:text-display">
          Everything about
          <br />
          <span className="text-secondary">your school life.</span>
          <br />
          One clear feed.
        </h1>

        <p className="max-w-xl text-body-lg text-white/70">
          MySchoolPadi brings course announcements, schedules and updates out of scattered group
          chats and into one organised place — built separately for how students and lecturers
          actually use it.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href={ROUTES.register}>
              Get Started — It&apos;s Free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#how-it-works">See How It Works</Link>
          </Button>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-caption text-white/60">
          {FEATURE_HIGHLIGHTS.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-secondary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto mt-8 flex max-w-7xl justify-center px-4 sm:mt-10 sm:px-6 md:mt-12 lg:px-8">
        <div className="relative w-full max-w-[240px] sm:max-w-[300px] md:max-w-sm">
          <div
            aria-hidden
            className="absolute inset-0 scale-110 rounded-full bg-primary/40 blur-3xl"
          />

          <div className="relative aspect-[3/4] [mask-image:radial-gradient(ellipse_75%_85%_at_50%_38%,black_65%,transparent_100%)]">
            <Image
              src="/images/auth/student-illustration.webp"
              alt="A student carrying textbooks and a backpack"
              fill
              sizes="(min-width: 768px) 384px, 60vw"
              className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
              priority
            />
          </div>

          <div className="absolute bottom-2 left-1/2 flex w-max -translate-x-1/2 items-center gap-3 rounded-lg bg-white px-4 py-3 text-neutral-900 shadow-xl sm:bottom-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <Bell className="size-4" />
            </span>
            <div className="text-left">
              <p className="text-body font-semibold leading-tight">New announcement</p>
              <p className="text-caption text-neutral-600">CSC 301 &middot; just now</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-10 sm:h-14 md:h-20" />
    </section>
  );
}
