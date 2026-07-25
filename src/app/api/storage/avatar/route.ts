import type { NextRequest } from "next/server";
import { storageService, profilesService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiError, apiErrorFromException, apiSuccess } from "@/lib/api/response";

/**
 * POST /api/storage/avatar — upload (or replace) the current user's avatar,
 * and persist the resulting public URL onto their profile.
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

    const { error: profileError } = await profilesService.update(supabase, user.id, {
      avatar_url: publicUrl.publicUrl,
    });
    if (profileError) throw profileError;

    return apiSuccess({ path: data.path, url: publicUrl.publicUrl });
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** DELETE /api/storage/avatar — remove the current user's avatar (clears the profile field). */
export async function DELETE() {
  try {
    const { supabase, user } = await requireUser();

    const { error } = await profilesService.update(supabase, user.id, { avatar_url: null });
    if (error) throw error;

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
