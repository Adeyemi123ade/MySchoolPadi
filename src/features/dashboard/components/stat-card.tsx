import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENTS = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  secondary: "bg-secondary/10 text-secondary",
  warning: "bg-warning/10 text-warning",
} as const;

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: keyof typeof ACCENTS;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-4">
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-sm", ACCENTS[accent])}>
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-h4 font-bold text-foreground">{value}</p>
        <p className="text-caption text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
