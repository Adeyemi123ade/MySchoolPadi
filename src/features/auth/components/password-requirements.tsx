"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const REQUIREMENTS = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /[0-9]/.test(v) },
  { label: "One special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul className="flex flex-col gap-1">
      {REQUIREMENTS.map((req) => {
        const met = req.test(password);
        return (
          <li
            key={req.label}
            className={cn(
              "flex items-center gap-2 text-caption",
              met ? "text-success" : "text-muted-foreground",
            )}
          >
            {met ? <Check className="size-3.5" /> : <X className="size-3.5" />}
            {req.label}
          </li>
        );
      })}
    </ul>
  );
}
