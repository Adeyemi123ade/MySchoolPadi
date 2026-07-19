import type { NextRequest } from "next/server";
import { enrollmentsService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";

type Params = { params: Promise<{ id: string }> };

/** DELETE /api/enrollments/:id — drop an enrollment. RLS restricts this to the enrolled student or an admin. */
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();

    const { error } = await enrollmentsService.drop(supabase, id);
    if (error) throw error;

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
