import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { ROUTES } from "@/constants/routes";
import type { Announcement } from "@/types";

export function RecentAnnouncementsCard({ announcements }: { announcements: Announcement[] }) {
  return (
    <div className="rounded-lg border border-border p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-body font-semibold text-foreground">Recent Announcements</h3>
        <Link href={ROUTES.announcements} className="text-caption font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      {announcements.length === 0 ? (
        <p className="mt-3 text-body text-muted-foreground">You haven&apos;t posted any announcements yet.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {announcements.map((announcement) => (
            <li key={announcement.id}>
              <Link href={ROUTES.announcement(announcement.id)} className="block hover:opacity-80">
                <p className="text-body font-medium text-foreground">{announcement.title}</p>
                <p className="text-caption text-muted-foreground">
                  {formatDistanceToNowStrict(new Date(announcement.published_at ?? announcement.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
