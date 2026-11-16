-- tasks: check visibility from the row's own columns instead of re-querying tasks by id, so
-- `insert ... returning` (and other same-statement reads) see the new row.
create function private.task_visible(assignee uuid, creator uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.is_active_user()
    and (
      private.is_admin()
      or assignee = (select auth.uid())
      or creator = (select auth.uid())
      or (assignee is not null and private.my_role() = 'manager' and private.can_see_profile(assignee))
    )
$$;
grant execute on function private.task_visible(uuid, uuid) to authenticated, service_role;
revoke execute on function private.task_visible(uuid, uuid) from anon, public;

drop policy "tasks: read" on public.tasks;
create policy "tasks: read" on public.tasks for select to authenticated
  using (private.task_visible(assignee_id, created_by));

drop policy "tasks: update" on public.tasks;
create policy "tasks: update" on public.tasks for update to authenticated
  using (private.task_visible(assignee_id, created_by))
  with check (
    private.is_admin()
    or (private.my_role() = 'manager' and (assignee_id is null or private.can_see_profile(assignee_id)))
    or (assignee_id = (select auth.uid()) and private.is_active_user())
  );
