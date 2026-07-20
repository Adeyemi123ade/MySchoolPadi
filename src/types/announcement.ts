import type { Tables } from "./database.types";
import type { Profile } from "./profile";

export type Announcement = Tables<"announcements">;

export type AnnouncementWithAuthor = Announcement & {
  author: Pick<Profile, "id" | "full_name" | "avatar_url" | "department">;
};
