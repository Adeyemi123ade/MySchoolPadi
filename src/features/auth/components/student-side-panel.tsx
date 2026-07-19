import { BookOpen, Download, GraduationCap, Wifi } from "lucide-react";

const FEATURES = [
  { icon: BookOpen, label: "Access all your courses" },
  { icon: Wifi, label: "Get real-time updates" },
  { icon: Download, label: "Download materials" },
  { icon: GraduationCap, label: "Stay connected" },
];

export function StudentSidePanel() {
  return (
    <div className="flex h-full flex-col justify-between p-8">
      <div className="flex flex-1 items-center justify-center rounded-lg bg-primary/5">
        <GraduationCap className="size-32 text-primary" strokeWidth={1} />
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3">
        {FEATURES.map((feature) => (
          <li key={feature.label} className="flex items-center gap-2 text-caption text-muted-foreground">
            <feature.icon className="size-4 shrink-0 text-primary" />
            {feature.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
