import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/types/database.types";

type Client = SupabaseClient<Database>;

/**
 * Payments API. RLS scopes reads to the paying user or an admin; users may
 * only insert payments for themselves and always as `status: 'pending'`.
 */
export const paymentsService = {
  /** Lists a user's payments, newest first. */
  async listForUser(client: Client, userId: string) {
    return client.from("payments").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  },

  /**
   * Records a new payment attempt as `pending`. `user_id` must equal the
   * caller (RLS). The pending -> success/failed/refunded transition happens
   * out-of-band, via a trusted payment-provider webhook Edge Function using
   * the service role key — not by the client directly.
   */
  async create(client: Client, input: TablesInsert<"payments">) {
    return client.from("payments").insert(input).select().single();
  },
};
