"use client";

import { useRef } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUploadAvatar, useRemoveAvatar } from "@/features/profile/hooks/use-profile-mutations";
import type { Profile } from "@/types";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AvatarUploader({ profile }: { profile: Profile }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();

  const isBusy = uploadAvatar.isPending || removeAvatar.isPending;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Image must be under 5MB.");
      return;
    }

    try {
      await uploadAvatar.mutateAsync(file);
      toast.success("Profile photo updated.");
    } catch {
      toast.error("Couldn't upload your photo. Try again.");
    }
  }

  async function handleRemove() {
    try {
      await removeAvatar.mutateAsync();
      toast.success("Profile photo removed.");
    } catch {
      toast.error("Couldn't remove your photo. Try again.");
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? "You"} />
        <AvatarFallback className="text-body">{initials(profile.full_name)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isBusy}>
            {profile.avatar_url ? "Change photo" : "Upload photo"}
          </Button>
          {profile.avatar_url && (
            <Button type="button" variant="danger" size="sm" onClick={handleRemove} disabled={isBusy}>
              Remove
            </Button>
          )}
        </div>
        <p className="text-caption text-muted-foreground">JPG or PNG, up to 5MB.</p>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
