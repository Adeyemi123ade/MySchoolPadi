-- Storage buckets -----------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('avatars', 'avatars', true, 5242880), -- 5MB, public read for profile pictures
  ('course-materials', 'course-materials', false, 52428800) -- 50MB, private, gated by RLS
on conflict (id) do nothing;

create policy "Avatar images are publicly readable"
  on storage.objects for select
  to authenticated, anon
  using (bucket_id = 'avatars');

create policy "Users upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update their own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Enrolled users read course materials"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'course-materials'
    and exists (
      select 1 from public.files f
      where f.bucket = 'course-materials'
        and f.path = storage.objects.name
        and (
          f.owner_id = auth.uid()
          or public.current_user_role() = 'admin'
          or exists (
            select 1 from public.enrollments e
            where e.course_id = f.course_id and e.user_id = auth.uid()
          )
          or exists (
            select 1 from public.courses c
            where c.id = f.course_id and c.lecturer_id = auth.uid()
          )
        )
    )
  );

create policy "Lecturers upload course materials"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'course-materials'
    and public.current_user_role() in ('lecturer', 'admin')
  );
