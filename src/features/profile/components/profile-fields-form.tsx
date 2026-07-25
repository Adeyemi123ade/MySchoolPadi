"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfile } from "@/features/profile/hooks/use-profile-mutations";
import type { Profile } from "@/types";

export function ProfileFieldsForm({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number ?? "");
  const [department, setDepartment] = useState(profile.department ?? "");

  const updateProfile = useUpdateProfile();

  const isDirty =
    fullName !== (profile.full_name ?? "") ||
    phoneNumber !== (profile.phone_number ?? "") ||
    department !== (profile.department ?? "");

  async function handleSave() {
    try {
      await updateProfile.mutateAsync({
        fullName: fullName || undefined,
        phoneNumber: phoneNumber || undefined,
        department: profile.role === "lecturer" ? department || undefined : undefined,
      });
      toast.success("Profile updated.");
    } catch {
      toast.error("Couldn't save your changes. Try again.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-name">Full Name</Label>
        <Input id="profile-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-email">Email</Label>
        <Input id="profile-email" value={profile.email} disabled />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-phone">Phone Number</Label>
        <Input id="profile-phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </div>

      {profile.role === "lecturer" ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-department">Department</Label>
          <Input id="profile-department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        </div>
      ) : (
        profile.matric_number && (
          <div className="flex flex-col gap-2">
            <Label>Matric Number</Label>
            <Input value={profile.matric_number} disabled />
          </div>
        )
      )}

      <Button type="button" className="w-fit" onClick={handleSave} disabled={!isDirty || updateProfile.isPending}>
        {updateProfile.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
