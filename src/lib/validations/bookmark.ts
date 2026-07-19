import { z } from "zod";

export const bookmarkSchema = z.object({
  type: z.enum(["course", "announcement"]),
  id: z.string().uuid(),
});
