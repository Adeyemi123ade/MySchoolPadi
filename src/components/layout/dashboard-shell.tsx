"use client";

import { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileNavSheet } from "./mobile-nav-sheet";
import { BottomNav } from "./bottom-nav";
import { Footer } from "./footer";
import { useRealtimeNotifications } from "@/features/notifications/hooks/use-realtime-notifications";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useRealtimeNotifications();

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setMobileNavOpen(true)} />
      <MobileNavSheet open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}
