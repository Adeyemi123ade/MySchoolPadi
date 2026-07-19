import type { SupabaseClient } from "@supabase/supabase-js";
import type { BookmarkableType, Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export const bookmarksService = {
  async listForUser(client: Client, userId: string, type?: BookmarkableType) {
    let query = client.from("bookmarks").select("*").eq("user_id", userId);
    if (type) query = query.eq("bookmarkable_type", type);
    return query.order("created_at", { ascending: false });
  },

  async add(client: Client, userId: string, type: BookmarkableType, id: string) {
    return client
      .from("bookmarks")
      .insert({ user_id: userId, bookmarkable_type: type, bookmarkable_id: id })
      .select()
      .single();
  },

  async remove(client: Client, userId: string, type: BookmarkableType, id: string) {
    return client
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("bookmarkable_type", type)
      .eq("bookmarkable_id", id);
  },
};
