import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export const storageService = {
  async uploadCourseMaterial(client: Client, courseId: string, file: File, ownerId: string) {
    const path = `${courseId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await client.storage.from("course-materials").upload(path, file);
    if (uploadError) return { data: null, error: uploadError };

    const record: TablesInsert<"files"> = {
      owner_id: ownerId,
      course_id: courseId,
      bucket: "course-materials",
      path,
      mime_type: file.type,
      size_bytes: file.size,
    };

    return client.from("files").insert(record).select().single();
  },

  async listCourseFiles(client: Client, courseId: string) {
    return client.from("files").select("*").eq("course_id", courseId).order("created_at", { ascending: false });
  },

  async getSignedUrl(client: Client, bucket: string, path: string, expiresInSeconds = 3600) {
    return client.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  },

  async uploadAvatar(client: Client, userId: string, file: File) {
    const path = `${userId}/${file.name}`;
    return client.storage.from("avatars").upload(path, file, { upsert: true });
  },

  getPublicAvatarUrl(client: Client, path: string) {
    return client.storage.from("avatars").getPublicUrl(path);
  },
};
