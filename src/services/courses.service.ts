import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { TablesInsert, TablesUpdate } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export const coursesService = {
  async list(client: Client, params?: { schoolId?: string; search?: string }) {
    let query = client.from("courses").select("*, lecturer:profiles(id, full_name, avatar_url)");

    if (params?.schoolId) query = query.eq("school_id", params.schoolId);
    if (params?.search) query = query.ilike("title", `%${params.search}%`);

    return query.order("created_at", { ascending: false });
  },

  async getById(client: Client, id: string) {
    return client
      .from("courses")
      .select("*, lecturer:profiles(id, full_name, avatar_url)")
      .eq("id", id)
      .single();
  },

  async listForLecturer(client: Client, lecturerId: string) {
    return client.from("courses").select("*").eq("lecturer_id", lecturerId).order("created_at", { ascending: false });
  },

  async create(client: Client, input: TablesInsert<"courses">) {
    return client.from("courses").insert(input).select().single();
  },

  async update(client: Client, id: string, input: TablesUpdate<"courses">) {
    return client.from("courses").update(input).eq("id", id).select().single();
  },

  async remove(client: Client, id: string) {
    return client.from("courses").delete().eq("id", id);
  },
};
