-- Internal work-management system: departments, profiles (1:1 with auth.users), daily work logs, tasks,
-- folders and file metadata, plus the private "work-files" Storage bucket.
--
-- Access model (enforced by RLS, never by user-editable metadata):
--   admin    — everything
--   manager  — people in their own department and those people's logs, tasks and files
--   employee — their own logs, tasks assigned to/created by them, and files they own or can reach via a task
-- Inactive users see nothing. Roles, department and active flag can only be changed by an admin.

create schema if not exists private;

-- ---------------------------------------------------------------- tables

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(btrim(name)) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '' check (char_length(full_name) <= 120),
  phone text check (char_length(phone) <= 40),
  department_id uuid references public.departments (id) on delete set null,
  position text check (char_length(position) <= 120),
  role text not null default 'employee' check (role in ('admin', 'manager', 'employee')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_department_id_idx on public.profiles (department_id);

create table public.work_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  log_date date not null default current_date,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  description text check (char_length(description) <= 4000),
  hours numeric(4, 2) not null default 0 check (hours >= 0 and hours <= 24),
  status text not null default 'done' check (status in ('in_progress', 'done', 'blocked')),
  note text check (char_length(note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index work_logs_profile_date_idx on public.work_logs (profile_id, log_date desc);
create index work_logs_log_date_idx on public.work_logs (log_date);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  description text check (char_length(description) <= 8000),
  assignee_id uuid references public.profiles (id) on delete set null,
  created_by uuid not null default auth.uid() references public.profiles (id),
  start_date date,
  due_date date,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done', 'postponed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (due_date is null or start_date is null or due_date >= start_date)
);
create index tasks_assignee_id_idx on public.tasks (assignee_id);
create index tasks_created_by_idx on public.tasks (created_by);
create index tasks_status_due_idx on public.tasks (status, due_date);

-- Storage has no real folders; folders are metadata rows that files point at.
create table public.folders (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(btrim(name)) between 1 and 120),
  created_by uuid not null default auth.uid() references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index folders_created_by_idx on public.folders (created_by);

create table public.files (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 255),
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  folder_id uuid references public.folders (id) on delete set null,
  owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  task_id uuid references public.tasks (id) on delete set null,
  work_log_id uuid references public.work_logs (id) on delete set null,
  project text check (char_length(project) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index files_owner_id_idx on public.files (owner_id);
create index files_folder_id_idx on public.files (folder_id);
create index files_task_id_idx on public.files (task_id);
create index files_work_log_id_idx on public.files (work_log_id);

-- ---------------------------------------------------------------- helpers (security definer, not exposed via the API)

create function private.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger departments_updated_at before update on public.departments for each row execute function private.set_updated_at();
create trigger profiles_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger work_logs_updated_at before update on public.work_logs for each row execute function private.set_updated_at();
create trigger tasks_updated_at before update on public.tasks for each row execute function private.set_updated_at();
create trigger folders_updated_at before update on public.folders for each row execute function private.set_updated_at();
create trigger files_updated_at before update on public.files for each row execute function private.set_updated_at();

/** Role of the signed-in user, or null if signed out / inactive. */
create function private.my_role() returns text
language sql stable security definer set search_path = '' as $$
  select p.role from public.profiles p where p.id = (select auth.uid()) and p.is_active
$$;

create function private.is_active_user() returns boolean
language sql stable security definer set search_path = '' as $$
  select private.my_role() is not null
$$;

create function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(private.my_role() = 'admin', false)
$$;

/** True if I may see/act for `target`'s work: myself, an admin, or the manager of target's department. */
create function private.can_see_profile(target uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles me
    where me.id = (select auth.uid()) and me.is_active
      and (
        me.id = target
        or me.role = 'admin'
        or (me.role = 'manager' and me.department_id is not null
            and me.department_id = (select t.department_id from public.profiles t where t.id = target))
      )
  )
$$;

/** Profile rows a user may read: the above, plus colleagues in the same department and creators of my tasks. */
create function private.can_view_profile_row(target uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.can_see_profile(target)
    or exists (
      select 1 from public.profiles me join public.profiles t on t.id = target
      where me.id = (select auth.uid()) and me.is_active
        and me.department_id is not null and me.department_id = t.department_id
    )
    or exists (
      select 1 from public.tasks k
      where k.created_by = target and k.assignee_id = (select auth.uid()) and private.is_active_user()
    )
$$;

/** Edit/delete rights over something owned by `owner`: owner, admin, or owner's department manager. */
create function private.can_manage_owned(owner uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.can_see_profile(owner)
$$;

create function private.can_see_task(task uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.tasks t
    where t.id = task and private.is_active_user()
      and (
        private.is_admin()
        or t.assignee_id = (select auth.uid())
        or t.created_by = (select auth.uid())
        or (t.assignee_id is not null and private.my_role() = 'manager' and private.can_see_profile(t.assignee_id))
      )
  )
$$;

-- New auth user -> profile. Only the display name is taken from metadata; role always starts as 'employee'.
create function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function private.handle_new_user();

-- Non-admins may only change their own name and phone.
create function private.guard_profile_update() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (select auth.uid()) is null or private.is_admin() then
    return new;
  end if;
  if new.role is distinct from old.role
     or new.is_active is distinct from old.is_active
     or new.department_id is distinct from old.department_id
     or new.position is distinct from old.position
     or new.email is distinct from old.email then
    raise exception 'Зөвхөн админ эрх, хэлтэс, албан тушаал, төлөвийг өөрчилнө.' using errcode = '42501';
  end if;
  return new;
end $$;
create trigger profiles_guard before update on public.profiles for each row execute function private.guard_profile_update();

-- Assignees (non-managers) may only move the status; nobody but an admin rewrites created_by.
create function private.guard_task_update() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (select auth.uid()) is null or private.is_admin() then
    return new;
  end if;
  if new.created_by is distinct from old.created_by then
    raise exception 'Даалгавар үүсгэгчийг өөрчлөх боломжгүй.' using errcode = '42501';
  end if;
  if private.my_role() <> 'manager' and (
       new.title is distinct from old.title
       or new.description is distinct from old.description
       or new.assignee_id is distinct from old.assignee_id
       or new.start_date is distinct from old.start_date
       or new.due_date is distinct from old.due_date
       or new.priority is distinct from old.priority) then
    raise exception 'Та зөвхөн даалгаврын төлөвийг өөрчилнө.' using errcode = '42501';
  end if;
  return new;
end $$;
create trigger tasks_guard before update on public.tasks for each row execute function private.guard_task_update();

-- Where a file lives and who uploaded it never change after upload.
create function private.guard_file_update() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.storage_path is distinct from old.storage_path or new.owner_id is distinct from old.owner_id then
    raise exception 'Файлын байршил, эзэмшигчийг өөрчлөх боломжгүй.' using errcode = '42501';
  end if;
  return new;
end $$;
create trigger files_guard before update on public.files for each row execute function private.guard_file_update();

grant usage on schema private to authenticated;
grant execute on all functions in schema private to authenticated;
revoke execute on all functions in schema private from anon, public;

-- ---------------------------------------------------------------- RLS

alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.work_logs enable row level security;
alter table public.tasks enable row level security;
alter table public.folders enable row level security;
alter table public.files enable row level security;

-- departments
create policy "departments: active users read" on public.departments for select to authenticated
  using (private.is_active_user());
create policy "departments: admin insert" on public.departments for insert to authenticated
  with check (private.is_admin());
create policy "departments: admin update" on public.departments for update to authenticated
  using (private.is_admin()) with check (private.is_admin());
create policy "departments: admin delete" on public.departments for delete to authenticated
  using (private.is_admin());

-- profiles (rows are created by the auth trigger; admins manage users through the server)
create policy "profiles: read" on public.profiles for select to authenticated
  using (private.can_view_profile_row(id));
create policy "profiles: self or admin update" on public.profiles for update to authenticated
  using (id = (select auth.uid()) or private.is_admin())
  with check (id = (select auth.uid()) or private.is_admin());

-- work_logs
create policy "work_logs: read" on public.work_logs for select to authenticated
  using (private.can_see_profile(profile_id));
create policy "work_logs: own insert" on public.work_logs for insert to authenticated
  with check ((profile_id = (select auth.uid()) and private.is_active_user()) or private.is_admin());
create policy "work_logs: own update" on public.work_logs for update to authenticated
  using ((profile_id = (select auth.uid()) and private.is_active_user()) or private.is_admin())
  with check ((profile_id = (select auth.uid()) and private.is_active_user()) or private.is_admin());
create policy "work_logs: own delete" on public.work_logs for delete to authenticated
  using ((profile_id = (select auth.uid()) and private.is_active_user()) or private.is_admin());

-- tasks
create policy "tasks: read" on public.tasks for select to authenticated
  using (private.can_see_task(id));
create policy "tasks: managers create" on public.tasks for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and (
      private.is_admin()
      or (private.my_role() = 'manager' and (assignee_id is null or private.can_see_profile(assignee_id)))
    )
  );
create policy "tasks: update" on public.tasks for update to authenticated
  using (private.can_see_task(id))
  with check (
    private.is_admin()
    or (private.my_role() = 'manager' and (assignee_id is null or private.can_see_profile(assignee_id)))
    or (assignee_id = (select auth.uid()) and private.is_active_user())
  );
create policy "tasks: delete" on public.tasks for delete to authenticated
  using (private.is_admin() or (created_by = (select auth.uid()) and private.my_role() = 'manager'));

-- folders
create policy "folders: active users read" on public.folders for select to authenticated
  using (private.is_active_user());
create policy "folders: active users create" on public.folders for insert to authenticated
  with check (created_by = (select auth.uid()) and private.is_active_user());
create policy "folders: creator or admin update" on public.folders for update to authenticated
  using (private.is_admin() or (created_by = (select auth.uid()) and private.is_active_user()))
  with check (private.is_admin() or (created_by = (select auth.uid()) and private.is_active_user()));
create policy "folders: creator or admin delete" on public.folders for delete to authenticated
  using (private.is_admin() or (created_by = (select auth.uid()) and private.is_active_user()));

-- files
create policy "files: read" on public.files for select to authenticated
  using (private.can_see_profile(owner_id) or (task_id is not null and private.can_see_task(task_id)));
create policy "files: own insert" on public.files for insert to authenticated
  with check (
    owner_id = (select auth.uid()) and private.is_active_user()
    and (task_id is null or private.can_see_task(task_id))
    and (work_log_id is null or exists (
      select 1 from public.work_logs w where w.id = work_log_id and private.can_see_profile(w.profile_id)
    ))
  );
create policy "files: manage update" on public.files for update to authenticated
  using (private.can_manage_owned(owner_id)) with check (private.can_manage_owned(owner_id));
create policy "files: manage delete" on public.files for delete to authenticated
  using (private.can_manage_owned(owner_id));

-- ---------------------------------------------------------------- Storage

insert into storage.buckets (id, name, public, file_size_limit)
values ('work-files', 'work-files', false, 52428800)
on conflict (id) do nothing;

-- Objects are readable exactly when the matching files row is (that subquery runs under the files RLS above).
create policy "work-files: read via files row" on storage.objects for select to authenticated
  using (
    bucket_id = 'work-files'
    and exists (select 1 from public.files f where f.storage_path = objects.name)
  );
-- Uploads go only into the uploader's own top-level folder: <user id>/<uuid>-<name>.
create policy "work-files: upload to own prefix" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'work-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and private.is_active_user()
  );
create policy "work-files: delete with files row rights" on storage.objects for delete to authenticated
  using (
    bucket_id = 'work-files'
    and exists (
      select 1 from public.files f where f.storage_path = objects.name and private.can_manage_owned(f.owner_id)
    )
  );

-- Server-side (secret key) writes and the auth trigger also run these trigger/helper functions.
grant usage on schema private to service_role, supabase_auth_admin;
grant execute on all functions in schema private to service_role, supabase_auth_admin;
