import type { Tables } from "./database.types";
import type { Profile } from "./profile";
import type { Course } from "./course";

export type Message = Tables<"messages">;

export type MessageWithDetails = Message & {
  author: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
  course: Pick<Course, "id" | "code" | "title"> | null;
};
