import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

/** Notifications API. RLS scopes every operation to the notification's own `user_id` — users can only see/mutate their own notifications. */
export const notificationsService = {
  /** Lists a user's notifications, newest first. */
  async listForUser(client: Client, userId: string) {
    return client
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },

  /** Marks a single notification as read. */
  async markAsRead(client: Client, id: string) {
    return client.from("notifications").update({ is_read: true }).eq("id", id);
  },

  /** Marks every unread notification for a user as read in one call. */
  async markAllAsRead(client: Client, userId: string) {
    return client.from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false);
  },

  /** Deletes a notification by id. */
  async remove(client: Client, id: string) {
    return client.from("notifications").delete().eq("id", id);
  },
};
