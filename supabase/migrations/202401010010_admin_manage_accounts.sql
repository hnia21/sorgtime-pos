-- Menu Akun: admin/sysadmin dapat mengedit akun non-sysadmin, termasuk
-- mereset password ketika pengguna lupa password.
--
-- Catatan keamanan:
--   * Fungsi berjalan sebagai SECURITY DEFINER agar dapat memperbarui
--     auth.users.encrypted_password tanpa membocorkan service_role key.
--   * Akun sysadmin tidak dapat diubah dari menu ini.
--   * Admin hanya dapat mengubah akun barista. Sysadmin dapat mengubah
--     akun admin dan barista, tetapi bukan akun sysadmin lain.
--   * Pengguna tidak dapat mengubah akunnya sendiri lewat fungsi ini.

create or replace function public.admin_manage_account(
  target uuid,
  new_name text default null,
  new_role text default null,
  new_status text default null,
  new_password text default null
)
returns public.users
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  caller_role text := public.current_app_role();
  target_role text;
  result public.users;
begin
  if caller_role not in ('sysadmin', 'admin') then
    raise exception 'Hanya admin yang dapat mengubah akun';
  end if;

  if target = auth.uid() then
    raise exception 'Gunakan menu Profil untuk mengubah akun sendiri';
  end if;

  select role into target_role from public.users where id = target;
  if target_role is null then
    raise exception 'Akun tidak ditemukan';
  end if;

  if target_role = 'sysadmin' then
    raise exception 'Akun sysadmin tidak dapat diubah dari menu akun';
  end if;

  if caller_role = 'admin' and target_role <> 'barista' then
    raise exception 'Admin hanya dapat mengubah akun barista';
  end if;

  if new_role is not null and new_role not in ('admin', 'barista') then
    raise exception 'Peran tidak valid';
  end if;

  if new_status is not null and new_status not in ('active', 'inactive') then
    raise exception 'Status tidak valid';
  end if;

  if new_password is not null and length(new_password) < 6 then
    raise exception 'Password minimal 6 karakter';
  end if;

  update public.users set
    name = coalesce(nullif(trim(new_name), ''), name),
    role = coalesce(new_role, role),
    status = coalesce(new_status, status)
  where id = target
  returning * into result;

  if new_password is not null then
    update auth.users
       set encrypted_password = crypt(new_password, gen_salt('bf')),
           updated_at = now()
     where id = target;
    if not found then
      raise exception 'Akun belum terhubung ke Supabase Auth';
    end if;
  end if;

  return result;
end;
$$;

revoke all on function public.admin_manage_account(uuid, text, text, text, text) from public;
grant execute on function public.admin_manage_account(uuid, text, text, text, text) to authenticated;
