"use client";

import { useAuth } from "@/hooks/use-auth";
import { StudentProfileView } from "@/features/profile/components/student-profile-view";
import { LecturerProfileView } from "@/features/profile/components/lecturer-profile-view";

export default function ProfilePage() {
  const { profile } = useAuth();

  return profile?.role === "lecturer" ? <LecturerProfileView /> : <StudentProfileView />;
}
