import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database.types";

export class ApiAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Resolves the authenticated user for the current request (via the Supabase
 * session cookie) plus their profile. Throws ApiAuthError(401) if there is
 * no session, so route handlers can `await requireUser()` without an
 * explicit null-check.
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new ApiAuthError("Unauthorized", 401);

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error || !profile) throw new ApiAuthError("Profile not found", 404);

  return { supabase, user, profile };
}

/** Same as requireUser(), but additionally requires one of `roles`. Throws ApiAuthError(403) otherwise. */
export async function requireRole(...roles: UserRole[]) {
  const ctx = await requireUser();
  if (!roles.includes(ctx.profile.role)) {
    throw new ApiAuthError("Forbidden", 403);
  }
  return ctx;
}
