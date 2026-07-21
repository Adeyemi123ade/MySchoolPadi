import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authService } from "@/services";
import { apiError, apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { friendlyAuthErrorMessage } from "@/lib/api/friendly-auth-error";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { requireUser } from "@/lib/api/auth";

/**
 * POST /api/auth/reset-password — sets a new password.
 * Must be called with the temporary session established by clicking the
 * password-reset email link (Supabase sets this automatically when the
 * browser lands on the configured redirect URL), not a fresh login.
 */
export async function POST(request: NextRequest) {
  try {
    await requireUser();
    const { password } = resetPasswordSchema.parse(await request.json());
    const supabase = await createClient();

    const { error } = await authService.updatePassword(supabase, password);
    if (error) return apiError(friendlyAuthErrorMessage(error.message), 400);

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
