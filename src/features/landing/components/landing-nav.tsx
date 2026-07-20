"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { LANDING_NAV_LINKS } from "@/features/landing/constants";

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950 text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="text-white">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {LANDING_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-body font-medium text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex-1 md:hidden" />

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white" asChild>
            <Link href={ROUTES.login}>Log in</Link>
          </Button>
          <Button size="sm" className="bg-secondary text-white hover:bg-secondary/90" asChild>
            <Link href={ROUTES.register}>Get Started Free</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 hover:text-white md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-ink-950 md:hidden">
          <nav aria-label="Main" className="flex flex-col gap-1 px-4 py-3">
            {LANDING_NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-sm px-3 py-2 text-body font-medium text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              <Button
                variant="secondary"
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link href={ROUTES.login}>Log in</Link>
              </Button>
              <Button className="bg-secondary text-white hover:bg-secondary/90" asChild>
                <Link href={ROUTES.register}>Get Started Free</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
