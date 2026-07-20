"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Logged for our own debugging only — never shown to the user.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-h2 font-semibold text-foreground">Something went wrong</h1>
      <p className="max-w-md text-body text-muted-foreground">
        That&apos;s on us, not you. Try again, and if it keeps happening, come back a little later.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="secondary" asChild>
          <Link href={ROUTES.home}>Go home</Link>
        </Button>
      </div>
    </main>
  );
}
