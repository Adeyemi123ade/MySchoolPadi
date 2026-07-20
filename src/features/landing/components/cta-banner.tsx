import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-primary px-6 py-12 text-center sm:px-12">
        <h2 className="text-h2 font-bold text-primary-foreground">
          Ready to stop missing announcements?
        </h2>
        <p className="max-w-xl text-body-lg text-primary-foreground/85">
          Create your free account in a couple of minutes — whether you&apos;re a student trying to
          keep up, or a lecturer trying to reach your class.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="secondary" className="border-transparent bg-background text-primary hover:bg-background/90" asChild>
            <Link href={ROUTES.registerStudent}>Register as a Student</Link>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link href={ROUTES.registerLecturer}>Register as a Lecturer</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
