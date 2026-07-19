import type { NextRequest } from "next/server";
import { announcementsService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";

type Params = { params: Promise<{ id: string }> };

/** POST /api/announcements/:id/publish — transitions a draft announcement to published. RLS restricts this to the author or an admin. */
export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();

    const { data, error } = await announcementsService.publish(supabase, id);
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
