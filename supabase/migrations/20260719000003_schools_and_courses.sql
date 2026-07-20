create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  owner_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_schools_updated_at
  before update on public.schools
  for each row execute function public.set_updated_at();

alter table public.profiles
  add constraint profiles_school_id_fkey
  foreign key (school_id) references public.schools (id) on delete set null;

alter table public.schools enable row level security;

create policy "Schools are viewable by any authenticated user"
  on public.schools for select
  to authenticated
  using (true);

create policy "Admins manage schools"
  on public.schools for all
  to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- Courses --------------------------------------------------------------

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  title text not null,
  description text,
  school_id uuid not null references public.schools (id) on delete cascade,
  lecturer_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, code)
);

create index courses_school_id_idx on public.courses (school_id);
create index courses_lecturer_id_idx on public.courses (lecturer_id);

create trigger set_courses_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

alter table public.courses enable row level security;

create policy "Courses are viewable by any authenticated user"
  on public.courses for select
  to authenticated
  using (true);

create policy "Lecturers manage their own courses"
  on public.courses for all
  to authenticated
  using (
    lecturer_id = auth.uid()
    or public.current_user_role() = 'admin'
  )
  with check (
    lecturer_id = auth.uid()
    or public.current_user_role() = 'admin'
  );
