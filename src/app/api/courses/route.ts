import type { NextRequest } from "next/server";
import { coursesService } from "@/services";
import { requireRole, requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { createCourseSchema } from "@/lib/validations/course";

/**
 * GET /api/courses?schoolId=&search= — list courses. Auth required, open to any role.
 * Pass `mine=1` to list only the current lecturer's own courses instead.
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();
    const { searchParams } = new URL(request.url);

    if (searchParams.get("mine") === "1") {
      const { data, error } = await coursesService.listForLecturer(supabase, user.id);
      if (error) throw error;
      return apiSuccess(data);
    }

    const { data, error } = await coursesService.list(supabase, {
      schoolId: searchParams.get("schoolId") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** POST /api/courses — create a course. Requires role 'lecturer' or 'admin'. */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireRole("lecturer", "admin");
    const input = createCourseSchema.parse(await request.json());

    const { data, error } = await coursesService.create(supabase, {
      code: input.code,
      title: input.title,
      description: input.description,
      school_id: input.schoolId,
      lecturer_id: user.id,
    });
    if (error) throw error;

    return apiSuccess(data, 201);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
