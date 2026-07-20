import { CalendarClock } from "lucide-react";

// No lecture-schedule/timetable table exists in the schema yet, so this
// renders an honest empty state instead of invented lecture times.
export function UpcomingLecturesCard() {
  return (
    <div className="flex flex-col rounded-lg border border-border p-5">
      <h3 className="text-body font-semibold text-foreground">Upcoming Lectures</h3>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
        <CalendarClock className="size-8 text-muted-foreground" strokeWidth={1.5} />
        <p className="text-body text-muted-foreground">No lecture schedule yet.</p>
      </div>
    </div>
  );
}
