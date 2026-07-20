import type { Tables } from "./database.types";
import type { Profile } from "./profile";

export type Course = Tables<"courses">;

export type CourseWithLecturer = Course & {
  lecturer: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
  enrolled_count?: number;
};
