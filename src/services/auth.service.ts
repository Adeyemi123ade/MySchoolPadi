import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, UserRole } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface SignInInput {
  email: string;
  password: string;
}

export const authService = {
  async signUp(client: Client, input: SignUpInput) {
    return client.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: { full_name: input.fullName, role: input.role ?? "student" },
      },
    });
  },

  async signIn(client: Client, input: SignInInput) {
    return client.auth.signInWithPassword(input);
  },

  async signOut(client: Client) {
    return client.auth.signOut();
  },

  async getSession(client: Client) {
    return client.auth.getSession();
  },

  async getCurrentUser(client: Client) {
    return client.auth.getUser();
  },

  async resendVerification(client: Client, email: string) {
    return client.auth.resend({ type: "signup", email });
  },

  async requestPasswordReset(client: Client, email: string, redirectTo: string) {
    return client.auth.resetPasswordForEmail(email, { redirectTo });
  },

  async updatePassword(client: Client, password: string) {
    return client.auth.updateUser({ password });
  },

  async getProfile(client: Client, userId: string) {
    return client.from("profiles").select("*").eq("id", userId).single();
  },
};
