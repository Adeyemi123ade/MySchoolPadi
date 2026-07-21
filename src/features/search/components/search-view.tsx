"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Megaphone, SearchX, X } from "lucide-react";

import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { useAnnouncements } from "@/features/announcements/hooks/use-announcements";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { ROUTES } from "@/constants/routes";

const RECENT_SEARCHES_KEY = "myschoolpadi:recent-searches";
const RECENT_SEARCHES_LIMIT = 6;

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  const existing = readRecent().filter((q) => q !== query);
  window.localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify([query, ...existing].slice(0, RECENT_SEARCHES_LIMIT)),
  );
}

export function SearchView() {
  const { profile } = useAuth();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(() => readRecent());

  const { data: courses } = useCourses({ schoolId: profile?.school_id ?? undefined });
  const { data: announcements } = useAnnouncements();

  const q = query.trim().toLowerCase();

  const courseResults = useMemo(() => {
    if (!q) return [];
    return (courses ?? []).filter((c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [courses, q]);

  const announcementResults = useMemo(() => {
    if (!q) return [];
    return (announcements ?? []).filter(
      (a) => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q),
    );
  }, [announcements, q]);

  function commitSearch(value: string) {
    if (!value.trim()) return;
    saveRecent(value.trim());
    setRecent(readRecent());
  }

  const hasResults = courseResults.length > 0 || announcementResults.length > 0;
  const courseHref = (courseId: string) =>
    profile?.role === "lecturer" ? `${ROUTES.students}?courseId=${courseId}` : `${ROUTES.announcements}?courseId=${courseId}`;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <h1 className="text-h2 font-bold text-foreground">Search</h1>

      <SearchInput
        autoFocus
        placeholder="Search announcements, courses, lecturers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
        onBlur={() => commitSearch(query)}
        aria-label="Search"
      />

      {!q && recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-caption font-medium text-muted-foreground">Recent Searches</p>
            <button
              type="button"
              className="text-caption text-primary hover:underline"
              onClick={() => {
                window.localStorage.removeItem(RECENT_SEARCHES_KEY);
                setRecent([]);
              }}
            >
              Clear all
            </button>
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {recent.map((entry) => (
              <li key={entry}>
                <button
                  type="button"
                  onClick={() => setQuery(entry)}
                  className="flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-body text-foreground hover:bg-muted"
                >
                  {entry}
                  <X
                    className="size-4 text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = recent.filter((r) => r !== entry);
                      window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
                      setRecent(updated);
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {q && !hasResults && (
        <EmptyState icon={SearchX} title="No results" description={`Nothing matches "${query}".`} />
      )}

      {courseResults.length > 0 && (
        <div>
          <p className="mb-2 text-caption font-medium text-muted-foreground">Courses</p>
          <div className="flex flex-col gap-2">
            {courseResults.map((course) => (
              <Link
                key={course.id}
                href={courseHref(course.id)}
                className="flex items-center gap-3 rounded-md border border-border p-3 hover:border-primary/40"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <BookOpen className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-body font-medium text-foreground">{course.code}</p>
                  <p className="truncate text-caption text-muted-foreground">{course.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {announcementResults.length > 0 && (
        <div>
          <p className="mb-2 text-caption font-medium text-muted-foreground">Announcements</p>
          <div className="flex flex-col gap-2">
            {announcementResults.map((announcement) => (
              <Link
                key={announcement.id}
                href={ROUTES.announcement(announcement.id)}
                className="flex items-center gap-3 rounded-md border border-border p-3 hover:border-primary/40"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                  <Megaphone className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-body font-medium text-foreground">{announcement.title}</p>
                  <p className="truncate text-caption text-muted-foreground">{announcement.author.full_name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
