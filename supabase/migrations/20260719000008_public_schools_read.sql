-- Registration (Academic Info / Institution Info step) needs a school picker
-- before the user has a session. School names/addresses aren't sensitive,
-- so extend read access to signed-out visitors too.

create policy "Schools are viewable by signed-out visitors"
  on public.schools for select
  to anon
  using (true);
