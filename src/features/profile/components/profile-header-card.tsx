"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import type { Profile } from "@/types";

export function ProfileHeaderCard({ profile }: { profile: Profile }) {
  const idLabel = profile.role === "lecturer" ? profile.staff_id : profile.matric_number;

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-primary p-6 text-center text-primary-foreground sm:flex-row sm:text-left">
      <Avatar className="size-16 border-2 border-primary-foreground/30">
        <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? "User"} />
        <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
          {initials(profile.full_name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-h4 font-semibold">{profile.full_name}</p>
        {idLabel && <p className="text-caption text-primary-foreground/80">{idLabel}</p>}
        {profile.department && <p className="text-caption text-primary-foreground/80">{profile.department}</p>}
      </div>
    </div>
  );
}
