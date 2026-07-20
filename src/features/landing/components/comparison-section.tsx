import { Check, X } from "lucide-react";

const OLD_WAY = [
  "Announcements buried in a 300-message WhatsApp group",
  "No way to tell which updates are urgent",
  "Missed class changes because a notice was pinned to a board you didn't pass",
  "Course materials scattered across emails, chats and flash drives",
];

const NEW_WAY = [
  "A dedicated feed, per course, that only carries real announcements",
  "Priority labels so you know what's urgent at a glance",
  "Instant notifications the moment a lecturer publishes an update",
  "One place to revisit anything you've bookmarked",
];

export function ComparisonSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-h2 font-bold text-foreground">Built to replace the group chat</h2>
        <p className="mt-3 text-body-lg text-muted-foreground">
          We built MySchoolPadi because course communication deserves better than a chat thread
          nobody can scroll back through.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border p-6 md:p-8">
          <h3 className="text-h4 font-semibold text-muted-foreground">The old way</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {OLD_WAY.map((item) => (
              <li key={item} className="flex items-start gap-3 text-body text-muted-foreground">
                <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 md:p-8">
          <h3 className="text-h4 font-semibold text-primary">With MySchoolPadi</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {NEW_WAY.map((item) => (
              <li key={item} className="flex items-start gap-3 text-body text-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
