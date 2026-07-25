"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { BackButton } from "@/components/layout/back-button";
import { AnnouncementFormDialog } from "@/features/announcements/components/announcement-form-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useAnnouncement } from "@/features/announcements/hooks/use-announcements";
import { useDeleteAnnouncement } from "@/features/announcements/hooks/use-announcement-mutations";
import { useMyCourses } from "@/features/courses/hooks/use-courses";
import { ROUTES } from "@/constants/routes";
import type { AnnouncementPriority } from "@/types";

function priorityBadgeVariant(priority: AnnouncementPriority) {
  if (priority === "important") return "destructive" as const;
  if (priority === "reminder") return "warning" as const;
  if (priority === "update") return "secondary" as const;
  return "default" as const;
}

export default function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile } = useAuth();
  const { data: announcement, isLoading, isError } = useAnnouncement(id);
  const { data: courses } = useMyCourses();
  const deleteAnnouncement = useDeleteAnnouncement();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const isAuthor = profile && announcement && profile.id === announcement.author_id;

  async function handleDelete() {
    if (!announcement) return;
    try {
      await deleteAnnouncement.mutateAsync(announcement.id);
      toast.success("Announcement deleted.");
      router.push(ROUTES.announcements);
    } catch {
      toast.error("Couldn't delete. Try again.");
    } finally {
      setConfirmDeleteOpen(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <BackButton href={ROUTES.announcements} label="Back to Announcements" />

      {isLoading && <Skeleton className="h-48 w-full" />}

      {isError && (
        <p className="rounded-md border border-border p-4 text-body text-muted-foreground">
          Couldn&apos;t load this announcement.
        </p>
      )}

      {announcement && (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={priorityBadgeVariant(announcement.priority)} className="px-1.5 py-0 text-[10px] leading-4">
                {announcement.priority.toUpperCase()}
              </Badge>
              {announcement.status === "draft" && (
                <Badge variant="outline" className="px-1.5 py-0 text-[10px] leading-4">
                  Draft
                </Badge>
              )}
            </div>
            {isAuthor && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="size-8"
                  aria-label="Edit"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="icon"
                  className="size-8"
                  aria-label="Delete"
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}
          </div>

          <h1 className="text-h2 font-bold text-foreground">{announcement.title}</h1>

          <p className="text-caption text-muted-foreground">
            {announcement.author.full_name} &middot;{" "}
            {format(new Date(announcement.published_at ?? announcement.created_at), "PPP p")}
          </p>

          <p className="whitespace-pre-wrap text-body text-foreground">{announcement.body}</p>
        </div>
      )}

      {announcement && (
        <AnnouncementFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          announcement={announcement}
          courses={courses ?? []}
          defaultSchoolId={profile?.school_id}
        />
      )}

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Are you sure you want to delete this?"
        description="This announcement will be permanently removed."
        isLoading={deleteAnnouncement.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
