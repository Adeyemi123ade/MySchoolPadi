/**
 * Supabase Auth (GoTrue) error messages are generally written to be shown to
 * end users already, but they're not something we control the wording of,
 * and new ones can appear without warning. This maps the ones we know about
 * to our own voice, and falls back to a safe generic message for anything
 * unrecognized — so a user is never shown a raw provider error string we
 * haven't reviewed.
 */
export function friendlyAuthErrorMessage(rawMessage: string): string {
  const message = rawMessage.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "The email or password you entered is incorrect.";
  }
  if (message.includes("email not confirmed")) {
    return "Please verify your email before logging in.";
  }
  if (message.includes("already registered") || message.includes("already exists")) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (message.includes("expired") || message.includes("invalid token") || message.includes("invalid otp")) {
    return "This code has expired or is incorrect. Please request a new one.";
  }
  if (message.includes("rate limit") || message.includes("only request this after")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (message.includes("password")) {
    // Supabase's own password-strength messages are already plain-language
    // and specific (e.g. "Password should be at least 6 characters") — safe to pass through.
    return rawMessage;
  }

  return "We couldn't complete that. Please try again.";
}
