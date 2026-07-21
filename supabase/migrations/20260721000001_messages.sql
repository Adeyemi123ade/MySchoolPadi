-- Messages -----------------------------------------------------------
-- Lecturer Journey: a lecturer broadcasts a message to everyone enrolled
-- in one of their own courses. Distinct from Announcements (which support
-- drafts, priority, and school-wide scope) — messages are course-scoped
-- only, lecturer-authored only, and visible immediately (no draft state).

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index messages_course_id_idx on public.messages (course_id);
create index messages_author_id_idx on public.messages (author_id);

alter table public.messages enable row level security;

-- Visible to the sending lecturer, students enrolled in the course, or an admin.
create policy "Course members can view course messages"
  on public.messages for select
  to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.enrollments e
      where e.course_id = messages.course_id and e.user_id = auth.uid()
    )
    or exists (
      select 1 from public.courses c
      where c.id = messages.course_id and c.lecturer_id = auth.uid()
    )
    or public.current_user_role() = 'admin'
  );

-- Only the course's own lecturer can send a message to it.
create policy "Lecturers send messages on their own courses"
  on public.messages for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.courses c
      where c.id = messages.course_id and c.lecturer_id = auth.uid()
    )
  );

create policy "Authors delete their own messages"
  on public.messages for delete
  to authenticated
  using (author_id = auth.uid() or public.current_user_role() = 'admin');
