import { notificationsService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";

/** GET /api/notifications — list the current user's own notifications, newest first. */
export async function GET() {
  try {
    const { supabase, user } = await requireUser();

    const { data, error } = await notificationsService.listForUser(supabase, user.id);
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
