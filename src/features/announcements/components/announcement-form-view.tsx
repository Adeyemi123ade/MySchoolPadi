"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatDistanceToNowStrict } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMyCourses } from "@/features/courses/hooks/use-courses";
import {
  useAnnouncement,
  useCreateAnnouncement,
  usePublishAnnouncement,
  useUpdateAnnouncement,
} from "@/features/announcements/hooks/use-announcements";
import { useAuth } from "@/hooks/use-auth";
import { announcementBadge } from "@/features/announcements/lib/badge";
import { ROUTES } from "@/constants/routes";
import type { AnnouncementPriority } from "@/types";

const PRIORITIES: { value: AnnouncementPriority; label: string }[] = [
  { value: "normal", label: "General Announcement" },
  { value: "important", label: "Important" },
  { value: "reminder", label: "Reminder" },
  { value: "update", label: "Update" },
];

const announcementFormSchema = z.object({
  courseId: z.string().uuid("Select a course"),
  audience: z.enum(["course", "school"]),
  priority: z.enum(["normal", "important", "reminder", "update"]),
  title: z.string().min(1, "Required").max(200),
  body: z.string().min(1, "Required").max(10000),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export function AnnouncementFormView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") ?? undefined;

  const { profile } = useAuth();
  const { data: courses, isLoading: loadingCourses } = useMyCourses();
  const { data: existing, isLoading: loadingExisting } = useAnnouncement(editId ?? "");
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const publishAnnouncement = usePublishAnnouncement();

  const [step, setStep] = useState<"form" | "preview">("form");
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: { courseId: "", audience: "course", priority: "normal", title: "", body: "" },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        courseId: existing.course_id ?? "",
        audience: existing.course_id ? "course" : "school",
        priority: existing.priority,
        title: existing.title,
        body: existing.body,
      });
    }
  }, [existing, form]);

  const values = form.watch();
  const selectedCourse = courses?.find((c) => c.id === values.courseId);

  async function persist(publish: boolean) {
    const valid = await form.trigger();
    if (!valid) {
      setStep("form");
      return;
    }
    setIsSaving(true);
    try {
      const input = {
        title: values.title,
        body: values.body,
        priority: values.priority,
        courseId: values.audience === "course" ? values.courseId : undefined,
        schoolId: values.audience === "school" ? (profile?.school_id ?? undefined) : undefined,
      };

      let id = editId;
      if (editId) {
        await updateAnnouncement.mutateAsync({
          id: editId,
          input: { title: input.title, body: input.body, priority: input.priority },
        });
      } else {
        const created = await createAnnouncement.mutateAsync(input);
        id = created.id;
      }

      if (publish && id) {
        await publishAnnouncement.mutateAsync(id);
      }

      router.push(id ? ROUTES.announcement(id) : ROUTES.announcements);
    } finally {
      setIsSaving(false);
    }
  }

  if (editId && loadingExisting) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (step === "preview") {
    const badge = announcementBadge({
      status: "draft",
      priority: values.priority,
      published_at: null,
      created_at: new Date().toISOString(),
    });

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <h1 className="text-h2 font-bold text-foreground">Preview Announcement</h1>

        <div className="flex flex-col gap-4 rounded-lg border border-border p-6">
          <Badge variant={badge.variant}>{badge.label}</Badge>
          <h2 className="text-h3 font-bold text-foreground">{values.title || "Untitled announcement"}</h2>
          <p className="text-caption text-muted-foreground">
            {profile?.full_name} &middot; {formatDistanceToNowStrict(new Date(), { addSuffix: true })}
          </p>
          <p className="whitespace-pre-wrap text-body text-foreground">{values.body}</p>

          <div className="flex flex-col gap-1 border-t border-border pt-4 text-caption text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Course:</span>{" "}
              {values.audience === "course" ? (selectedCourse ? `${selectedCourse.code} — ${selectedCourse.title}` : "—") : "All students at my school"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setStep("form")}>
            Edit
          </Button>
          <Button variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <div className="flex-1" />
          <Button onClick={() => persist(true)} disabled={isSaving}>
            {isSaving ? "Publishing..." : "Publish Announcement"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-bold text-foreground">{editId ? "Edit Announcement" : "Create Announcement"}</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => persist(false)} disabled={isSaving}>
            Save Draft
          </Button>
          <Button onClick={() => form.trigger().then((valid) => valid && setStep("preview"))}>Preview</Button>
        </div>
      </div>

      <Form {...form}>
        <form className="flex flex-col gap-4 rounded-lg border border-border p-6">
          <FormField
            control={form.control}
            name="audience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send To</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="course">This course</SelectItem>
                    <SelectItem value="school">All students at my school</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {values.audience === "course" && (
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Course</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={loadingCourses}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.code} — {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Announcement Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Lecture Venue Change for CSC 301" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea rows={6} placeholder="Write your announcement..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <p className="text-body text-foreground">Schedule for Later</p>
              <p className="text-caption text-muted-foreground">Coming soon — publishes immediately for now</p>
            </div>
            <Switch disabled checked={false} />
          </div>
        </form>
      </Form>
    </div>
  );
}
