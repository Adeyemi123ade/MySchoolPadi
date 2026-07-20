import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-pill bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-body font-semibold text-foreground">{title}</p>
        {description && <p className="text-caption text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
