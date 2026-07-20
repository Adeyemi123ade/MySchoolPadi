import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

/** Schools API. Readable by anyone, including signed-out visitors (needed for the registration school picker). Writes restricted to admins (RLS). */
export const schoolsService = {
  /** Lists all schools, alphabetically, for use in a picker. */
  async list(client: Client) {
    return client.from("schools").select("id, name").order("name", { ascending: true });
  },
};
