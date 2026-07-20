import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { ROUTES } from "@/constants/routes";
import { LANDING_NAV_LINKS } from "@/features/landing/constants";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-body text-muted-foreground">
            A single home for course announcements, schedules and updates — built for students and
            lecturers who are tired of missing things in the group chat.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Explore
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {LANDING_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-body text-foreground hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Get Started
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link href={ROUTES.registerStudent} className="text-body text-foreground hover:text-primary">
                  Register as a Student
                </Link>
              </li>
              <li>
                <Link href={ROUTES.registerLecturer} className="text-body text-foreground hover:text-primary">
                  Register as a Lecturer
                </Link>
              </li>
              <li>
                <Link href={ROUTES.login} className="text-body text-foreground hover:text-primary">
                  Log in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 text-center text-caption text-muted-foreground sm:px-6 lg:px-8">
        &copy; {new Date().getFullYear()} MySchoolPadi. All rights reserved.
      </div>
    </footer>
  );
}
