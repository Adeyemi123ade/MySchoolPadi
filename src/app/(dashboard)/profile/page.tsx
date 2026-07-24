"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const { profile, isLoading } = useAuth();

  if (isLoading || !profile) {
    return <Skeleton className="h-64 w-full max-w-xl" />;
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button asChild variant="secondary" size="sm">
          <Link href={ROUTES.settings}>Edit in Settings</Link>
        </Button>
      </div>

      <div className="flex items-center gap-4 rounded-lg border border-border p-6">
        <Avatar className="size-16">
          <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? "You"} />
          <AvatarFallback className="text-body">{initials(profile.full_name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-h4 font-semibold text-foreground">{profile.full_name ?? "Unnamed"}</p>
          <p className="text-body text-muted-foreground">{profile.email}</p>
          <Badge variant="secondary" className="mt-2">
            {profile.role === "lecturer" ? "Lecturer" : "Student"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border p-6">
        {profile.phone_number && (
          <div className="flex justify-between text-body">
            <span className="text-muted-foreground">Phone</span>
            <span className="text-foreground">{profile.phone_number}</span>
          </div>
        )}
        {profile.role === "lecturer" && profile.department && (
          <div className="flex justify-between text-body">
            <span className="text-muted-foreground">Department</span>
            <span className="text-foreground">{profile.department}</span>
          </div>
        )}
        {profile.role === "lecturer" && profile.staff_id && (
          <div className="flex justify-between text-body">
            <span className="text-muted-foreground">Staff ID</span>
            <span className="text-foreground">{profile.staff_id}</span>
          </div>
        )}
        {profile.role === "student" && profile.matric_number && (
          <div className="flex justify-between text-body">
            <span className="text-muted-foreground">Matric Number</span>
            <span className="text-foreground">{profile.matric_number}</span>
          </div>
        )}
      </div>
    </div>
  );
}
