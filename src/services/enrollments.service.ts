import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export const enrollmentsService = {
  async listForUser(client: Client, userId: string) {
    return client
      .from("enrollments")
      .select("*, course:courses(*)")
      .eq("user_id", userId)
      .order("enrolled_at", { ascending: false });
  },

  async listForCourse(client: Client, courseId: string) {
    return client
      .from("enrollments")
      .select("*, student:profiles(id, full_name, avatar_url)")
      .eq("course_id", courseId);
  },

  async enroll(client: Client, userId: string, courseId: string) {
    return client.from("enrollments").insert({ user_id: userId, course_id: courseId }).select().single();
  },

  async drop(client: Client, enrollmentId: string) {
    return client.from("enrollments").delete().eq("id", enrollmentId);
  },
};
