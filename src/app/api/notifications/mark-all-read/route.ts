import { notificationsService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";

/** POST /api/notifications/mark-all-read — marks every unread notification for the current user as read. */
export async function POST() {
  try {
    const { supabase, user } = await requireUser();

    const { error } = await notificationsService.markAllAsRead(supabase, user.id);
    if (error) throw error;

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
