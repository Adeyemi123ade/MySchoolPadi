"use client";

import { useEffect } from "react";

/**
 * Traps the browser/device Back button on the current page while `active` —
 * pressing Back re-lands the user right back here instead of leaving. Used
 * to keep users inside a mandatory step (e.g. email verification) until
 * they finish it or explicitly sign out, per product requirement: Back must
 * never drop an in-progress user outside the authenticated app.
 */
export function useTrapBackNavigation(active: boolean) {
  useEffect(() => {
    if (!active) return;

    window.history.pushState(null, "", window.location.href);

    function handlePopState() {
      window.history.pushState(null, "", window.location.href);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [active]);
}
