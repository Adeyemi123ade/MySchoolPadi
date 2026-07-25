"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
  usePublishAnnouncement,
} from "@/features/announcements/hooks/use-announcement-mutations";
import type { Announcement, AnnouncementPriority, Course } from "@/types";

const PRIORITIES: { value: AnnouncementPriority; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "important", label: "Important" },
  { value: "reminder", label: "Reminder" },
  { value: "update", label: "Update" },
];

const SCHOOL_WIDE = "__school-wide__";

function priorityBadgeVariant(priority: AnnouncementPriority) {
  if (priority === "important") return "destructive" as const;
  if (priority === "reminder") return "warning" as const;
  if (priority === "update") return "secondary" as const;
  return "default" as const;
}

export function AnnouncementFormDialog({
  open,
  onOpenChange,
  announcement,
  courses,
  defaultSchoolId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Omit to create a new announcement. */
  announcement?: Announcement;
  courses: Course[];
  defaultSchoolId?: string | null;
}) {
  const mode = announcement ? "edit" : "create";
  const isPublished = announcement?.status === "published";

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<AnnouncementPriority>("normal");
  const [courseId, setCourseId] = useState<string>(SCHOOL_WIDE);
  const [view, setView] = useState<"form" | "preview">("form");

  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const publishAnnouncement = usePublishAnnouncement();

  const isSubmitting = createAnnouncement.isPending || updateAnnouncement.isPending || publishAnnouncement.isPending;

  useEffect(() => {
    if (!open) return;
    setTitle(announcement?.title ?? "");
    setBody(announcement?.body ?? "");
    setPriority(announcement?.priority ?? "normal");
    setCourseId(announcement?.course_id ?? SCHOOL_WIDE);
    setView("form");
  }, [open, announcement]);

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  function scopeFields() {
    return courseId === SCHOOL_WIDE
      ? { courseId: undefined, schoolId: defaultSchoolId ?? undefined }
      : { courseId, schoolId: undefined };
  }

  async function handleSaveDraft() {
    if (!canSubmit) return;
    const scope = scopeFields();
    if (!scope.courseId && !scope.schoolId) {
      toast.error("Select a course, or set your school in Settings, before creating an announcement.");
      return;
    }

    try {
      if (mode === "create") {
        await createAnnouncement.mutateAsync({ title, body, priority, ...scope });
        toast.success("Draft saved.");
      } else {
        await updateAnnouncement.mutateAsync({ id: announcement!.id, title, body, priority });
        toast.success(isPublished ? "Changes saved." : "Draft saved.");
      }
      onOpenChange(false);
    } catch {
      toast.error("Couldn't save. Try again.");
    }
  }

  async function handlePublish() {
    if (!canSubmit) return;
    const scope = scopeFields();
    if (!scope.courseId && !scope.schoolId) {
      toast.error("Select a course, or set your school in Settings, before creating an announcement.");
      return;
    }

    try {
      if (mode === "create") {
        const created = await createAnnouncement.mutateAsync({ title, body, priority, ...scope });
        await publishAnnouncement.mutateAsync(created.id);
      } else {
        await updateAnnouncement.mutateAsync({ id: announcement!.id, title, body, priority });
        if (!isPublished) await publishAnnouncement.mutateAsync(announcement!.id);
      }
      toast.success("Announcement published.");
      onOpenChange(false);
    } catch {
      toast.error("Couldn't publish. Try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New Announcement" : "Edit Announcement"}</DialogTitle>
          <DialogDescription>
            {view === "form" ? "Fill in the details below." : "This is how it will appear to students."}
          </DialogDescription>
        </DialogHeader>

        {view === "form" ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="announcement-title">Title</Label>
              <Input
                id="announcement-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Midterm exam schedule released"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="announcement-body">Message</Label>
              <Textarea
                id="announcement-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                placeholder="Write the announcement..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as AnnouncementPriority)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Audience</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SCHOOL_WIDE}>Whole school</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded-md border border-border p-4">
            <Badge variant={priorityBadgeVariant(priority)}>{priority.toUpperCase()}</Badge>
            <h3 className="text-body font-semibold text-foreground">{title || "Untitled announcement"}</h3>
            <p className="whitespace-pre-wrap text-body text-muted-foreground">{body || "Nothing written yet."}</p>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setView(view === "form" ? "preview" : "form")}
            disabled={isSubmitting}
          >
            {view === "form" ? "Preview" : "Back to editing"}
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            {!isPublished && (
              <Button type="button" variant="secondary" onClick={handleSaveDraft} disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Draft"}
              </Button>
            )}
            <Button type="button" onClick={handlePublish} disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Saving..." : isPublished ? "Save Changes" : "Publish"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
