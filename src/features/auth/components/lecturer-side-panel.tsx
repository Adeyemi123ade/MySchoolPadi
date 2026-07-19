import Image from "next/image";
import { BarChart3, Check, Megaphone, Presentation, ShieldAlert, Users } from "lucide-react";

const CAPABILITIES = [
  { icon: Presentation, label: "Manage your courses" },
  { icon: Megaphone, label: "Post announcements" },
  { icon: Users, label: "Track student engagement" },
  { icon: BarChart3, label: "View analytics & insights" },
];

export function LecturerSidePanel() {
  return (
    <div className="flex h-full flex-col gap-6 p-8">
      <div className="flex items-center justify-center rounded-lg bg-primary/5 p-4">
        <Image
          src="/images/auth/lecturer-illustration.webp"
          alt="A lecturer in a suit, arms crossed"
          width={185}
          height={264}
          className="h-auto max-h-56 w-auto"
          priority
        />
      </div>

      <div className="rounded-md border border-border p-5">
        <h3 className="text-body font-semibold text-foreground">As a lecturer, you can:</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {CAPABILITIES.map((cap) => (
            <li key={cap.label} className="flex items-center gap-2 text-body text-muted-foreground">
              <Check className="size-4 shrink-0 text-success" />
              {cap.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-md border border-warning/30 bg-warning/5 p-5">
        <div className="flex items-center gap-2 text-body font-semibold text-foreground">
          <ShieldAlert className="size-4 text-warning" />
          Verification Required
        </div>
        <p className="mt-2 text-caption text-muted-foreground">
          Lecturer accounts require institution verification to ensure a trusted academic environment.
        </p>
      </div>
    </div>
  );
}
