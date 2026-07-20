import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-ink-950 via-primary to-secondary px-6 py-14 text-center sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="absolute -top-16 left-1/2 size-72 -translate-x-1/2 rounded-full bg-white/10 blur-[100px]"
        />
        <h2 className="relative text-h2 font-bold text-white">Ready to stop missing announcements?</h2>
        <p className="relative max-w-xl text-body-lg text-white/80">
          Create your free account in a couple of minutes — whether you&apos;re a student trying to
          keep up, or a lecturer trying to reach your class.
        </p>
        <div className="relative flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link href={ROUTES.registerStudent}>Register as a Student</Link>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="border-white/40 bg-transparent text-white hover:bg-white/10"
            asChild
          >
            <Link href={ROUTES.registerLecturer}>Register as a Lecturer</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
