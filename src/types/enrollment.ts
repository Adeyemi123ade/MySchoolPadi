import type { Tables } from "./database.types";
import type { Course } from "./course";

export type Enrollment = Tables<"enrollments">;

export type EnrollmentWithCourse = Enrollment & {
  course: Course;
};
