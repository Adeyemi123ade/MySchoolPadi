import type { NextRequest } from "next/server";
import { enrollmentsService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { createEnrollmentSchema } from "@/lib/validations/enrollment";

/**
 * GET /api/enrollments — list the current user's own enrollments, with course details embedded.
 * Pass `courseId=` instead to list everyone enrolled in that course (the course's own lecturer/admin only — RLS-enforced).
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (courseId) {
      const { data, error } = await enrollmentsService.listForCourse(supabase, courseId);
      if (error) throw error;
      return apiSuccess(data);
    }

    const { data, error } = await enrollmentsService.listForUser(supabase, user.id);
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** POST /api/enrollments — enroll the current user in a course. */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();
    const { courseId } = createEnrollmentSchema.parse(await request.json());

    const { data, error } = await enrollmentsService.enroll(supabase, user.id, courseId);
    if (error) throw error;

    return apiSuccess(data, 201);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
