"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadError } from "@/components/shared/load-error";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAnnouncements } from "@/features/announcements/hooks/use-announcements";
import { ROUTES } from "@/constants/routes";
import type { AnnouncementWithAuthor } from "@/types";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const { data: announcements, isLoading, isError, refetch } = useAnnouncements();

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  const byDay = useMemo(() => {
    const map = new Map<string, AnnouncementWithAuthor[]>();
    for (const a of announcements ?? []) {
      const date = a.published_at ?? a.created_at;
      const key = format(new Date(date), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    return map;
  }, [announcements]);

  const selectedItems = selectedDay ? (byDay.get(format(selectedDay, "yyyy-MM-dd")) ?? []) : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-h2 font-bold text-foreground">Calendar</h1>
          <p className="text-caption text-muted-foreground">
            Announcements plotted by the day they were published — there&apos;s no separate due-date field yet.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" aria-label="Previous month" onClick={() => setMonth((m) => subMonths(m, 1))}>
            <ChevronLeft className="size-4" />
          </Button>
          <p className="w-32 text-center text-body font-semibold text-foreground">{format(month, "MMMM yyyy")}</p>
          <Button variant="secondary" size="icon" aria-label="Next month" onClick={() => setMonth((m) => addMonths(m, 1))}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {isLoading && <Skeleton className="h-96 w-full" />}

      {isError && <LoadError title="Couldn't load announcements" onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-7 border-b border-border bg-muted/50">
              {WEEKDAY_LABELS.map((label) => (
                <div key={label} className="px-2 py-2 text-center text-caption font-medium text-muted-foreground">
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                const items = byDay.get(key) ?? [];
                const inMonth = isSameMonth(day, month);
                const isSelected = selectedDay && isSameDay(day, selectedDay);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDay(items.length > 0 ? day : null)}
                    className={cn(
                      "flex min-h-20 flex-col items-start gap-1 border-b border-r border-border p-2 text-left last:border-r-0",
                      !inMonth && "bg-muted/30 text-muted-foreground",
                      isSelected && "bg-primary/10",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-pill text-caption",
                        isToday(day) && "bg-primary text-primary-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {items.length > 0 && (
                      <Badge variant={inMonth ? "default" : "outline"} className="text-[10px]">
                        {items.length} {items.length === 1 ? "post" : "posts"}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDay && (
            <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-body font-semibold text-foreground">{format(selectedDay, "EEEE, MMMM d")}</p>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)}>
                  Close
                </Button>
              </div>

              {selectedItems.length === 0 ? (
                <EmptyState icon={CalendarDays} title="Nothing published this day" />
              ) : (
                selectedItems.map((a) => (
                  <Link
                    key={a.id}
                    href={ROUTES.announcement(a.id)}
                    className="rounded-md border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <p className="text-body font-medium text-foreground">{a.title}</p>
                    <p className="truncate text-caption text-muted-foreground">{a.body}</p>
                  </Link>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
