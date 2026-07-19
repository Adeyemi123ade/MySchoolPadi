# MySchoolPadi

A school communication and course platform for students and lecturers — announcements, courses, enrollments, notifications and bookmarks, built mobile-first and accessible.

This repository currently contains the **product foundation**: project scaffold, design tokens, data model, auth, and typed service layer. No screens have been designed/built yet — that's the next phase, against the Design System and User Flow Map.

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
    ui/                shadcn/ui primitives (not yet generated)
    layout/             Header, Sidebar, Footer (not yet built)
    shared/              Cross-feature reusable components
    providers/            React Query provider, app-wide providers
  features/            Feature-scoped modules (not yet built)
  hooks/               Custom hooks (e.g. useAuth)
  lib/
    supabase/            Browser / server / middleware Supabase clients
    utils.ts              cn() helper (shadcn convention)
  services/            Typed Supabase query wrappers, one per domain
  store/               Zustand stores (auth, ui)
  types/               Domain types + generated database types
  constants/           Route table, shared constants
supabase/
  config.toml          Local Supabase CLI config
  migrations/          SQL schema + RLS policies
```

## Data model

Tables: `profiles`, `schools`, `courses`, `enrollments`, `announcements`, `notifications`, `bookmarks`, `payments`, `files`, plus Supabase Storage buckets `avatars` and `course-materials`.

**`announcements`, `notifications`, and `bookmarks` were added beyond the ERD in the Technical Architecture Document.** That document's logical data model only lists Users/Schools/Courses/Enrollments/Payments/Files, but the User Flow Map's Student and Lecturer journeys depend on announcements (create/publish/browse), notifications (view/mark read), and bookmarks (courses and announcements) as first-class entities — so they're included here as part of a complete foundation. Flag this for the design/product team to reconcile with the architecture doc.

Every table has row-level security enabled, scoped by role (`student` / `lecturer` / `admin`) and ownership. A `handle_new_user` trigger provisions a `profiles` row automatically on signup, defaulting to the `student` role unless `role` is passed in signup metadata.

## Design tokens

`src/app/globals.css` implements the MySchoolPadi Design System v1.0 (Locked) as Tailwind v4 `@theme` tokens: brand colors, the Inter typography scale, 8pt spacing (Tailwind's default spacing scale already matches it — no override needed), and named radii (`sm`/`md`/`lg`/`pill`).

Where the Design System page and the separate Design-to-Code Specification disagreed on exact values (shadow curves, extended radius scale), the Design-to-Code Specification's literal CSS tokens were used, since the Design System page is explicitly marked as the locked source of truth for colors/typography/named radii. Worth reconciling those two documents.

## Routing & auth

Route groups mirror the Frontend Architecture routing diagram: `(auth)` for `/login`, `/register`, `/forgot-password` (full-screen layout), and `(dashboard)` for `/dashboard`, `/courses`, `/announcements`, `/notifications`, `/bookmarks`, `/settings`, `/profile` (sidebar + header shell). Pages currently render a placeholder only — no real UI has been implemented.

`src/middleware.ts` refreshes the Supabase session on every request and redirects unauthenticated users away from protected routes to `/login`, and authenticated users away from auth routes to `/dashboard`.

## Not yet built

- Actual screen UI (per the Design System and User Flow Map)
- shadcn/ui components beyond the base `cn()` helper
- Header / Sidebar / Footer components
- Payment provider integration (Edge Function to transition `payments.status`)
- Resend email templates
- Supabase Edge Functions
