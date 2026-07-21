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

  /**
   * Lists all courses owned by a given lecturer, each annotated with its real
   * enrolled-student count (a second query over `enrollments`, since a typed
   * count-aggregate embed doesn't infer cleanly through the generated client
   * types). Used by Course Management — replaces any notion of a fabricated
   * "engagement %" with an honest, queryable number.
   */
  async listForLecturer(client: Client, lecturerId: string) {
    const { data: courses, error } = await client
      .from("courses")
      .select("*")
      .eq("lecturer_id", lecturerId)
      .order("created_at", { ascending: false });
    if (error || !courses) return { data: courses, error };
    if (courses.length === 0) return { data: [] as (typeof courses[number] & { enrolled_count: number })[], error: null };

    const courseIds = courses.map((c) => c.id);
    const { data: enrollments } = await client.from("enrollments").select("course_id").in("course_id", courseIds);

    const counts = new Map<string, number>();
    for (const e of enrollments ?? []) counts.set(e.course_id, (counts.get(e.course_id) ?? 0) + 1);

    return {
      data: courses.map((c) => ({ ...c, enrolled_count: counts.get(c.id) ?? 0 })),
      error: null,
    };
  },

  /** Looks up a single course by its exact code within a school (course codes are unique per school, not globally). Used by the "Join with Course Code" flow. */
  async getByCode(client: Client, schoolId: string, code: string) {
    return client
      .from("courses")
      .select("*, lecturer:profiles(id, full_name, avatar_url)")
      .eq("school_id", schoolId)
      .ilike("code", code)
      .maybeSingle();
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
