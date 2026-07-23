"use client";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AvatarUploader } from "@/features/profile/components/avatar-uploader";
import { ProfileFieldsForm } from "@/features/profile/components/profile-fields-form";
import { HelpFaqSection } from "@/features/profile/components/help-faq-section";
import { useAuth } from "@/hooks/use-auth";

export default function SettingsPage() {
  const { profile, isLoading } = useAuth();

  if (isLoading || !profile) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="text-h2 font-bold text-foreground">Settings</h1>
        <p className="text-body text-muted-foreground">Manage your profile, appearance, and account.</p>
      </div>

      <div>
        <h2 className="text-h4 font-semibold text-foreground">Profile</h2>
        <div className="mt-4 flex flex-col gap-6">
          <AvatarUploader profile={profile} />
          <ProfileFieldsForm profile={profile} />
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-h4 font-semibold text-foreground">Appearance</h2>
        <p className="mt-1 text-body text-muted-foreground">Choose how MySchoolPadi looks on this device.</p>
        <div className="mt-4">
          <ThemeToggle />
        </div>
      </div>

      <Separator />

      <HelpFaqSection />
    </div>
  );
}
