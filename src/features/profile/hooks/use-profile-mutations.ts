"use client";

import { useMutation } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import { useAuthStore } from "@/store/auth.store";
import type { Profile } from "@/types";

export interface ProfileUpdateInput {
  fullName?: string;
  phoneNumber?: string;
  department?: string;
}

export function useUpdateProfile() {
  const setProfile = useAuthStore((state) => state.setProfile);

  return useMutation({
    mutationFn: (input: ProfileUpdateInput) =>
      fetchJson<Profile>("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: (profile) => setProfile(profile),
  });
}

export function useUploadAvatar() {
  const setProfile = useAuthStore((state) => state.setProfile);
  const profile = useAuthStore((state) => state.profile);

  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return fetchJson<{ path: string; url: string }>("/api/storage/avatar", { method: "POST", body: form });
    },
    onSuccess: ({ url }) => {
      if (profile) setProfile({ ...profile, avatar_url: url });
    },
  });
}

export function useRemoveAvatar() {
  const setProfile = useAuthStore((state) => state.setProfile);
  const profile = useAuthStore((state) => state.profile);

  return useMutation({
    mutationFn: () => fetchJson<{ success: boolean }>("/api/storage/avatar", { method: "DELETE" }),
    onSuccess: () => {
      if (profile) setProfile({ ...profile, avatar_url: null });
    },
  });
}
