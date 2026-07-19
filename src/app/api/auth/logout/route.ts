import { createClient } from "@/lib/supabase/server";
import { authService } from "@/services";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";

/** POST /api/auth/logout — clears the current session. */
export async function POST() {
  try {
    const supabase = await createClient();
    await authService.signOut(supabase);
    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
