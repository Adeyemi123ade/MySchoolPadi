import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authService } from "@/services";
import { apiError, apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { verifyEmailSchema } from "@/lib/validations/auth";

/** POST /api/auth/verify-email — verifies the 6-digit signup code and activates the account. Sets the session cookie on success. */
export async function POST(request: NextRequest) {
  try {
    const { email, token } = verifyEmailSchema.parse(await request.json());
    const supabase = await createClient();

    const { data, error } = await authService.verifyEmailOtp(supabase, email, token);
    if (error) return apiError(error.message, 400);

    return apiSuccess({ user: data.user, session: data.session });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
