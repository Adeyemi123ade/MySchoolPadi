import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/constants/routes";

/**
 * Completes the OAuth (PKCE) sign-in redirect from providers like Google.
 * Supabase redirects here with a `code` query param after the provider
 * approves the sign-in; this exchanges it for a session and sets the
 * session cookies before sending the user on to their destination.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? ROUTES.dashboard;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const url = new URL(ROUTES.login, origin);
  url.searchParams.set("error", "Could not sign in with Google. Please try again.");
  return NextResponse.redirect(url);
}
