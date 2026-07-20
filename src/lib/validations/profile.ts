import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(120).optional(),
  phoneNumber: z.string().min(7).max(20).optional(),
});
