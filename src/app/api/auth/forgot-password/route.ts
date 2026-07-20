import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authService } from "@/services";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { forgotPasswordSchema } from "@/lib/validations/auth";

/**
 * POST /api/auth/forgot-password — sends a password-reset email.
 * Always returns success even if the email doesn't exist, to avoid leaking
 * which addresses are registered.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = forgotPasswordSchema.parse(await request.json());
    const supabase = await createClient();

    // /reset-password is the landing page the email link points to (not yet built — see README "Not yet built").
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`;
    await authService.requestPasswordReset(supabase, email, redirectTo);

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
