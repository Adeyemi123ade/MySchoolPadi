import { Suspense } from "react";
import { AnnouncementFormView } from "@/features/announcements/components/announcement-form-view";

export default function NewAnnouncementPage() {
  return (
    <Suspense>
      <AnnouncementFormView />
    </Suspense>
  );
}
