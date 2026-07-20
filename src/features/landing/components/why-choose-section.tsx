import { Bell, LayoutDashboard, ShieldCheck, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const VALUE_PROPS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: LayoutDashboard,
    title: "Everything in one place",
    description:
      "Announcements, courses and updates live in a single feed instead of being scattered across WhatsApp groups and noticeboards.",
  },
  {
    icon: Bell,
    title: "Built for each role",
    description:
      "Students get a clean feed of what matters to them. Lecturers get a dashboard for publishing to the right courses.",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    description:
      "A responsive interface that works as well on a phone between classes as it does on a laptop in the office.",
  },
  {
    icon: ShieldCheck,
    title: "Verified accounts",
    description:
      "Sign-up is tied to a verified email and your role, so course announcements reach the right people.",
  },
];

export function WhyChooseSection() {
  return (
    <section id="why-choose" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-h2 font-bold text-foreground">Why MySchoolPadi</h2>
        <p className="mt-3 text-body-lg text-muted-foreground">
          A purpose-built communication layer for campus life — not another group chat.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col gap-3 rounded-lg border border-border p-6">
            <span className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="text-h4 font-semibold text-foreground">{title}</h3>
            <p className="text-body text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
