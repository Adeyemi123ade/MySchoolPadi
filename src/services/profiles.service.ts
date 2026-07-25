import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesUpdate } from "@/types/database.types";

type Client = SupabaseClient<Database>;

/** Profiles API. RLS restricts writes to the profile's own owner or an admin. */
export const profilesService = {
  /** Updates a profile's editable fields (name, phone, department, avatar, etc). */
  async update(client: Client, id: string, input: TablesUpdate<"profiles">) {
    return client.from("profiles").update(input).eq("id", id).select().single();
  },
};
