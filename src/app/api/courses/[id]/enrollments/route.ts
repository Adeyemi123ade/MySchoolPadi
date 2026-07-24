import type { NextRequest } from "next/server";
import { enrollmentsService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";

type Params = { params: Promise<{ id: string }> };

/** GET /api/courses/:id/enrollments — list students enrolled in a course. RLS restricts this to the course's own lecturer or an admin. */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();

    const { data, error } = await enrollmentsService.listForCourse(supabase, id);
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
