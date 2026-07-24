"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AnnouncementFormDialog } from "./announcement-form-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useMyAnnouncements } from "@/features/announcements/hooks/use-announcements";
import { useDeleteAnnouncement } from "@/features/announcements/hooks/use-announcement-mutations";
import { useMyCourses } from "@/features/courses/hooks/use-courses";
import { ROUTES } from "@/constants/routes";
import type { Announcement } from "@/types";

export function AnnouncementsManager() {
  const { profile } = useAuth();
  const { data: announcements, isLoading, isError } = useMyAnnouncements();
  const { data: courses } = useMyCourses();
  const deleteAnnouncement = useDeleteAnnouncement();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | undefined>(undefined);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(announcement: Announcement) {
    setEditing(announcement);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!pendingDeleteId) return;
    try {
      await deleteAnnouncement.mutateAsync(pendingDeleteId);
      toast.success("Announcement deleted.");
    } catch {
      toast.error("Couldn't delete. Try again.");
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-body text-muted-foreground">Create, draft, and publish announcements for your students.</p>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> New Announcement
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}

        {isError && (
          <p className="rounded-md border border-border p-4 text-body text-muted-foreground">
            Couldn&apos;t load your announcements right now.
          </p>
        )}

        {!isLoading && !isError && announcements?.length === 0 && (
          <p className="rounded-md border border-border p-4 text-body text-muted-foreground">
            No announcements yet — create your first one.
          </p>
        )}

        {announcements?.map((announcement) => (
          <div
            key={announcement.id}
            className="flex flex-col gap-2 rounded-md border border-border p-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <Link href={ROUTES.announcement(announcement.id)} className="flex flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant={announcement.status === "published" ? "success" : "outline"}>
                  {announcement.status === "published" ? "PUBLISHED" : "DRAFT"}
                </Badge>
                <span className="text-caption text-muted-foreground">
                  {formatDistanceToNowStrict(new Date(announcement.updated_at), { addSuffix: true })}
                </span>
              </div>
              <h3 className="text-body font-semibold text-foreground hover:underline">{announcement.title}</h3>
              <p className="line-clamp-2 text-body text-muted-foreground">{announcement.body}</p>
            </Link>
            <div className="flex shrink-0 gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => openEdit(announcement)}>
                Edit
              </Button>
              <Button type="button" variant="danger" size="sm" onClick={() => setPendingDeleteId(announcement.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AnnouncementFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        announcement={editing}
        courses={courses ?? []}
        defaultSchoolId={profile?.school_id}
      />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Are you sure you want to delete this?"
        description="This announcement will be permanently removed."
        isLoading={deleteAnnouncement.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
