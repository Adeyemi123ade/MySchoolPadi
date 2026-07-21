import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/types/database.types";

type Client = SupabaseClient<Database>;

/**
 * Messages API — a lecturer broadcasting to everyone enrolled in one of
 * their own courses. RLS alone determines visibility (course's lecturer,
 * enrolled students, or an admin), so `list()` never needs to re-derive
 * "my courses" client-side — the database already scopes the rows.
 */
export const messagesService = {
  /** Lists messages visible to the caller, newest first, optionally scoped to a course. */
  async list(client: Client, params?: { courseId?: string }) {
    let query = client
      .from("messages")
      .select("*, author:profiles(id, full_name, avatar_url), course:courses(id, code, title)");

    if (params?.courseId) query = query.eq("course_id", params.courseId);

    return query.order("created_at", { ascending: false });
  },

  /** Sends a message. `author_id` must equal the caller and own the course (RLS). */
  async create(client: Client, input: TablesInsert<"messages">) {
    return client.from("messages").insert(input).select().single();
  },

  /** Deletes a message by id. Only its author or an admin can succeed (RLS). */
  async remove(client: Client, id: string) {
    return client.from("messages").delete().eq("id", id);
  },
};
