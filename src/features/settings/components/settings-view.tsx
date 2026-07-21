"use client";

import Link from "next/link";
import { Bell, HelpCircle, Info, KeyRound, LogOut, Mail, Moon, ShieldCheck, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ChangePasswordDialog } from "@/features/settings/components/change-password-dialog";
import { useTheme } from "@/hooks/use-theme";
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/services";
import { ROUTES } from "@/constants/routes";

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="flex flex-col divide-y divide-border rounded-lg border border-border">{children}</div>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  action,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action?: React.ReactNode;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-body text-foreground">{label}</span>
      </div>
      {action}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50">
        {content}
      </Link>
    );
  }

  return <div className="flex items-center justify-between px-4 py-3">{content}</div>;
}

export function SettingsView() {
  const { isDark, toggleTheme } = useTheme();

  async function handleSignOut() {
    const supabase = createClient();
    await authService.signOut(supabase);
    window.location.href = ROUTES.login;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="text-h2 font-bold text-foreground">Settings</h1>

      <SettingsSection title="Account">
        <SettingsRow icon={User} label="Account Information" href={ROUTES.profile} />
        <ChangePasswordDialog>
          <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <KeyRound className="size-4 text-muted-foreground" />
              <span className="text-body text-foreground">Change Password</span>
            </div>
          </button>
        </ChangePasswordDialog>
        <SettingsRow
          icon={ShieldCheck}
          label="Two-Factor Authentication"
          action={<Badge variant="outline">Coming soon</Badge>}
        />
      </SettingsSection>

      <SettingsSection title="Preferences">
        <SettingsRow
          icon={Bell}
          label="Push Notifications"
          action={<Badge variant="outline">Coming soon</Badge>}
        />
        <SettingsRow
          icon={Mail}
          label="Email Notifications"
          action={<Badge variant="outline">Coming soon</Badge>}
        />
        <SettingsRow
          icon={Moon}
          label="Dark Mode"
          action={<Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="Toggle dark mode" />}
        />
      </SettingsSection>

      <SettingsSection title="Support">
        <SettingsRow icon={HelpCircle} label="Help & FAQ" href={`${ROUTES.home}#faq`} />
        <SettingsRow icon={Info} label="About MySchoolPadi" action={<span className="text-caption text-muted-foreground">v0.1.0</span>} />
      </SettingsSection>

      <Button variant="danger" onClick={handleSignOut}>
        <LogOut /> Logout
      </Button>
    </div>
  );
}
