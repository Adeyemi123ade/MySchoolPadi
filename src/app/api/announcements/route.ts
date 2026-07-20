import type { NextRequest } from "next/server";
import { announcementsService } from "@/services";
import { requireRole, requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";
import { createAnnouncementSchema } from "@/lib/validations/announcement";

/**
 * GET /api/announcements?courseId=&schoolId= — list published announcements.
 * Pass `mine=1` instead to list the current lecturer's own announcements
 * (drafts included).
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();
    const { searchParams } = new URL(request.url);

    if (searchParams.get("mine") === "1") {
      const { data, error } = await announcementsService.listForAuthor(supabase, user.id);
      if (error) throw error;
      return apiSuccess(data);
    }

    const { data, error } = await announcementsService.listPublished(supabase, {
      courseId: searchParams.get("courseId") ?? undefined,
      schoolId: searchParams.get("schoolId") ?? undefined,
    });
    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    return apiErrorFromException(error);
  }
}

/** POST /api/announcements — create a draft announcement. Requires role 'lecturer' or 'admin'. */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireRole("lecturer", "admin");
    const input = createAnnouncementSchema.parse(await request.json());

    const { data, error } = await announcementsService.create(supabase, {
      title: input.title,
      body: input.body,
      course_id: input.courseId,
      school_id: input.schoolId,
      priority: input.priority,
      author_id: user.id,
    });
    if (error) throw error;

    return apiSuccess(data, 201);
  } catch (error) {
    return apiErrorFromException(error);
  }
}
