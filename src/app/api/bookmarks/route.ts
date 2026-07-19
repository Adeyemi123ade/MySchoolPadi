import type { NextRequest } from "next/server";
import { bookmarksService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { bookmarkSchema } from "@/lib/validations/bookmark";
import type { BookmarkableType } from "@/types/database.types";

/** GET /api/bookmarks?type=course|announcement — list the current user's bookmarks, optionally filtered by type. */
export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") ?? undefined) as BookmarkableType | undefined;

    const { data, error } = await bookmarksService.listForUser(supabase, user.id, type);
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** POST /api/bookmarks — bookmark a course or announcement. Body: `{ type, id }`. */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();
    const { type, id } = bookmarkSchema.parse(await request.json());

    const { data, error } = await bookmarksService.add(supabase, user.id, type, id);
    if (error) throw error;

    return apiSuccess(data, 201);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** DELETE /api/bookmarks — remove a bookmark. Body: `{ type, id }`. */
export async function DELETE(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();
    const { type, id } = bookmarkSchema.parse(await request.json());

    const { error } = await bookmarksService.remove(supabase, user.id, type, id);
    if (error) throw error;

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
