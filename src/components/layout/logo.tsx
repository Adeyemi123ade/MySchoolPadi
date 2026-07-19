import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold text-h4", className)}>
      <span className="flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
        <Layers className="size-4" />
      </span>
      MySchoolPadi
    </span>
  );
}
