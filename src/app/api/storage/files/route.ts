import type { NextRequest } from "next/server";
import { storageService } from "@/services";
import { requireRole, requireUser } from "@/lib/api/auth";
import { apiError, apiErrorFromException, apiSuccess } from "@/lib/api/response";

/** GET /api/storage/files?courseId= — list file metadata for a course. Actual downloads use a signed URL, not this endpoint. */
export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireUser();
    const courseId = new URL(request.url).searchParams.get("courseId");
    if (!courseId) return apiError("courseId query param is required", 422);

    const { data, error } = await storageService.listCourseFiles(supabase, courseId);
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/**
 * POST /api/storage/files — upload a course material.
 * multipart/form-data body: `file` (binary), `courseId` (string).
 * Requires role 'lecturer' or 'admin' (mirrors the storage.objects RLS policy).
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireRole("lecturer", "admin");

    const form = await request.formData();
    const file = form.get("file");
    const courseId = form.get("courseId");

    if (!(file instanceof File)) return apiError("file is required", 422);
    if (typeof courseId !== "string" || !courseId) return apiError("courseId is required", 422);

    const { data, error } = await storageService.uploadCourseMaterial(supabase, courseId, file, user.id);
    if (error) throw error;

    return apiSuccess(data, 201);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
