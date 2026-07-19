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

Route groups mirror the Frontend Architecture routing diagram. `(dashboard)` — `/dashboard`, `/courses`, `/announcements`, `/notifications`, `/bookmarks`, `/settings`, `/profile` — is wrapped in `DashboardShell` (Header + Sidebar on desktop, Header + Sheet drawer + BottomNav on mobile, Footer). `/dashboard` (Student Dashboard) is a real, data-wired screen; the rest are still placeholders.

The Header was originally built purple with no mockup to go on; once real screen mockups arrived showing a consistent light/white header across the app, it was restyled to match (see git history if you want the purple version back for some reason).

### Student Dashboard

Greeting, "Today's Overview" stat card, and a Recent Announcements list, built against the provided mockup. Wired to real data where the backend already supports it:

- Announcements count + Recent Announcements list — live via `GET /api/announcements`
- Bookmark toggle on each announcement card — live via `POST`/`DELETE /api/bookmarks`
- Notification bell badge in the header — live unread count via `GET /api/notifications`

"Lectures Today", "Assignments", and "Events" in the overview card are shown as `0` rather than fabricated numbers — the schema has no lecture-schedule, assignment, or event tables yet, so there's no real data to back them. The floating "+" action button shown on this screen in the mockup was left out; its purpose for a student account wasn't clear, and it wasn't worth guessing at.

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

## API

`src/app/api/**/route.ts` exposes a REST API over the data model — the internal API surface a future mobile app or third-party integration would use, and the shape sketched in the Technical Architecture Document's API Design table. Each route handler is a thin wrapper: validate the request with zod, resolve the caller via `requireUser()`/`requireRole()`, call the matching `services/*.service.ts` function, translate the result into a `{ data }` / `{ error }` JSON envelope. **Row-level security in `supabase/migrations/` is the real authorization boundary** — the route-level role checks exist for clearer error messages, not as the only guard.

| Domain | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/forgot-password`, `POST /api/auth/verify-email`, `POST /api/auth/resend-verification`, `POST /api/auth/reset-password` |
| Schools | `GET /api/schools` (public) |
| Courses | `GET/POST /api/courses`, `GET/PATCH/DELETE /api/courses/:id` |
| Enrollments | `GET/POST /api/enrollments`, `DELETE /api/enrollments/:id` |
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

  There's intentionally no in-app `/api-docs` page yet — that would be a screen, and this pass is foundation-only.

## A note on `components/ui/`

These were hand-authored to match shadcn/ui's standard "new-york" style output, because `pnpm dlx shadcn add` couldn't reach `ui.shadcn.com` from the environment that built this foundation. They should behave identically to a normal `shadcn add` output and are safe to regenerate/diff via the CLI (`pnpm dlx shadcn@latest diff <component>`) from an environment with normal network access, if you want to confirm they're byte-for-byte current.

## Not yet built

- Dashboard-area screen content beyond `/dashboard` itself (Courses, Announcements, Notifications, Bookmarks, Settings, Profile) — layout chrome exists, page content is still placeholder
- Lecture schedule, assignments, and events data models (needed for the overview card's other stats to be real)
- Feature-level components beyond the base `components/ui/` primitives (e.g. an actual CourseCard, AnnouncementCard — see Design System's Cards section)
- Payment provider integration (webhook route to transition `payments.status`)
- Resend email templates
- Supabase Edge Functions
- Signed-URL download route for private course materials (service method exists: `storageService.getSignedUrl`)
- Rate limiting on the API routes (Security Standards: "validate inputs" is covered via zod; throttling is not yet in place)
- Lecturer institution verification workflow (the `profiles.verified` flag exists and defaults `false` for lecturers; nothing sets it `true` yet — presumably an admin action)

### Requires your setup to actually work

- **Google sign-in**: the button/redirect on `/login` is wired up, but does nothing until you enable the Google provider under Authentication → Providers in your Supabase dashboard
- **Email OTP verification**: `/verify-email` expects Supabase Auth's default 6-digit signup code email. If your project's email template was customized to a magic-link instead, the OTP input won't have anything to match against
- **Password reset redirect**: `/api/auth/forgot-password` sends `${NEXT_PUBLIC_APP_URL}/reset-password` as the redirect — make sure that URL is in your Supabase Auth allow list (see the auth setup step in Getting Started)
