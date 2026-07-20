import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function RegistrationStepper({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <ol className="flex items-center justify-center gap-2">
      {steps.map((label, index) => {
        const step = index + 1;
        const isComplete = step < currentStep;
        const isActive = step === currentStep;

        return (
          <li key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-pill text-caption font-semibold",
                  isComplete && "bg-primary text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground",
                  !isComplete && !isActive && "bg-muted text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="size-4" /> : step}
              </span>
              <span
                className={cn(
                  "text-caption font-medium",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {step < steps.length && <div className="mb-5 h-px w-10 bg-border sm:w-16" />}
          </li>
        );
      })}
    </ol>
  );
}
