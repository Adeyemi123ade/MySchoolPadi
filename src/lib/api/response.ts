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
 * PostgREST/Supabase errors -> 400/403/404 with a plain-language message
 *   mapped from the Postgres error *code* — never the raw driver message,
 *   which can contain constraint/column/table names no end user should see.
 * Anything else -> 500, with a generic message; the real error is logged
 *   server-side only.
 */
export function apiErrorFromException(error: unknown) {
  if (error instanceof ApiAuthError) {
    return apiError(error.message, error.status);
  }

  if (error instanceof ZodError) {
    return apiError("Please check the highlighted fields and try again.", 422, error.flatten());
  }

  if (isPostgrestError(error)) {
    const status = postgresStatus(error);
    if (status >= 500) console.error(error);
    return apiError(friendlyPostgresMessage(error), status);
  }

  console.error(error);
  return apiError("Something went wrong on our end. Please try again in a moment.", 500);
}

/** Maps a Postgres/PostgREST error *code* to a plain-language message — never echoes the driver's own message text. */
function friendlyPostgresMessage(error: PostgrestError): string {
  switch (error.code) {
    case "PGRST116":
      return "We couldn't find that.";
    case "42501":
      return "You don't have permission to do that.";
    case "23505":
      return "That already exists.";
    case "23503":
      return "That no longer exists — it may have been removed.";
    case "23502":
      return "Please fill in all required fields.";
    default:
      return "Something went wrong on our end. Please try again in a moment.";
  }
}

function postgresStatus(error: PostgrestError): number {
  switch (error.code) {
    case "PGRST116":
      return 404;
    case "42501":
      return 403;
    case "23505":
    case "23503":
    case "23502":
      return 400;
    default:
      return 500;
  }
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return typeof error === "object" && error !== null && "code" in error && "message" in error;
}
