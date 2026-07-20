import { Bookmark, Filter, Rss, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const HIGHLIGHTS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Rss,
    title: "A dedicated feed per course",
    description: "Only real announcements from your actual lecturers — nothing else mixed in.",
  },
  {
    icon: Filter,
    title: "Priority labels, at a glance",
    description: "Important, reminder, or just an update — you know what needs attention immediately.",
  },
  {
    icon: Zap,
    title: "Instant notifications",
    description: "The moment a lecturer publishes, it's in your feed and your notifications.",
  },
  {
    icon: Bookmark,
    title: "Nothing gets lost",
    description: "Bookmark anything and revisit it later — no more scrolling through a chat history.",
  },
];

export function ComparisonSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 px-6 py-14 sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="absolute -bottom-20 -right-20 size-72 rounded-full bg-secondary/25 blur-[100px]"
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-h2 font-bold text-white">Built to replace the group chat</h2>
          <p className="mt-3 text-body-lg text-white/70">
            We built MySchoolPadi because course communication deserves better than a chat thread
            nobody can scroll back through.
          </p>
        </div>

        <div className="relative mt-12 grid gap-6 sm:grid-cols-2">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary/20 text-secondary">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="text-body font-semibold text-white">{title}</h3>
                <p className="mt-1 text-caption text-white/60">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
