-- Payments -----------------------------------------------------------

create type public.payment_status as enum ('pending', 'success', 'failed', 'refunded');

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid references public.courses (id) on delete set null,
  amount numeric(12, 2) not null,
  currency text not null default 'NGN',
  status public.payment_status not null default 'pending',
  provider text,
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_user_id_idx on public.payments (user_id);
create index payments_status_idx on public.payments (status);

create trigger set_payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

alter table public.payments enable row level security;

create policy "Users view their own payments"
  on public.payments for select
  to authenticated
  using (user_id = auth.uid() or public.current_user_role() = 'admin');

create policy "Users create their own payments"
  on public.payments for insert
  to authenticated
  with check (user_id = auth.uid());

-- Payment status transitions (pending -> success/failed/refunded) happen via
-- a trusted Edge Function using the service role key, not directly by end users.

-- Files (Supabase Storage metadata) -----------------------------------------------------------

create table public.files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid references public.courses (id) on delete set null,
  bucket text not null,
  path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

create index files_owner_id_idx on public.files (owner_id);
create index files_course_id_idx on public.files (course_id);

alter table public.files enable row level security;

create policy "Course files are viewable by enrolled users and the owner"
  on public.files for select
  to authenticated
  using (
    owner_id = auth.uid()
    or public.current_user_role() = 'admin'
    or exists (
      select 1 from public.enrollments e
      where e.course_id = files.course_id and e.user_id = auth.uid()
    )
    or exists (
      select 1 from public.courses c
      where c.id = files.course_id and c.lecturer_id = auth.uid()
    )
  );

create policy "Users manage their own file records"
  on public.files for all
  to authenticated
  using (owner_id = auth.uid() or public.current_user_role() = 'admin')
  with check (owner_id = auth.uid() or public.current_user_role() = 'admin');
