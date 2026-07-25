import type { NextRequest } from "next/server";
import { profilesService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { updateProfileSchema } from "@/lib/validations/profile";

/** GET /api/profile — fetch the current user's own profile. */
export async function GET() {
  try {
    const { profile } = await requireUser();
    return apiSuccess(profile);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** PATCH /api/profile — update the current user's own profile (name, phone, department, avatar). */
export async function PATCH(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();
    const input = updateProfileSchema.parse(await request.json());

    const { data, error } = await profilesService.update(supabase, user.id, {
      full_name: input.fullName,
      phone_number: input.phoneNumber,
      department: input.department,
    });
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
