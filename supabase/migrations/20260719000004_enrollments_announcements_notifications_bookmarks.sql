-- Enrollments -----------------------------------------------------------

create type public.enrollment_status as enum ('active', 'completed', 'dropped');

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  status public.enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create index enrollments_user_id_idx on public.enrollments (user_id);
create index enrollments_course_id_idx on public.enrollments (course_id);

alter table public.enrollments enable row level security;

create policy "Students view their own enrollments"
  on public.enrollments for select
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.courses c
      where c.id = course_id and c.lecturer_id = auth.uid()
    )
    or public.current_user_role() = 'admin'
  );

create policy "Students enroll themselves"
  on public.enrollments for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Students update their own enrollment status"
  on public.enrollments for update
  to authenticated
  using (user_id = auth.uid() or public.current_user_role() = 'admin')
  with check (user_id = auth.uid() or public.current_user_role() = 'admin');

create policy "Students drop their own enrollment"
  on public.enrollments for delete
  to authenticated
  using (user_id = auth.uid() or public.current_user_role() = 'admin');

-- Announcements -----------------------------------------------------------
-- Lecturer Journey: Create Announcement -> Preview -> Publish/Edit (see User Flow Map)

create type public.announcement_priority as enum ('normal', 'important', 'reminder', 'update');
create type public.announcement_status as enum ('draft', 'published');

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses (id) on delete cascade,
  school_id uuid references public.schools (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  priority public.announcement_priority not null default 'normal',
  status public.announcement_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint announcement_scope_check check (course_id is not null or school_id is not null)
);

create index announcements_course_id_idx on public.announcements (course_id);
create index announcements_school_id_idx on public.announcements (school_id);
create index announcements_status_idx on public.announcements (status);

create trigger set_announcements_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

alter table public.announcements enable row level security;

create policy "Published announcements are viewable by any authenticated user"
  on public.announcements for select
  to authenticated
  using (status = 'published' or author_id = auth.uid() or public.current_user_role() = 'admin');

create policy "Lecturers manage their own announcements"
  on public.announcements for all
  to authenticated
  using (author_id = auth.uid() or public.current_user_role() = 'admin')
  with check (author_id = auth.uid() or public.current_user_role() = 'admin');

-- Notifications -----------------------------------------------------------

create type public.notification_type as enum ('announcement', 'enrollment', 'payment', 'system');

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null default 'system',
  title text not null,
  body text,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id);
create index notifications_user_unread_idx on public.notifications (user_id) where not is_read;

alter table public.notifications enable row level security;

create policy "Users view their own notifications"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users update their own notifications"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users delete their own notifications"
  on public.notifications for delete
  to authenticated
  using (user_id = auth.uid());

-- Bookmarks -----------------------------------------------------------
-- Student Journey: Bookmark Courses / Bookmarked Announcements (see User Flow Map)

create type public.bookmarkable_type as enum ('course', 'announcement');

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  bookmarkable_type public.bookmarkable_type not null,
  bookmarkable_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, bookmarkable_type, bookmarkable_id)
);

create index bookmarks_user_id_idx on public.bookmarks (user_id);

alter table public.bookmarks enable row level security;

create policy "Users manage their own bookmarks"
  on public.bookmarks for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
