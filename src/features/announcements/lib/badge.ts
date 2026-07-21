import type { Announcement } from "@/types";

const NEW_WINDOW_HOURS = 48;

export type AnnouncementBadge = {
  label: string;
  variant: "destructive" | "warning" | "secondary" | "success" | "outline";
};

/** Derives a display badge from an announcement's real fields — never stored directly. */
export function announcementBadge(announcement: Pick<Announcement, "status" | "priority" | "published_at" | "created_at">): AnnouncementBadge {
  if (announcement.status === "draft") return { label: "DRAFT", variant: "outline" };
  if (announcement.priority === "important") return { label: "IMPORTANT", variant: "destructive" };
  if (announcement.priority === "reminder") return { label: "REMINDER", variant: "warning" };
  if (announcement.priority === "update") return { label: "UPDATE", variant: "secondary" };

  const publishedAt = announcement.published_at ?? announcement.created_at;
  const hoursSincePublished = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60);
  if (hoursSincePublished < NEW_WINDOW_HOURS) return { label: "NEW", variant: "success" };

  return { label: "INFO", variant: "outline" };
}
