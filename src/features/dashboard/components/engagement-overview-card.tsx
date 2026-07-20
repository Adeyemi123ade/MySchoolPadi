import { LineChart } from "lucide-react";

// No view/engagement tracking exists in the schema yet, so this renders an
// honest empty state instead of a chart with invented numbers.
export function EngagementOverviewCard() {
  return (
    <div className="flex flex-col rounded-lg border border-border p-5">
      <h3 className="text-body font-semibold text-foreground">Engagement Overview</h3>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
        <LineChart className="size-8 text-muted-foreground" strokeWidth={1.5} />
        <p className="text-body text-muted-foreground">No engagement data yet.</p>
        <p className="text-caption text-muted-foreground">Charts will appear here once view tracking is available.</p>
      </div>
    </div>
  );
}
