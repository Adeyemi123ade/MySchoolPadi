import type { NextRequest } from "next/server";
import { announcementsService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiError, apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { updateAnnouncementSchema } from "@/lib/validations/announcement";

type Params = { params: Promise<{ id: string }> };

/** GET /api/announcements/:id — fetch a single announcement. RLS hides drafts from non-authors. */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();

    const { data, error } = await announcementsService.getById(supabase, id);
    if (error) throw error;
    if (!data) return apiError("Not found", 404);

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** PATCH /api/announcements/:id — update title/body/priority. RLS restricts this to the author or an admin. */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();
    const input = updateAnnouncementSchema.parse(await request.json());

    const { data, error } = await announcementsService.update(supabase, id, input);
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** DELETE /api/announcements/:id — delete an announcement. RLS restricts this to the author or an admin. */
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();

    const { error } = await announcementsService.remove(supabase, id);
    if (error) throw error;

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
