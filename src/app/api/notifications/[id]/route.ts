import type { NextRequest } from "next/server";
import { notificationsService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/notifications/:id — marks a single notification as read. */
export async function PATCH(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();

    const { error } = await notificationsService.markAsRead(supabase, id);
    if (error) throw error;

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** DELETE /api/notifications/:id — deletes a notification. */
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();

    const { error } = await notificationsService.remove(supabase, id);
    if (error) throw error;

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
