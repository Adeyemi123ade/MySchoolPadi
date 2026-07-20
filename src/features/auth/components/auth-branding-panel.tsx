import { Bell, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const FEATURES = [
  { icon: Bell, label: "Real-time announcements" },
  { icon: BookOpen, label: "Course management" },
  { icon: Sparkles, label: "Stay informed, always" },
];

export function AuthBrandingPanel({
  title = "Welcome Back! 👋",
  description = "Sign in to continue to your academic dashboard.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex h-full flex-col justify-between p-8">
      <div className="flex flex-col gap-6">
        <Logo />

        <div>
          <h2 className="text-h2 font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-body text-muted-foreground">{description}</p>
        </div>

        <div className="flex items-center justify-center rounded-lg bg-primary/5 py-12">
          <GraduationCap className="size-24 text-primary" strokeWidth={1.25} />
        </div>

        <ul className="flex flex-col gap-3">
          {FEATURES.map((feature) => (
            <li key={feature.label} className="flex items-center gap-3 text-body text-muted-foreground">
              <span className="flex size-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
                <feature.icon className="size-4" />
              </span>
              {feature.label}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-caption text-muted-foreground">Nigeria (English)</p>
    </div>
  );
}
