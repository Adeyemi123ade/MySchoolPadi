import type { NextRequest } from "next/server";
import { coursesService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiError, apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { updateCourseSchema } from "@/lib/validations/course";

type Params = { params: Promise<{ id: string }> };

/** GET /api/courses/:id — fetch a single course. */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();

    const { data, error } = await coursesService.getById(supabase, id);
    if (error) throw error;
    if (!data) return apiError("Not found", 404);

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** PATCH /api/courses/:id — update a course. RLS restricts this to the owning lecturer or an admin. */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();
    const input = updateCourseSchema.parse(await request.json());

    const { data, error } = await coursesService.update(supabase, id, {
      code: input.code,
      title: input.title,
      description: input.description,
      school_id: input.schoolId,
    });
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** DELETE /api/courses/:id — delete a course. RLS restricts this to the owning lecturer or an admin. */
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();

    const { error } = await coursesService.remove(supabase, id);
    if (error) throw error;

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
