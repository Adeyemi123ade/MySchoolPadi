import { z } from "zod";

export const createCourseSchema = z.object({
  code: z.string().min(1).max(20),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  schoolId: z.string().uuid(),
});

export const updateCourseSchema = createCourseSchema.partial();
