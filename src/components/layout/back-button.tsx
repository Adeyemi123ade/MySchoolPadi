import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** A page's link to its parent in the app's navigation hierarchy — not raw browser history, so it's predictable regardless of how the user arrived. */
export function BackButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex w-fit items-center gap-1 text-body text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" /> {label}
    </Link>
  );
}
