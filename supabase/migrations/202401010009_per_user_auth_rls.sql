-- Per-user Supabase Auth + Row Level Security untuk Sorgtime POS.
--
-- Prasyarat di Supabase Dashboard:
--   Authentication -> Providers -> Email -> Confirm email = OFF
-- agar akun dengan email sintetis (@sorgtime.local) bisa langsung dipakai.
--
-- Setelah migrasi ini dijalankan, anon key tidak lagi bisa membaca/menulis
-- pos_state maupun tabel users. Semua akses wajib memiliki sesi login.

-- 1. Profil pengguna
alter table public.users add column if not exists status text not null default 'active';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_status_check'
  ) then
    alter table public.users
      add constraint users_status_check check (status in ('active', 'inactive'));
  end if;
end $$;

-- 2. Bersihkan hash password lama dari snapshot pos_state
update public.pos_state set users = '[]'::jsonb where id = 1;

-- 3. Helper RLS (SECURITY DEFINER agar tidak rekursif ke RLS users)
create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid() and status = 'active'
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() is not null, false)
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('sysadmin', 'admin'), false)
$$;

create or replace function public.is_sysadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'sysadmin', false)
$$;

create or replace function public.has_any_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.users)
$$;

create or replace function public.bootstrap_first_admin(display_name text, uname text)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.users;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if exists(select 1 from public.users) then
    raise exception 'already initialized';
  end if;
  insert into public.users (id, role, name, username, status)
  values (auth.uid(), 'sysadmin', display_name, lower(uname), 'active')
  returning * into result;
  return result;
end $$;

create or replace function public.delete_app_user(target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_sysadmin() then
    raise exception 'not authorized';
  end if;
  if target = auth.uid() then
    raise exception 'cannot delete self';
  end if;
  delete from auth.users where id = target;
end $$;

revoke all on function public.current_app_role() from public;
revoke all on function public.is_staff() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_sysadmin() from public;
revoke all on function public.has_any_user() from public;
revoke all on function public.bootstrap_first_admin(text, text) from public;
revoke all on function public.delete_app_user(uuid) from public;

grant execute on function public.current_app_role() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_sysadmin() to authenticated;
grant execute on function public.has_any_user() to anon, authenticated;
grant execute on function public.bootstrap_first_admin(text, text) to authenticated;
grant execute on function public.delete_app_user(uuid) to authenticated;

-- 4. RLS tabel users
alter table public.users enable row level security;

drop policy if exists users_select on public.users;
create policy users_select on public.users
  for select to authenticated
  using (public.is_staff());

drop policy if exists users_insert on public.users;
create policy users_insert on public.users
  for insert to authenticated
  with check (public.is_admin() and (public.is_sysadmin() or role = 'barista'));

drop policy if exists users_update on public.users;
create policy users_update on public.users
  for update to authenticated
  using (public.is_sysadmin() or (public.is_admin() and role = 'barista') or id = auth.uid())
  with check (
    public.is_sysadmin()
    or (public.is_admin() and role = 'barista')
    or (id = auth.uid() and role = public.current_app_role() and status = 'active')
  );

drop policy if exists users_delete on public.users;
create policy users_delete on public.users
  for delete to authenticated
  using (public.is_sysadmin() and id <> auth.uid());

revoke all on public.users from anon;
grant select, insert, update, delete on public.users to authenticated;

-- 5. RLS tabel pos_state
drop policy if exists "pos_state read" on public.pos_state;
drop policy if exists "pos_state insert" on public.pos_state;
drop policy if exists "pos_state update" on public.pos_state;
drop policy if exists "pos_state delete" on public.pos_state;

create policy pos_state_select on public.pos_state
  for select to authenticated using (public.is_staff());
create policy pos_state_insert on public.pos_state
  for insert to authenticated with check (public.is_staff());
create policy pos_state_update on public.pos_state
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy pos_state_delete on public.pos_state
  for delete to authenticated using (public.is_staff());

revoke all on public.pos_state from anon;
grant select, insert, update, delete on public.pos_state to authenticated;
