import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authService } from "@/services";
import { apiError, apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { signInSchema } from "@/lib/validations/auth";

/** POST /api/auth/login — sign in with email + password. Sets the session cookie via @supabase/ssr. */
export async function POST(request: NextRequest) {
  try {
    const input = signInSchema.parse(await request.json());
    const supabase = await createClient();

    const { data, error } = await authService.signIn(supabase, input);
    if (error) return apiError(error.message, 401);

    return apiSuccess({ user: data.user, session: data.session });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
