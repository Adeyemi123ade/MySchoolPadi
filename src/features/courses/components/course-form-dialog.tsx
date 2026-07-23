"use client";

import { useState } from "react";
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
import { useCreateCourse } from "@/features/courses/hooks/use-course-mutations";

export function CourseFormDialog({
  open,
  onOpenChange,
  schoolId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId?: string | null;
}) {
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createCourse = useCreateCourse();

  const canSubmit = code.trim().length > 0 && title.trim().length > 0;

  function reset() {
    setCode("");
    setTitle("");
    setDescription("");
  }

  async function handleCreate() {
    if (!canSubmit) return;
    if (!schoolId) {
      toast.error("Set your school in Settings before creating a course.");
      return;
    }

    try {
      await createCourse.mutateAsync({ code, title, description: description || undefined, schoolId });
      toast.success("Course created.");
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Couldn't create the course. Try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Course</DialogTitle>
          <DialogDescription>Add a course you teach.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="course-code">Course Code</Label>
            <Input id="course-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="CSC301" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="course-title">Title</Label>
            <Input
              id="course-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Data Structures and Algorithms"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="course-description">Description (optional)</Label>
            <Textarea
              id="course-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={createCourse.isPending}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCreate} disabled={!canSubmit || createCourse.isPending}>
            {createCourse.isPending ? "Creating..." : "Create Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
