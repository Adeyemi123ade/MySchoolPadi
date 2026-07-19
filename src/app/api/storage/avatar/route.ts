import type { NextRequest } from "next/server";
import { storageService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiError, apiErrorFromException, apiSuccess } from "@/lib/api/response";

/**
 * POST /api/storage/avatar — upload (or replace) the current user's avatar.
 * multipart/form-data body: `file` (binary).
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return apiError("file is required", 422);

    const { data, error } = await storageService.uploadAvatar(supabase, user.id, file);
    if (error) throw error;

    const { data: publicUrl } = storageService.getPublicAvatarUrl(supabase, data.path);

    return apiSuccess({ path: data.path, url: publicUrl.publicUrl });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
