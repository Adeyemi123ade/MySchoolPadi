import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/types/database.types";

type Client = SupabaseClient<Database>;

/**
 * Storage API. Wraps Supabase Storage (blobs) plus the `files` metadata
 * table together, since every uploaded object needs both. See
 * supabase/migrations/20260719000006_storage_buckets.sql for bucket-level
 * access rules (avatars: public read, owner write; course-materials:
 * gated by enrollment/lecturer/admin via the `files` table).
 */
export const storageService = {
  /**
   * Uploads a file into the private `course-materials` bucket under
   * `{courseId}/{timestamp}-{filename}` and records it in `files`. Only a
   * course's own lecturer or an admin may write to this bucket (RLS).
   */
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

  /** Lists file metadata for a course, newest first. Actual downloads go through getSignedUrl(). */
  async listCourseFiles(client: Client, courseId: string) {
    return client.from("files").select("*").eq("course_id", courseId).order("created_at", { ascending: false });
  },

  /** Issues a time-limited signed URL (default 1 hour) for a private object — required for the `course-materials` bucket, which has no public read access. */
  async getSignedUrl(client: Client, bucket: string, path: string, expiresInSeconds = 3600) {
    return client.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  },

  /** Uploads (or overwrites, via upsert) a user's avatar into the public `avatars` bucket, at `{userId}/{filename}`. */
  async uploadAvatar(client: Client, userId: string, file: File) {
    const path = `${userId}/${file.name}`;
    return client.storage.from("avatars").upload(path, file, { upsert: true });
  },

  /** Builds the public URL for an avatar path (the `avatars` bucket allows public read, unlike `course-materials`). */
  getPublicAvatarUrl(client: Client, path: string) {
    return client.storage.from("avatars").getPublicUrl(path);
  },
};
