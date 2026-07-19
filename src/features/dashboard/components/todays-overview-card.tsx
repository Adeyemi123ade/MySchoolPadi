const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Formatted manually (not via Intl) so server- and client-rendered output
// can't drift — Node's ICU and the browser's Intl implementation don't
// always agree on punctuation for the same locale/options.
function formatToday(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export interface OverviewStat {
  label: string;
  value: number;
}

export function TodaysOverviewCard({ stats }: { stats: OverviewStat[] }) {
  return (
    <div className="rounded-lg bg-primary p-5 text-primary-foreground">
      <div className="flex flex-col gap-1 text-caption sm:flex-row sm:items-center sm:justify-between">
        <span className="font-semibold">Today&apos;s Overview</span>
        <span className="text-primary-foreground/80">{formatToday(new Date())}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-h4 font-bold">{stat.value}</p>
            <p className="text-caption text-primary-foreground/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
