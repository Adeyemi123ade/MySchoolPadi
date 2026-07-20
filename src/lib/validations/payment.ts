import { z } from "zod";

export const createPaymentSchema = z.object({
  courseId: z.string().uuid().optional(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("NGN"),
  provider: z.string().min(1).optional(),
  providerReference: z.string().min(1).optional(),
});
