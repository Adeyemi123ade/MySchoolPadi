import Image from "next/image";
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
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-primary/5">
        <Image
          src="/images/auth/student-illustration.webp"
          alt="A student carrying textbooks and a backpack"
          fill
          sizes="(min-width: 768px) 320px, 90vw"
          className="object-contain object-bottom"
          priority
        />
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
