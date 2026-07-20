import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

/**
 * Enrollments API. RLS scopes reads to the enrolled student, the course's
 * lecturer, or an admin; writes are restricted to the student themself (see
 * supabase/migrations/20260719000004_*.sql).
 */
export const enrollmentsService = {
  /** Lists a student's enrollments, newest first, each with its full course row embedded. */
  async listForUser(client: Client, userId: string) {
    return client
      .from("enrollments")
      .select("*, course:courses(*)")
      .eq("user_id", userId)
      .order("enrolled_at", { ascending: false });
  },

  /** Lists everyone enrolled in a course, with each student's public profile fields. Only visible to that course's lecturer or an admin (RLS). */
  async listForCourse(client: Client, courseId: string) {
    return client
      .from("enrollments")
      .select("*, student:profiles(id, full_name, avatar_url, matric_number)")
      .eq("course_id", courseId);
  },

  /** Enrolls `userId` in `courseId`. RLS requires `userId` to equal the caller — students can only enroll themselves. Fails with a unique-violation if already enrolled. */
  async enroll(client: Client, userId: string, courseId: string) {
    return client.from("enrollments").insert({ user_id: userId, course_id: courseId }).select().single();
  },

  /** Drops (deletes) an enrollment by id. */
  async drop(client: Client, enrollmentId: string) {
    return client.from("enrollments").delete().eq("id", enrollmentId);
  },
};
