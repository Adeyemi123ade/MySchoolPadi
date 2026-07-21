import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/types/database.types";

type Client = SupabaseClient<Database>;

/**
 * Announcements API — Lecturer Journey: Create -> Preview -> Publish/Edit
 * (see User Flow Map). Published announcements are readable by any
 * authenticated user; drafts are only visible to their author or an admin.
 * Writes are restricted to the author or an admin (RLS).
 */
export const announcementsService = {
  /** Lists published announcements, newest-published-first, optionally scoped to a course or school. Author's public profile fields are embedded. */
  async listPublished(client: Client, params?: { courseId?: string; schoolId?: string }) {
    let query = client
      .from("announcements")
      .select("*, author:profiles(id, full_name, avatar_url, department)")
      .eq("status", "published");

    if (params?.courseId) query = query.eq("course_id", params.courseId);
    if (params?.schoolId) query = query.eq("school_id", params.schoolId);

    return query.order("published_at", { ascending: false });
  },

  /** Lists all announcements (draft + published) authored by a given lecturer, newest first. Used for the lecturer's own management view. */
  async listForAuthor(client: Client, authorId: string) {
    return client.from("announcements").select("*").eq("author_id", authorId).order("created_at", { ascending: false });
  },

  /** Fetches a single announcement by id, with the author's public profile fields embedded. */
  async getById(client: Client, id: string) {
    return client
      .from("announcements")
      .select("*, author:profiles(id, full_name, avatar_url, department)")
      .eq("id", id)
      .single();
  },

  /** Creates an announcement. Defaults to `status: 'draft'` unless overridden; `author_id` must equal the caller (RLS). */
  async create(client: Client, input: TablesInsert<"announcements">) {
    return client.from("announcements").insert(input).select().single();
  },

  /** Updates an announcement's editable fields (title/body/priority, etc). Does not change `status` — use publish() for that transition. */
  async update(client: Client, id: string, input: TablesUpdate<"announcements">) {
    return client.from("announcements").update(input).eq("id", id).select().single();
  },

  /** Transitions an announcement from draft to published and stamps `published_at`. */
  async publish(client: Client, id: string) {
    return client
      .from("announcements")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
  },

  /** Deletes an announcement by id. */
  async remove(client: Client, id: string) {
    return client.from("announcements").delete().eq("id", id);
  },
};
