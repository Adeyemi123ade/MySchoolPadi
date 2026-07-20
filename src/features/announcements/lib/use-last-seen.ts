"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "myschoolpadi:announcements-last-seen";

/**
 * "Unread" isn't a tracked field anywhere (no per-user read-state on
 * announcements, and nothing currently writes a notification row when one is
 * published — see README's Not-yet-built list). This is an honest
 * client-side stand-in: "unread" means "published after your last visit to
 * this page," snapshotted in localStorage. Real, just not server-tracked.
 */
export function useAnnouncementsLastSeen(): Date | null {
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setLastSeen(stored ? new Date(stored) : null);
    window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  }, []);

  return lastSeen;
}
