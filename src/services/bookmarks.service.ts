import type { SupabaseClient } from "@supabase/supabase-js";
import type { BookmarkableType, Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

/**
 * Bookmarks API — Student Journey: bookmark courses / bookmarked
 * announcements (see User Flow Map). `bookmarkable_id` is a polymorphic
 * reference (not a DB foreign key) into either `courses` or `announcements`,
 * selected by `bookmarkable_type`. RLS scopes every operation to the
 * caller's own `user_id`.
 */
export const bookmarksService = {
  /** Lists a user's bookmarks, newest first, optionally filtered to one type ('course' | 'announcement'). */
  async listForUser(client: Client, userId: string, type?: BookmarkableType) {
    let query = client.from("bookmarks").select("*").eq("user_id", userId);
    if (type) query = query.eq("bookmarkable_type", type);
    return query.order("created_at", { ascending: false });
  },

  /** Bookmarks an item. Fails with a unique-violation if already bookmarked (unique on user_id + type + id). */
  async add(client: Client, userId: string, type: BookmarkableType, id: string) {
    return client
      .from("bookmarks")
      .insert({ user_id: userId, bookmarkable_type: type, bookmarkable_id: id })
      .select()
      .single();
  },

  /** Removes a bookmark by (user, type, id). No-op if it doesn't exist. */
  async remove(client: Client, userId: string, type: BookmarkableType, id: string) {
    return client
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("bookmarkable_type", type)
      .eq("bookmarkable_id", id);
  },
};
