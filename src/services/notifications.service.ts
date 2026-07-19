import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export const notificationsService = {
  async listForUser(client: Client, userId: string) {
    return client
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },

  async markAsRead(client: Client, id: string) {
    return client.from("notifications").update({ is_read: true }).eq("id", id);
  },

  async markAllAsRead(client: Client, userId: string) {
    return client.from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false);
  },

  async remove(client: Client, id: string) {
    return client.from("notifications").delete().eq("id", id);
  },
};
