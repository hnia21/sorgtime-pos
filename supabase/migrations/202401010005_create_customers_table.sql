create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  total_spent integer default 0,
  visits integer default 0,
  points integer default 0,
  created_at timestamptz default now()
);

comment on table customers is 'Data pelanggan & loyalty';
comment on column customers.name is 'Nama pelanggan';
comment on column customers.phone is 'No telepon';
comment on column customers.email is 'Email';
comment on column customers.total_spent is 'Total belanja';
comment on column customers.visits is 'Jumlah kunjungan';
comment on column customers.points is 'Poin';
comment on column customers.created_at is 'Waktu daftar';