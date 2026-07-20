import { createClient } from "@/lib/supabase/server";
import { schoolsService } from "@/services";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";

/** GET /api/schools — list schools for a picker. Public; no auth required (used during registration). */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await schoolsService.list(supabase);
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
