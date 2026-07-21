import { Suspense } from "react";
import { MessagesView } from "@/features/messages/components/messages-view";

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesView />
    </Suspense>
  );
}
