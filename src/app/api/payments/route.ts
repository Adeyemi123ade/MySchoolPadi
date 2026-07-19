import type { NextRequest } from "next/server";
import { paymentsService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { createPaymentSchema } from "@/lib/validations/payment";

/** GET /api/payments — list the current user's own payment history, newest first. */
export async function GET() {
  try {
    const { supabase, user } = await requireUser();

    const { data, error } = await paymentsService.listForUser(supabase, user.id);
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/**
 * POST /api/payments — records a new payment attempt as `pending`.
 * This does not itself charge anything; a payment provider integration
 * (see README "Not yet built") is what would transition it to
 * success/failed via a trusted server-side webhook.
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();
    const input = createPaymentSchema.parse(await request.json());

    const { data, error } = await paymentsService.create(supabase, {
      user_id: user.id,
      course_id: input.courseId,
      amount: input.amount,
      currency: input.currency,
      provider: input.provider,
      provider_reference: input.providerReference,
    });
    if (error) throw error;

    return apiSuccess(data, 201);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
