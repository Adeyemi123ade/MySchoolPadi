import type { NextRequest } from "next/server";
import { messagesService } from "@/services";
import { requireRole, requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { createMessageSchema } from "@/lib/validations/message";

/** GET /api/messages?courseId= — list messages visible to the caller (RLS-scoped). */
export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireUser();
    const { searchParams } = new URL(request.url);

    const { data, error } = await messagesService.list(supabase, {
      courseId: searchParams.get("courseId") ?? undefined,
    });
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** POST /api/messages — send a message to a course. Requires role 'lecturer' or 'admin'. */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireRole("lecturer", "admin");
    const input = createMessageSchema.parse(await request.json());

    const { data, error } = await messagesService.create(supabase, {
      course_id: input.courseId,
      body: input.body,
      author_id: user.id,
    });
    if (error) throw error;

    return apiSuccess(data, 201);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
