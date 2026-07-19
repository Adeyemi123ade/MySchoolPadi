import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { TablesInsert, TablesUpdate } from "@/types/database.types";

type Client = SupabaseClient<Database>;

/**
 * Courses API. Readable by any authenticated user; writes are restricted by
 * RLS to the course's own lecturer or an admin (see
 * supabase/migrations/20260719000003_schools_and_courses.sql).
 */
export const coursesService = {
  /** Lists courses, optionally filtered by school or a title search, newest first. Each row includes its lecturer's public profile fields. */
  async list(client: Client, params?: { schoolId?: string; search?: string }) {
    let query = client.from("courses").select("*, lecturer:profiles(id, full_name, avatar_url)");

    if (params?.schoolId) query = query.eq("school_id", params.schoolId);
    if (params?.search) query = query.ilike("title", `%${params.search}%`);

    return query.order("created_at", { ascending: false });
  },

  /** Fetches a single course by id, including its lecturer's public profile fields. */
  async getById(client: Client, id: string) {
    return client
      .from("courses")
      .select("*, lecturer:profiles(id, full_name, avatar_url)")
      .eq("id", id)
      .single();
  },

  /** Lists all courses owned by a given lecturer. */
  async listForLecturer(client: Client, lecturerId: string) {
    return client.from("courses").select("*").eq("lecturer_id", lecturerId).order("created_at", { ascending: false });
  },

  /** Creates a course. `lecturer_id` must equal the caller's id or RLS rejects the insert. */
  async create(client: Client, input: TablesInsert<"courses">) {
    return client.from("courses").insert(input).select().single();
  },

  /** Updates a course by id. Only the owning lecturer or an admin can succeed (RLS). */
  async update(client: Client, id: string, input: TablesUpdate<"courses">) {
    return client.from("courses").update(input).eq("id", id).select().single();
  },

  /** Deletes a course by id. Cascades to its enrollments and announcements (FK ON DELETE CASCADE). */
  async remove(client: Client, id: string) {
    return client.from("courses").delete().eq("id", id);
  },
};
