"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateCourse } from "@/features/courses/hooks/use-courses";
import { useAuth } from "@/hooks/use-auth";

const createCourseFormSchema = z.object({
  code: z.string().min(1, "Required").max(20),
  title: z.string().min(1, "Required").max(200),
  description: z.string().max(2000).optional(),
});

type CreateCourseValues = z.infer<typeof createCourseFormSchema>;

export function CreateCourseDialog() {
  const [open, setOpen] = useState(false);
  const { profile } = useAuth();
  const createCourse = useCreateCourse();

  const form = useForm<CreateCourseValues>({
    resolver: zodResolver(createCourseFormSchema),
    defaultValues: { code: "", title: "", description: "" },
  });

  function onSubmit(values: CreateCourseValues) {
    if (!profile?.school_id) return;
    createCourse.mutate(
      { ...values, schoolId: profile.school_id },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Course
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a course</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CSC 301" {...field} />
                  </FormControl>
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
                    <Input placeholder="e.g. Data Structures" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCourse.isPending}>
                {createCourse.isPending ? "Creating..." : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
