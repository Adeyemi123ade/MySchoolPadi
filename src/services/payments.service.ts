import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export const paymentsService = {
  async listForUser(client: Client, userId: string) {
    return client.from("payments").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  },

  async create(client: Client, input: TablesInsert<"payments">) {
    return client.from("payments").insert(input).select().single();
  },

  // Status transitions (pending -> success/failed) are applied by a trusted
  // payment-webhook Edge Function using the service role key, not client-side.
};
