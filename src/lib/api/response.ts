import { NextResponse } from "next/server";
import type { PostgrestError } from "@supabase/supabase-js";
import { ZodError } from "zod";
import { ApiAuthError } from "./auth";

/** Standard success envelope for every /api/* route. */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

/** Standard error envelope: { error: { message, details? } }. */
export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: { message, details } }, { status });
}

/**
 * Maps a caught error to a consistent API error response.
 * Zod validation errors -> 422 with field details.
 * PostgREST/Supabase errors -> 400/403/404 based on the error code.
 * Anything else -> 500, without leaking internals to the client.
 */
export function apiErrorFromException(error: unknown) {
  if (error instanceof ApiAuthError) {
    return apiError(error.message, error.status);
  }

  if (error instanceof ZodError) {
    return apiError("Validation failed", 422, error.flatten());
  }

  if (isPostgrestError(error)) {
    if (error.code === "PGRST116") return apiError("Not found", 404);
    if (error.code === "42501") return apiError("Forbidden", 403);
    return apiError(error.message, 400);
  }

  console.error(error);
  return apiError("Internal server error", 500);
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return typeof error === "object" && error !== null && "code" in error && "message" in error;
}
