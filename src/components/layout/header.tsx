"use client";

import Link from "next/link";
import { Bell, LogOut, Menu, Search, Settings, User as UserIcon } from "lucide-react";

import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/services";
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

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { profile } = useAuth();

  async function handleSignOut() {
    const supabase = createClient();
    await authService.signOut(supabase);
    window.location.href = ROUTES.login;
  }

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-primary px-4 text-primary-foreground">
      <Button
        variant="ghost"
        size="icon"
        className="text-primary-foreground hover:bg-white/10 md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      <Link href={ROUTES.dashboard} className="text-primary-foreground [&_span]:text-primary-foreground">
        <Logo />
      </Link>

      <div className="flex-1" />

      <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10" aria-label="Search">
        <Search className="size-5" />
      </Button>

      <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-white/10" aria-label="Notifications" asChild>
        <Link href={ROUTES.notifications}>
          <Bell className="size-5" />
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="ml-1 rounded-pill outline-none focus-visible:ring-2 focus-visible:ring-white/50" aria-label="Account menu">
            <Avatar>
              <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? "User"} />
              <AvatarFallback>{initials(profile?.full_name)}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={ROUTES.profile}>
              <UserIcon /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.settings}>
              <Settings /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
            <LogOut /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
