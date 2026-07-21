"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchJson } from "@/lib/api/fetch-json";
import { useAuthStore } from "@/store/auth.store";
import type { Profile } from "@/types";

/** Updates the current user's own profile (full name, phone number) and refreshes the cached auth profile. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setProfile = useAuthStore((s) => s.setProfile);

  return useMutation({
    mutationFn: (input: { fullName?: string; phoneNumber?: string }) =>
      fetchJson<Profile>("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: (profile) => {
      setProfile(profile);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
