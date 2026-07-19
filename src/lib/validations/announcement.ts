import { z } from "zod";

export const createAnnouncementSchema = z
  .object({
    title: z.string().min(1).max(200),
    body: z.string().min(1).max(10000),
    courseId: z.string().uuid().optional(),
    schoolId: z.string().uuid().optional(),
    priority: z.enum(["normal", "important", "reminder", "update"]).optional(),
  })
  .refine((val) => val.courseId || val.schoolId, {
    message: "Either courseId or schoolId is required",
    path: ["courseId"],
  });

export const updateAnnouncementSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(1).max(10000).optional(),
  priority: z.enum(["normal", "important", "reminder", "update"]).optional(),
});
