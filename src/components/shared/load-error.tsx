"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

export function LoadError({
  title = "Couldn't load this right now",
  onRetry,
  className,
}: {
  title?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={WifiOff}
      title={title}
      description="Check your connection and try again."
      className={cn(className)}
      action={
        onRetry && (
          <Button size="sm" variant="secondary" onClick={onRetry}>
            <RefreshCw /> Try again
          </Button>
        )
      }
    />
  );
}
