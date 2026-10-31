create table if not exists users (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'barista' check (role in ('sysadmin', 'admin', 'barista')),
  name text,
  username text unique,
  created_at timestamptz default now()
);

comment on table users is 'Akun pengguna aplikasi';
comment on column users.role is 'Peran pengguna (sysadmin, admin, barista)';
comment on column users.name is 'Nama lengkap';
comment on column users.username is 'Username untuk login';
comment on column users.created_at is 'Waktu dibuat';