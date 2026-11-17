-- HR records: one "personal file" per employee (with or without a login) and the documents in it
-- (contracts, orders, ID copies, certificates…), stored in a separate private bucket "hr-files".
--
-- Access (RLS):
--   admin    — everything
--   employee — read-only: their own employees row (linked via profile_id) and its documents
--   manager  — nothing here (HR files are confidential)
-- Purely additive: no existing table or policy is changed.

-- ---------------------------------------------------------------- tables

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  register_no text check (char_length(register_no) <= 20),
  birth_date date,
  phone text check (char_length(phone) <= 40),
  contact_email text check (char_length(contact_email) <= 160),
  address text check (char_length(address) <= 300),
  department_id uuid references public.departments (id) on delete set null,
  position text check (char_length(position) <= 120),
  hire_date date,
  employment_type text not null default 'permanent' check (employment_type in ('permanent', 'contract', 'hourly')),
  status text not null default 'active' check (status in ('active', 'leave', 'left')),
  left_on date,
  emergency_contact text check (char_length(emergency_contact) <= 200),
  note text check (char_length(note) <= 2000),
  -- Optional link to a login (profiles ↔ auth.users). One login per personal file.
  profile_id uuid unique references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index employees_department_id_idx on public.employees (department_id);
create index employees_full_name_idx on public.employees (full_name);

create table public.employee_documents (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  category text not null default 'other'
    check (category in ('contract', 'order', 'identity', 'education', 'training', 'medical', 'other')),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  doc_number text check (char_length(doc_number) <= 60),
  issued_on date,
  valid_until date,
  note text check (char_length(note) <= 1000),
  name text not null check (char_length(btrim(name)) between 1 and 255),
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  uploaded_by uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (valid_until is null or issued_on is null or valid_until >= issued_on)
);
create index employee_documents_employee_id_idx on public.employee_documents (employee_id);
create index employee_documents_valid_until_idx on public.employee_documents (valid_until) where valid_until is not null;

create trigger employees_updated_at before update on public.employees
  for each row execute function private.set_updated_at();
create trigger employee_documents_updated_at before update on public.employee_documents
  for each row execute function private.set_updated_at();

-- A document's file location never changes after upload.
create function private.guard_employee_document_update() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.storage_path is distinct from old.storage_path or new.employee_id is distinct from old.employee_id then
    raise exception 'Бичиг баримтын файл, эзэмшигчийг өөрчлөх боломжгүй.' using errcode = '42501';
  end if;
  return new;
end $$;
create trigger employee_documents_guard before update on public.employee_documents
  for each row execute function private.guard_employee_document_update();

/** True if `emp` is the signed-in, active user's own personal file. */
create function private.is_my_employee(emp uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.is_active_user()
    and exists (select 1 from public.employees e where e.id = emp and e.profile_id = (select auth.uid()))
$$;
grant execute on function private.is_my_employee(uuid) to authenticated, service_role;
revoke execute on function private.is_my_employee(uuid) from anon, public;
grant execute on function private.guard_employee_document_update() to authenticated, service_role;

-- ---------------------------------------------------------------- RLS

alter table public.employees enable row level security;
alter table public.employee_documents enable row level security;

create policy "employees: admin or self read" on public.employees for select to authenticated
  using (private.is_admin() or (profile_id = (select auth.uid()) and private.is_active_user()));
create policy "employees: admin insert" on public.employees for insert to authenticated
  with check (private.is_admin());
create policy "employees: admin update" on public.employees for update to authenticated
  using (private.is_admin()) with check (private.is_admin());
create policy "employees: admin delete" on public.employees for delete to authenticated
  using (private.is_admin());

create policy "employee_documents: admin or owner read" on public.employee_documents for select to authenticated
  using (private.is_admin() or private.is_my_employee(employee_id));
create policy "employee_documents: admin insert" on public.employee_documents for insert to authenticated
  with check (private.is_admin());
create policy "employee_documents: admin update" on public.employee_documents for update to authenticated
  using (private.is_admin()) with check (private.is_admin());
create policy "employee_documents: admin delete" on public.employee_documents for delete to authenticated
  using (private.is_admin());

-- ---------------------------------------------------------------- Storage

insert into storage.buckets (id, name, public, file_size_limit)
values ('hr-files', 'hr-files', false, 52428800)
on conflict (id) do nothing;

-- Readable exactly when the matching employee_documents row is (that subquery runs under its RLS above).
create policy "hr-files: read via document row" on storage.objects for select to authenticated
  using (
    bucket_id = 'hr-files'
    and exists (select 1 from public.employee_documents d where d.storage_path = objects.name)
  );
create policy "hr-files: admin upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'hr-files' and private.is_admin());
create policy "hr-files: admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'hr-files' and private.is_admin());

-- ---------------------------------------------------------------- backfill

-- Every existing login gets a personal file, linked to it.
insert into public.employees (full_name, phone, contact_email, department_id, position, status, profile_id)
select
  case when char_length(btrim(p.full_name)) >= 2 then p.full_name else p.email end,
  p.phone, p.email, p.department_id, p.position,
  case when p.is_active then 'active' else 'left' end,
  p.id
from public.profiles p
where not exists (select 1 from public.employees e where e.profile_id = p.id);
