import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, UserRole } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  phoneNumber?: string;
  schoolId?: string;
  /** Student-only — matriculation/registration number. */
  matricNumber?: string;
  /** Lecturer-only. */
  department?: string;
  /** Lecturer-only — staff/employee number. */
  staffId?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

/**
 * Auth API. Thin wrapper over Supabase Auth (GoTrue) — used by both
 * `/api/auth/*` route handlers and client components. Session state itself
 * lives in Supabase-managed cookies (see lib/supabase/{client,server}.ts),
 * not in this service.
 */
export const authService = {
  /**
   * Creates an auth user and, via the `handle_new_user` DB trigger, a
   * matching `profiles` row (including the role-specific fields below).
   * Sends a 6-digit email OTP; the user is not fully active until
   * verifyEmailOtp() succeeds.
   * @returns `{ data: { user, session }, error }`. `session` is null until email is verified.
   */
  async signUp(client: Client, input: SignUpInput) {
    return client.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
          role: input.role ?? "student",
          phone_number: input.phoneNumber,
          school_id: input.schoolId,
          matric_number: input.matricNumber,
          department: input.department,
          staff_id: input.staffId,
        },
      },
    });
  },

  /** Signs in with email + password. @returns `{ data: { user, session }, error }`. */
  async signIn(client: Client, input: SignInInput) {
    return client.auth.signInWithPassword(input);
  },

  /** Starts the Google OAuth sign-in redirect. Requires the Google provider to be enabled in Supabase Auth settings. */
  async signInWithGoogle(client: Client, redirectTo: string) {
    return client.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
  },

  /** Clears the current session and its cookies. */
  async signOut(client: Client) {
    return client.auth.signOut();
  },

  /** Reads the current session from cookies, without a round trip to Supabase Auth. */
  async getSession(client: Client) {
    return client.auth.getSession();
  },

  /** Revalidates the current user against Supabase Auth (safe to trust in server contexts, unlike getSession()). */
  async getCurrentUser(client: Client) {
    return client.auth.getUser();
  },

  /** Verifies the 6-digit code sent to `email` on signup, completing account activation. Returns a session on success. */
  async verifyEmailOtp(client: Client, email: string, token: string) {
    return client.auth.verifyOtp({ email, token, type: "signup" });
  },

  /** Re-sends the signup verification code. */
  async resendVerification(client: Client, email: string) {
    return client.auth.resend({ type: "signup", email });
  },

  /** Sends a password-reset email whose link redirects to `redirectTo` (must be an allow-listed URL in Supabase Auth settings). */
  async requestPasswordReset(client: Client, email: string, redirectTo: string) {
    return client.auth.resetPasswordForEmail(email, { redirectTo });
  },

  /** Sets a new password for the currently authenticated user (used on the reset-password landing page). */
  async updatePassword(client: Client, password: string) {
    return client.auth.updateUser({ password });
  },

  /** Fetches the `profiles` row for a given auth user id. */
  async getProfile(client: Client, userId: string) {
    return client.from("profiles").select("*").eq("id", userId).single();
  },
};
