"use client";

import { CheckCircle2, PartyPopper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RegistrationSuccess({ onProceed }: { onProceed: () => void }) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg border border-border bg-card p-8 text-center shadow-lg">
      <div className="relative flex size-20 items-center justify-center rounded-pill bg-success/10 text-success">
        <CheckCircle2 className="size-10 animate-in zoom-in duration-500" />
        <Sparkles className="absolute -top-1 -right-1 size-5 animate-bounce text-primary" />
        <PartyPopper className="absolute -bottom-1 -left-2 size-5 -rotate-12 text-warning" />
      </div>

      <div>
        <h1 className="text-h3 font-bold text-foreground">Congratulations!</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Your account has been created successfully. You&apos;re all set to get started with MySchoolPadi.
        </p>
      </div>

      <Button size="lg" className="w-full" onClick={onProceed}>
        Proceed to Dashboard
      </Button>
    </div>
  );
}
