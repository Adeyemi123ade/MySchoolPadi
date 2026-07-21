import type { NextRequest } from "next/server";
import { authService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { updateProfileSchema } from "@/lib/validations/profile";

/** PATCH /api/profile — updates the current user's own profile (full name, phone number). RLS restricts this to the caller's own row. */
export async function PATCH(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();
    const input = updateProfileSchema.parse(await request.json());

    const { data, error } = await authService.updateProfile(supabase, user.id, {
      full_name: input.fullName,
      phone_number: input.phoneNumber,
    });
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
