/**
 * Hand-authored to mirror supabase/migrations/*.sql until the schema is applied
 * to the live project and regenerated with:
 *   supabase gen types typescript --project-id <ref> > src/types/database.types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "student" | "lecturer" | "admin";
export type EnrollmentStatus = "active" | "completed" | "dropped";
export type AnnouncementPriority = "normal" | "important" | "reminder" | "update";
export type AnnouncementStatus = "draft" | "published";
export type NotificationType = "announcement" | "enrollment" | "payment" | "system";
export type BookmarkableType = "course" | "announcement";
export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          school_id: string | null;
          phone_number: string | null;
          matric_number: string | null;
          department: string | null;
          staff_id: string | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          school_id?: string | null;
          phone_number?: string | null;
          matric_number?: string | null;
          department?: string | null;
          staff_id?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      schools: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          owner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["schools"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          code: string;
          title: string;
          description: string | null;
          school_id: string;
          lecturer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          title: string;
          description?: string | null;
          school_id: string;
          lecturer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "courses_lecturer_id_fkey";
            columns: ["lecturer_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          status: EnrollmentStatus;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          status?: EnrollmentStatus;
          enrolled_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["enrollments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      announcements: {
        Row: {
          id: string;
          course_id: string | null;
          school_id: string | null;
          author_id: string;
          title: string;
          body: string;
          priority: AnnouncementPriority;
          status: AnnouncementStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id?: string | null;
          school_id?: string | null;
          author_id: string;
          title: string;
          body: string;
          priority?: AnnouncementPriority;
          status?: AnnouncementStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          body: string | null;
          link: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type?: NotificationType;
          title: string;
          body?: string | null;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          bookmarkable_type: BookmarkableType;
          bookmarkable_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bookmarkable_type: BookmarkableType;
          bookmarkable_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookmarks"]["Insert"]>;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string | null;
          amount: number;
          currency: string;
          status: PaymentStatus;
          provider: string | null;
          provider_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id?: string | null;
          amount: number;
          currency?: string;
          status?: PaymentStatus;
          provider?: string | null;
          provider_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [];
      };
      files: {
        Row: {
          id: string;
          owner_id: string;
          course_id: string | null;
          bucket: string;
          path: string;
          mime_type: string | null;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          course_id?: string | null;
          bucket: string;
          path: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["files"]["Insert"]>;
        Relationships: [];
      };
    };
    Enums: {
      user_role: UserRole;
      enrollment_status: EnrollmentStatus;
      announcement_priority: AnnouncementPriority;
      announcement_status: AnnouncementStatus;
      notification_type: NotificationType;
      bookmarkable_type: BookmarkableType;
      payment_status: PaymentStatus;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
