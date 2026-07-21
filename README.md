# MySchoolPadi

A school communication and course platform for students and lecturers — announcements, courses, enrollments, notifications and bookmarks, built mobile-first and accessible.

This repository contains the product foundation (scaffold, design tokens, data model, auth, REST API, typed service layer, layout chrome), the full authentication screen set (login, student/lecturer registration, email verification, password recovery), and the Student Dashboard — all built against their respective mockups. The remaining dashboard-area screens (Courses, Announcements, Notifications, Bookmarks, Profile, Settings) are still placeholders.

## Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **State**: Zustand (client/UI state), TanStack React Query (server state), React Hook Form + Zod (forms)
- **Backend**: Supabase (Postgres, Auth, Realtime, Storage, Edge Functions), Resend (email)
- **Hosting**: Vercel

Source: Technical Architecture Document v1.0 and Frontend Architecture Document v1.0.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
pnpm dev
```

Apply the database schema to your Supabase project (requires the [Supabase CLI](https://supabase.com/docs/guides/cli)):

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Then regenerate types to replace the hand-authored `src/types/database.types.ts`:

```bash
supabase gen types typescript --project-id <your-project-ref> > src/types/database.types.ts
```

## Project structure

```
src/
  app/                 Next.js routes (route groups: (auth), (dashboard))
  components/
    ui/                shadcn/ui primitives (button, input, card, dialog, sheet, etc.)
    layout/             Header, Sidebar, BottomNav, Footer, DashboardShell
    shared/              Cross-feature reusable components (not yet built)
    providers/            React Query provider, Toaster, app-wide providers
  features/            Feature-scoped modules (auth, dashboard, announcements, notifications, bookmarks)
  hooks/               Custom hooks (e.g. useAuth)
  lib/
    api/                 Route handler helpers: auth guard, error/response envelopes, client-side fetchJson()
    validations/          Zod schemas for API request bodies
    supabase/            Browser / server / middleware Supabase clients
    utils.ts              cn() helper (shadcn convention)
  services/            Typed Supabase query wrappers, one per domain (JSDoc'd)
  store/               Zustand stores (auth, ui)
  types/               Domain types + generated database types
  constants/           Route table, shared constants
supabase/
  config.toml          Local Supabase CLI config
  migrations/          SQL schema + RLS policies
docs/
  openapi.yaml         OpenAPI 3.0 spec for src/app/api/**
```

## Data model

Tables: `profiles`, `schools`, `courses`, `enrollments`, `announcements`, `notifications`, `bookmarks`, `payments`, `files`, plus Supabase Storage buckets `avatars` and `course-materials`.

**`announcements`, `notifications`, and `bookmarks` were added beyond the ERD in the Technical Architecture Document.** That document's logical data model only lists Users/Schools/Courses/Enrollments/Payments/Files, but the User Flow Map's Student and Lecturer journeys depend on announcements (create/publish/browse), notifications (view/mark read), and bookmarks (courses and announcements) as first-class entities — so they're included here as part of a complete foundation. Flag this for the design/product team to reconcile with the architecture doc.

Every table has row-level security enabled, scoped by role (`student` / `lecturer` / `admin`) and ownership. A `handle_new_user` trigger provisions a `profiles` row automatically on signup, defaulting to the `student` role unless `role` is passed in signup metadata.

`profiles` also carries registration-collected fields not in the original architecture doc's ERD: `phone_number`, `matric_number` (student), `department` + `staff_id` (lecturer), and `verified` (lecturer accounts require manual institution verification — students are auto-verified). `schools` is additionally readable by signed-out visitors (`anon` role), since the registration flow's school picker runs before the user has a session.

## Design tokens

`src/app/globals.css` implements the MySchoolPadi Design System v1.0 (Locked) as Tailwind v4 `@theme` tokens: brand colors, the Inter typography scale, 8pt spacing (Tailwind's default spacing scale already matches it — no override needed), and named radii (`sm`/`md`/`lg`/`pill`).

Where the Design System page and the separate Design-to-Code Specification disagreed on exact values (shadow curves, extended radius scale), the Design-to-Code Specification's literal CSS tokens were used, since the Design System page is explicitly marked as the locked source of truth for colors/typography/named radii. Worth reconciling those two documents.

## Routing & auth

Route groups mirror the Frontend Architecture routing diagram. `(dashboard)` — `/dashboard`, `/courses`, `/announcements`, `/notifications`, `/bookmarks`, `/settings`, `/profile`, plus lecturer-only `/students`, `/analytics`, `/calendar`, `/messages` — is wrapped in `DashboardShell` (Header + Sidebar on desktop, Header + Sheet drawer + BottomNav on mobile, Footer). `/dashboard` is a real, data-wired screen for both roles; the rest are still placeholders.

The Header was originally built purple with no mockup to go on; once real screen mockups arrived showing a consistent light/white header across the app, it was restyled to match (see git history if you want the purple version back for some reason).

**Navigation is role-aware** (`src/constants/nav.ts`: `getSidebarNavItems`/`getBottomNavItems`). Students see Dashboard/Courses/Announcements/Notifications/Bookmarks/Profile; lecturers see Dashboard/Courses/Announcements/Students/Analytics/Calendar/Messages/Settings, per their respective dashboard mockups — these are genuinely different information architectures, not a reskin of the same nav.

### Landing page (`/`)

Public, unauthenticated entry point (`src/features/landing/`): sticky nav with anchor links, Hero, Why Choose (4 value props), How It Works (3 steps), Designed for Everyone (Student/Lecturer `Tabs`, reusing the registration wizard's illustrations), a "the old way vs. MySchoolPadi" comparison, an FAQ `Accordion`, a bottom CTA banner, and a footer.

Two source mockups were provided for this screen. Both leaned on social proof this product doesn't have yet: fabricated user-count stats, a testimonial attributed to a named person, and — in one mockup — implied endorsement by specific named Nigerian universities. None of that is real, so none of it was built. Every section that would normally carry that kind of claim was reframed around what's actually true today: real feature descriptions, a real "old way vs. new way" comparison, and an honest FAQ (e.g. "is this available for my institution?" answers "early access and growing," not a fabricated list of partner schools). Nothing here claims a user count, a named quote, or an institutional partnership that doesn't exist.

Added `Accordion` and `Tabs` to `src/components/ui/` (Radix-based, same hand-authored pattern as the rest of `components/ui/` — see the note below) to support the FAQ and the Student/Lecturer toggle.

### Dashboard (`/dashboard`)

`DashboardPage` branches on `profile.role` and renders `StudentDashboardView` or `LecturerDashboardView` (`src/features/dashboard/components/`).

**Student view**: greeting, "Today's Overview" stat card, Recent Announcements list. Wired to real data where the backend supports it — announcements count + list (`GET /api/announcements`), bookmark toggle (`POST`/`DELETE /api/bookmarks`), notification bell badge (`GET /api/notifications`). "Lectures Today" / "Assignments" / "Events" show `0` — no schema for those yet. The mockup's floating "+" button was left out; unclear purpose for a student account.

**Lecturer view**: greeting, 4 stat cards (Courses/Announcements/Total Students/Avg. Engagement), Announcement Summary, Engagement Overview, Upcoming Lectures, Recent Announcements. Wired to real data: Courses count (`GET /api/courses?mine=1`), Announcements count + Published/Draft breakdown + Recent list (`GET /api/announcements?mine=1`), **Total Students** (sum of each course's real `enrolled_count` — a student enrolled in more than one of the lecturer's courses is counted once per course, not deduplicated, but it's real roster data, not a fabricated number). **Avg. Engagement, "Scheduled" announcement count, Total Views, the Engagement Overview chart, and Upcoming Lectures are still not backed by real data** — no view/engagement tracking, no lecture-schedule table exist yet. Rather than fabricate numbers or a fake chart, these render as `—`/honest empty states ("No engagement data yet", "No lecture schedule yet"). The mockup's "You have N classes today" banner was left out entirely for the same reason. Per the `dataviz` skill's own guidance ("sometimes the answer is not a chart"), Engagement Overview is an empty state, not a chart with invented data.

Announcement badges (IMPORTANT / REMINDER / UPDATE / NEW / INFO) are derived, not stored: `important`/`reminder`/`update` map directly from `announcements.priority`; `normal`-priority announcements show NEW if published within the last 48 hours, otherwise INFO.

`(auth)` is fully built out:

| Route | Screen |
| --- | --- |
| `/login` | Sign in, incl. "Continue with Google" |
| `/register` | Role picker (Student / Lecturer) |
| `/register/student` | 3-step wizard: Personal Info → Academic Info → Account Security |
| `/register/lecturer` | 3-step wizard: Personal Info → Institution Info → Account Security |
| `/verify-email` | 6-digit email OTP, with resend + expiry countdown |
| `/forgot-password` | Request reset link → Check your email (client-side step transition) |
| `/reset-password` | Create new password → success state. Reached via the emailed reset link, not by navigating directly |

Only Step 1 of each registration wizard was shown in the source mockup; Steps 2 (school picker, via `/api/schools`) and 3 (password creation, matching the Reset Password screen's requirements checklist) were designed to fit the existing schema rather than invented fields with nowhere to persist.

`src/middleware.ts` refreshes the Supabase session on every request and redirects unauthenticated users away from protected routes to `/login`, and authenticated users away from auth routes to `/dashboard`. `/reset-password` is deliberately excluded from both checks — see the comment in `src/constants/routes.ts` for why.

### The rest of the app (student + lecturer screens)

Built from the full student mobile mockup set (10 screens) and lecturer desktop mockup set (8 screens). All routes below are real, data-wired screens, not placeholder chrome — every list, count, and form actually reads from and writes to Supabase through the API layer.

| Route | Student | Lecturer |
| --- | --- | --- |
| `/courses` | My Courses grid (enrolled courses, `GET /api/enrollments`) | Course Management grid (own courses + Add Course dialog, `GET /api/courses?mine=1`) |
| `/courses/join` | Join with Course Code (exact lookup, `GET /api/courses?code=&schoolId=`) or Browse Courses (`GET /api/courses`) | — |
| `/announcements` | Announcements Feed (All/Unread/Important/Bookmarked tabs, search) | Announcement History (All/Published/Drafts, search, publish/delete actions) |
| `/announcements/[id]` | Full detail view, bookmark, share | Same, plus Edit/Publish/Delete for the author |
| `/announcements/new` | — | Create Announcement → Preview → Publish, or Save Draft |
| `/notifications` | Grouped by Today/Yesterday/Earlier, filter tabs, mark (all) read | Same (shared component) |
| `/search` | Live search across courses + published announcements, recent searches | Same (shared component) |
| `/bookmarks` | All/Announcements/Courses tabs | Same (shared component) |
| `/students` | — | Roster per course (course picker + search), CSV export |
| `/analytics` | — | Real stat tiles (Courses/Published/Total Students) + honest empty states for anything untracked |
| `/profile` | Personal + Academic Info, Payment History, My Activity, edit dialog | Personal/Professional Information tabs, verification status |
| `/settings` | Account, Preferences (incl. a real, working Dark Mode toggle), Support | Same (shared component) |

A number of mockup elements aren't backed by anything in the schema, and were adapted rather than faked, following the same rule used everywhere else in this project — real data or an honest empty state, never an invented number:

- **"Unread" announcements** (student feed) is a client-side "published since your last visit" heuristic (`localStorage`), since there's no per-user read-state on announcements and nothing yet writes a notification row when one is published.
- **Course "engagement %" rings** (mockup) became a real enrolled-student count (`coursesService.listForLecturer` now does a second query over `enrollments` to compute it).
- **Announcement attachments** (Create/Preview/Detail) were left out entirely — `files` links to a `course_id`, not an `announcement_id`, so there's no honest way to say a given file belongs to a given announcement.
- **Venue / Lecture Date & Time fields** (Create Announcement) aren't modeled — that content goes in the message body, same reasoning as the dashboard's missing lecture-schedule table.
- **"Announcement Type" and "Priority"** (two separate dropdowns in the mockup) were collapsed into the one real field the schema has — `announcements.priority`.
- **"Scheduled"/"Archived"** announcement states and **"Schedule for Later"** don't exist (`announcement_status` is only `draft`/`published`) — the History tabs and the create form's toggle reflect that (the toggle renders disabled, labeled "Coming soon", rather than silently doing nothing).
- **Two-Factor Authentication, Push/Email Notifications** (Settings) render as disabled rows labeled "Coming soon" rather than a toggle that resets on refresh and quietly lies about its own state.
- **"Materials" bookmarks tab** became a **Courses** tab — `bookmarkable_type` is `'course' | 'announcement'` in the schema, materials aren't bookmarkable.
- **"Popular Searches"** was left out — there's no cross-user search analytics to honestly back it.
- Analytics' Views Over Time / Announcement Performance / Top Courses by Engagement charts are all honest empty states, same reasoning and same pattern as the dashboard's Engagement Overview card.
- **Change Password** (Settings) and **Edit Profile** (full name, phone number) are real, working forms — the latter needed a new `PATCH /api/profile` endpoint, RLS already allowed self-updates (`profiles` migration's "Users can update their own profile" policy) but nothing exposed it yet.

## API

`src/app/api/**/route.ts` exposes a REST API over the data model — the internal API surface a future mobile app or third-party integration would use, and the shape sketched in the Technical Architecture Document's API Design table. Each route handler is a thin wrapper: validate the request with zod, resolve the caller via `requireUser()`/`requireRole()`, call the matching `services/*.service.ts` function, translate the result into a `{ data }` / `{ error }` JSON envelope. **Row-level security in `supabase/migrations/` is the real authorization boundary** — the route-level role checks exist for clearer error messages, not as the only guard.

| Domain | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/forgot-password`, `POST /api/auth/verify-email`, `POST /api/auth/resend-verification`, `POST /api/auth/reset-password` |
| Profile | `PATCH /api/profile` (full name, phone number — self only) |
| Schools | `GET /api/schools` (public) |
| Courses | `GET/POST /api/courses` (supports `?mine=1`, `?search=`, `?code=&schoolId=`), `GET/PATCH/DELETE /api/courses/:id` |
| Enrollments | `GET/POST /api/enrollments` (supports `?courseId=` for a course roster), `DELETE /api/enrollments/:id` |
| Announcements | `GET/POST /api/announcements`, `GET/PATCH/DELETE /api/announcements/:id`, `POST /api/announcements/:id/publish` |
| Notifications | `GET /api/notifications`, `PATCH/DELETE /api/notifications/:id`, `POST /api/notifications/mark-all-read` |
| Bookmarks | `GET/POST/DELETE /api/bookmarks` |
| Payments | `GET/POST /api/payments` |
| Storage | `GET/POST /api/storage/files`, `POST /api/storage/avatar` |

### Documentation

Two layers, documented two different ways:

- **`src/services/*.service.ts`** (the typed Supabase query layer) — documented with **JSDoc** on every exported function: params, return shape, and which RLS policy governs it. Shows up as hover/autocomplete docs in your editor; read the files directly to learn the data layer.
- **`src/app/api/**`** (the REST surface) — documented with an **OpenAPI 3.0 spec** at [`docs/openapi.yaml`](./docs/openapi.yaml): every path, request/response schema, and error shape. To browse it interactively:

  ```bash
  # Option A: Redoc, static HTML preview
  pnpm dlx @redocly/cli preview-docs docs/openapi.yaml

  # Option B: Swagger UI
  pnpm dlx swagger-ui-watcher docs/openapi.yaml
  ```

  Or import `docs/openapi.yaml` directly into Postman/Insomnia, or open it with the "OpenAPI (Swagger) Editor" VS Code extension.

  There's intentionally no in-app `/api-docs` page yet — that would be a screen of its own, and hasn't come up in any mockup so far.

## A note on `components/ui/`

These were hand-authored to match shadcn/ui's standard "new-york" style output, because `pnpm dlx shadcn add` couldn't reach `ui.shadcn.com` from the environment that built this foundation. They should behave identically to a normal `shadcn add` output and are safe to regenerate/diff via the CLI (`pnpm dlx shadcn@latest diff <component>`) from an environment with normal network access, if you want to confirm they're byte-for-byte current.

## Not yet built

- **Calendar** (`/calendar`) and **Messages** (`/messages`) — lecturer nav items with route placeholders only; no mockup has covered either yet, and both need real data models (a lecture-schedule/timetable table for Calendar; a conversations/messages table for Messages) that don't exist
- Lecture schedule, assignments, and events data models (needed for the dashboards' remaining stats, and for Calendar, to be real)
- Announcement scheduling (a "publish later" state beyond draft/published) and view/read/engagement tracking (needed for Analytics' and the lecturer dashboard's remaining charts, and for per-announcement read state)
- Announcement attachments — `files` links to a course, not an announcement, so Create/Preview/Detail don't have a way to honestly attach a file to one specific announcement
- Push/email notification preferences and Two-Factor Authentication — no schema for either; Settings shows both as disabled "Coming soon" rows rather than a toggle with nowhere real to persist its state
- Payment provider integration (webhook route to transition `payments.status`) — Payment History is real and wired, just realistically empty until a provider exists
- Resend email templates
- Supabase Edge Functions
- Signed-URL download route for private course materials (service method exists: `storageService.getSignedUrl`)
- Rate limiting on the API routes (Security Standards: "validate inputs" is covered via zod; throttling is not yet in place)
- Lecturer institution verification workflow (the `profiles.verified` flag exists and defaults `false` for lecturers; nothing sets it `true` yet — presumably an admin action)

### Requires your setup to actually work

- **Google sign-in**: `/login`'s Google button redirects through `src/app/auth/callback/route.ts` (which exchanges the OAuth code for a session) before landing on `/dashboard`. It does nothing until you (1) create a Google OAuth client and add `https://<project-ref>.supabase.co/auth/v1/callback` as its authorized redirect URI, (2) paste that client's ID/secret into Authentication → Providers → Google in your Supabase dashboard, and (3) add `http://localhost:3000/auth/callback` (and your production equivalent) to Authentication → URL Configuration → Redirect URLs
- **Email OTP verification**: `/verify-email` expects Supabase Auth's default 6-digit signup code email. If your project's email template was customized to a magic-link instead, the OTP input won't have anything to match against
- **Password reset redirect**: `/api/auth/forgot-password` sends `${NEXT_PUBLIC_APP_URL}/reset-password` as the redirect — make sure that URL is in your Supabase Auth allow list (see the auth setup step in Getting Started)
