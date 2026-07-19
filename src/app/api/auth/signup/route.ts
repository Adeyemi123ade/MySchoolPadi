import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authService } from "@/services";
import { apiError, apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { signUpSchema } from "@/lib/validations/auth";

/** POST /api/auth/signup — register a new user (defaults to role 'student'). */
export async function POST(request: NextRequest) {
  try {
    const input = signUpSchema.parse(await request.json());
    const supabase = await createClient();

    const { data, error } = await authService.signUp(supabase, input);
    if (error) return apiError(error.message, 400);

    return apiSuccess({ user: data.user, session: data.session }, 201);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
