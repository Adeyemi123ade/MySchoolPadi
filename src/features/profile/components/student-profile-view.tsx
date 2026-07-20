"use client";

import { LogOut, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ProfileHeaderCard } from "@/features/profile/components/profile-header-card";
import { EditProfileDialog } from "@/features/profile/components/edit-profile-dialog";
import { useSchools } from "@/features/auth/hooks/use-schools";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import { useBookmarks } from "@/features/bookmarks/hooks/use-bookmarks";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/services";
import { ROUTES } from "@/constants/routes";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-caption text-muted-foreground">{label}</span>
      <span className="text-body text-foreground">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-2 text-body font-semibold text-foreground">{title}</p>
      <div className="flex flex-col divide-y divide-border">{children}</div>
    </div>
  );
}

export function StudentProfileView() {
  const { profile } = useAuth();
  const { data: schools } = useSchools();
  const { data: enrollments } = useEnrollments();
  const { data: bookmarks } = useBookmarks();
  const { data: payments } = usePayments();

  if (!profile) return null;

  const school = schools?.find((s) => s.id === profile.school_id);

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

      <Section title="Personal Information">
        <InfoRow label="Full name" value={profile.full_name} />
        <InfoRow label="Email" value={profile.email} />
        <InfoRow label="Phone number" value={profile.phone_number} />
      </Section>

      <Section title="Academic Information">
        <InfoRow label="Matric number" value={profile.matric_number} />
        <InfoRow label="School" value={school?.name} />
        <InfoRow label="Enrolled courses" value={String(enrollments?.length ?? 0)} />
      </Section>

      <div className="rounded-lg border border-border p-4">
        <p className="mb-2 text-body font-semibold text-foreground">Payment History</p>
        {payments && payments.length > 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2">
                <span className="text-body text-foreground">
                  {p.currency} {p.amount}
                </span>
                <span className="text-caption text-muted-foreground capitalize">{p.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Wallet} title="No payments yet" description="Your payment history will show up here." />
        )}
      </div>

      <Section title="My Activity">
        <InfoRow label="Courses joined" value={String(enrollments?.length ?? 0)} />
        <InfoRow label="Bookmarks saved" value={String(bookmarks?.length ?? 0)} />
      </Section>

      <Button variant="danger" onClick={handleSignOut}>
        <LogOut /> Logout
      </Button>
    </div>
  );
}
