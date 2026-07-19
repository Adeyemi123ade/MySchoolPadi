"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/services";
import { useAuthStore } from "@/store/auth.store";

/**
 * Syncs Supabase auth state into the Zustand auth store and keeps it
 * up to date across sign-in / sign-out / token refresh events.
 */
export function useAuth() {
  const { profile, isLoading, setProfile, setLoading, reset } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile(userId: string) {
      const { data } = await authService.getProfile(supabase, userId);
      setProfile(data ?? null);
    }

    setLoading(true);
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) loadProfile(data.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadProfile(session.user.id);
      else reset();
    });

    return () => subscription.unsubscribe();
  }, [setProfile, setLoading, reset]);

  return { profile, isLoading };
}
