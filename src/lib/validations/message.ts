import { z } from "zod";

export const createMessageSchema = z.object({
  courseId: z.string().uuid(),
  body: z.string().min(1).max(5000),
});
