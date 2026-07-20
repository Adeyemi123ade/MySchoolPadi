import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authService } from "@/services";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { resendVerificationSchema } from "@/lib/validations/auth";

/** POST /api/auth/resend-verification — re-sends the 6-digit signup verification code. */
export async function POST(request: NextRequest) {
  try {
    const { email } = resendVerificationSchema.parse(await request.json());
    const supabase = await createClient();

    await authService.resendVerification(supabase, email);

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
