import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * A page's link to its parent in the app's navigation hierarchy — not raw
 * browser history, so it's predictable regardless of how the user arrived.
 * Icon-only by design; `label` is used as the accessible name, not shown.
 */
export function BackButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex size-9 w-fit items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <ArrowLeft className="size-5" />
    </Link>
  );
}
