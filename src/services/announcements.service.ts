import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export const announcementsService = {
  async listPublished(client: Client, params?: { courseId?: string; schoolId?: string }) {
    let query = client
      .from("announcements")
      .select("*, author:profiles(id, full_name, avatar_url)")
      .eq("status", "published");

    if (params?.courseId) query = query.eq("course_id", params.courseId);
    if (params?.schoolId) query = query.eq("school_id", params.schoolId);

    return query.order("published_at", { ascending: false });
  },

  async listForAuthor(client: Client, authorId: string) {
    return client.from("announcements").select("*").eq("author_id", authorId).order("created_at", { ascending: false });
  },

  async getById(client: Client, id: string) {
    return client
      .from("announcements")
      .select("*, author:profiles(id, full_name, avatar_url)")
      .eq("id", id)
      .single();
  },

  async create(client: Client, input: TablesInsert<"announcements">) {
    return client.from("announcements").insert(input).select().single();
  },

  async update(client: Client, id: string, input: TablesUpdate<"announcements">) {
    return client.from("announcements").update(input).eq("id", id).select().single();
  },

  async publish(client: Client, id: string) {
    return client
      .from("announcements")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
  },

  async remove(client: Client, id: string) {
    return client.from("announcements").delete().eq("id", id);
  },
};
