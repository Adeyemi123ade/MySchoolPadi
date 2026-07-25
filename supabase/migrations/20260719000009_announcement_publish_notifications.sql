-- Fan out a notification to every relevant student when an announcement is
-- published, and make `notifications` deliverable over Supabase Realtime so
-- the bell updates without a page refresh.
--
-- This has to run as SECURITY DEFINER: RLS on `notifications` only lets a
-- user insert/see their own rows, so an announcement's author has no way to
-- write into another user's notification inbox from the client.

create or replace function public.notify_announcement_published()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'published' and (old.status is distinct from new.status) then
    if new.course_id is not null then
      insert into public.notifications (user_id, type, title, body, link)
      select e.user_id, 'announcement', new.title, left(new.body, 200), '/announcements/' || new.id
      from public.enrollments e
      where e.course_id = new.course_id
        and e.user_id <> new.author_id;
    elsif new.school_id is not null then
      insert into public.notifications (user_id, type, title, body, link)
      select p.id, 'announcement', new.title, left(new.body, 200), '/announcements/' || new.id
      from public.profiles p
      where p.school_id = new.school_id
        and p.role = 'student'
        and p.id <> new.author_id;
    end if;
  end if;
  return new;
end;
$$;

create trigger on_announcement_published
  after update on public.announcements
  for each row execute function public.notify_announcement_published();

alter publication supabase_realtime add table public.notifications;
