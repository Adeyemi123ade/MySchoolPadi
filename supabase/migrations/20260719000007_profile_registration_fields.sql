-- Registration collects more than the original profiles columns cover
-- (see Login/Registration/Verification/Password Recovery mockup).

alter table public.profiles
  add column phone_number text,
  add column matric_number text, -- student-only
  add column department text, -- lecturer-only
  add column staff_id text, -- lecturer-only
  add column verified boolean not null default false; -- lecturer accounts require institution verification

comment on column public.profiles.matric_number is 'Student matriculation/registration number. Null for non-students.';
comment on column public.profiles.staff_id is 'Lecturer staff/employee number. Null for non-lecturers.';
comment on column public.profiles.verified is 'Institution verification status. Students are auto-verified; lecturers require manual verification.';

-- Capture the new fields from signup metadata, same as full_name/role already were.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, school_id, phone_number, matric_number, department, staff_id, verified)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student'),
    nullif(new.raw_user_meta_data ->> 'school_id', '')::uuid,
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'matric_number',
    new.raw_user_meta_data ->> 'department',
    new.raw_user_meta_data ->> 'staff_id',
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student') = 'student'
  );
  return new;
end;
$$;
