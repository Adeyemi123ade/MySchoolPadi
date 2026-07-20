import { CheckCircle2, Clock, Eye, FileEdit } from "lucide-react";

export interface AnnouncementSummary {
  published: number;
  scheduled: number;
  drafts: number;
  totalViews: number;
}

const ROWS = [
  { key: "published", label: "Published", icon: CheckCircle2 },
  { key: "scheduled", label: "Scheduled", icon: Clock },
  { key: "drafts", label: "Drafts", icon: FileEdit },
  { key: "totalViews", label: "Total Views", icon: Eye },
] as const;

export function AnnouncementSummaryCard({ summary }: { summary: AnnouncementSummary }) {
  return (
    <div className="rounded-lg border border-border p-5">
      <h3 className="text-body font-semibold text-foreground">Announcement Summary</h3>
      <ul className="mt-3 flex flex-col gap-3">
        {ROWS.map((row) => (
          <li key={row.key} className="flex items-center justify-between text-body">
            <span className="flex items-center gap-2 text-muted-foreground">
              <row.icon className="size-4" />
              {row.label}
            </span>
            <span className="font-semibold text-foreground">{summary[row.key].toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
