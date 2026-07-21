"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeaderCard } from "@/features/profile/components/profile-header-card";
import { EditProfileDialog } from "@/features/profile/components/edit-profile-dialog";
import { useMyCourses } from "@/features/courses/hooks/use-courses";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/services";
import { ROUTES } from "@/constants/routes";

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-caption text-muted-foreground">{label}</span>
      <span className="text-body text-foreground">{value || "—"}</span>
    </div>
  );
}

export function LecturerProfileView() {
  const { profile } = useAuth();
  const { data: courses } = useMyCourses();

  if (!profile) return null;

  async function handleSignOut() {
    const supabase = createClient();
    await authService.signOut(supabase);
    window.location.href = ROUTES.login;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-bold text-foreground">Profile</h1>
        <EditProfileDialog profile={profile} />
      </div>

      <ProfileHeaderCard profile={profile} />

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="professional">Professional Information</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="rounded-lg border border-border p-4">
          <div className="flex flex-col divide-y divide-border">
            <InfoRow label="Full name" value={profile.full_name} />
            <InfoRow label="Email address" value={profile.email} />
            <InfoRow label="Phone number" value={profile.phone_number} />
          </div>
        </TabsContent>

        <TabsContent value="professional" className="rounded-lg border border-border p-4">
          <div className="flex flex-col divide-y divide-border">
            <InfoRow label="Department" value={profile.department} />
            <InfoRow label="Staff ID" value={profile.staff_id} />
            <InfoRow label="Courses taught" value={String(courses?.length ?? 0)} />
            <InfoRow
              label="Verification status"
              value={
                <Badge variant={profile.verified ? "success" : "outline"}>
                  {profile.verified ? "Verified" : "Pending"}
                </Badge>
              }
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" asChild className="flex-1">
          <Link href={ROUTES.settings}>Change Password</Link>
        </Button>
        <Button variant="danger" onClick={handleSignOut} className="flex-1">
          <LogOut /> Log Out
        </Button>
      </div>
    </div>
  );
}
