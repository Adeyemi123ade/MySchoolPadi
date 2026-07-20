# MySchoolPadi — project memory

Read this first in any new session. Full technical details (stack, data model, routes, API) are in `README.md` — this file is session-continuity context: what's been decided, what's deployed, and what's still open.

## What this is

A Next.js 15 + Supabase school communication platform for students and lecturers (announcements, courses, dashboards). Built incrementally, screen by screen, from provided design mockups — not all screens have mockups; ones that don't were designed to match the Design System + User Flow Map docs referenced early in the project.

## Current state (as of this writing)

- **GitHub**: `Adeyemi123ade/MySchoolPadi`. PR #1 ("Product foundation, full auth screens, both dashboards, and landing page") is **merged into `main`**. Development had been happening on branch `claude/product-foundation-review-2ajps5` — check whether that branch is still the active one or whether a new branch/PR should be started for further work.
- **Deployed**: live on Vercel at `https://my-school-padi.vercel.app/`, build is green/passing.
- **Supabase**: project ref `xhzodidlgkqtkqdkqayp`. All 8 migrations in `supabase/migrations/` are confirmed applied (verified via SQL Editor query, not just assumed — see below).
- **Built so far**: foundation (schema, RLS, REST API + OpenAPI docs), full auth screen set (login, role picker, student/lecturer registration wizards, email verification, password recovery), Student Dashboard, Lecturer Dashboard (role-aware nav), public landing page. See README's "Not yet built" section for the honest gap list (courses/announcements/etc. detail screens are still placeholder chrome only).

## Environment constraints that shaped decisions

- **This sandbox cannot reach Supabase or Vercel over the network** (confirmed repeatedly — DNS/proxy blocks all of them). Every piece of Supabase-dependent work (migrations, real signup/login, live data) had to be handed to the user to run/verify manually, and every PR test-plan honestly flagged this rather than claiming untested things worked.
- **`shadcn` CLI can't reach `ui.shadcn.com`** from here either — all `components/ui/*` were hand-authored to match shadcn's "new-york" style output exactly, safe to diff/regenerate later via `pnpm dlx shadcn@latest diff <component>` from a normal-network environment.
- Because of the above, **always verify Supabase-touching or deploy-touching claims by asking the user to run SQL/check dashboards**, rather than asserting success. This project's whole history has been built on being explicit about "I can't check this, here's how you check it."

## Notable technical decisions worth knowing before touching this code

- **Ethics line on the landing page**: source mockups included fabricated user-count stats, a named testimonial, and (in one mockup) implied endorsement by real named universities. None of that was built — user explicitly chose "honest pre-launch framing" via a direct question. Don't reintroduce fabricated social proof anywhere in this app.
- **Google OAuth requires `src/app/auth/callback/route.ts`** (already built) — `@supabase/ssr`'s browser client uses PKCE, so the code returned by Google must be exchanged for a session server-side before any cookie exists. The login form's Google button redirects through this route, not straight to `/dashboard`.
- **Role-aware navigation**: `src/constants/nav.ts` — `getSidebarNavItems(role)` / `getBottomNavItems(role)`. Students and lecturers have genuinely different sidebars, not a reskin.
- **Never fabricate dashboard data**: several lecturer-dashboard stats (Total Students, Avg. Engagement, Upcoming Lectures, etc.) have no backing schema yet — they render as `0`/`—`/honest empty states, not invented numbers or fake charts. Keep this pattern for any new stat that isn't really queryable yet.
- **Visual verification workflow**: temporarily `pnpm add -D playwright`, build a `/preview-*` route (careful: route-prefix matching in middleware means e.g. `/dashboard-preview` collides with the real `/dashboard` protected prefix — use unrelated prefixes like `/preview-dashboard`), screenshot at mobile (390px) and desktop (1400px+), compare to mockup, then remove playwright + the preview route before committing.
- Always run `pnpm typecheck && pnpm lint && pnpm build` before committing.

## Open items / natural next steps

1. **Google OAuth dashboard config** — not yet done by the user as of this writing: create a Google Cloud OAuth client (redirect URI = `https://xhzodidlgkqtkqdkqayp.supabase.co/auth/v1/callback`, JS origin = the Vercel domain + localhost), then paste Client ID/Secret into Supabase Authentication → Providers → Google, and add `https://my-school-padi.vercel.app/auth/callback` + `http://localhost:3000/auth/callback` to Supabase's Redirect URLs.
2. **First real end-to-end test** — user was about to try registering a real student/lecturer account on the live Vercel deployment. This is the first real test of the full signup → email OTP → profile-creation-trigger → dashboard flow outside this sandbox. Ask for the outcome if picking this up fresh.
3. Everything in README's "Not yet built" list is still accurate: detail screens for courses/announcements/students/analytics/calendar/messages, lecture-schedule + assignments + events data models, announcement scheduling, engagement/view tracking, payment provider integration, Resend email templates, signed-URL download route, rate limiting, lecturer verification workflow.
