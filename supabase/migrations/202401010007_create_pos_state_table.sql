create table if not exists public.pos_state (
  id integer primary key default 1 check (id = 1),
  state jsonb not null default '{}'::jsonb,
  users jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.pos_state is 'Snapshot state aplikasi Sorgtime POS (produk, transaksi, shift, inventori, laporan)';
comment on column public.pos_state.state is 'Seluruh state POS yang dipakai frontend';
comment on column public.pos_state.users is 'Akun pengguna beserta hash password';
comment on column public.pos_state.updated_at is 'Waktu terakhir data disimpan';

alter table public.pos_state enable row level security;

drop policy if exists "pos_state read" on public.pos_state;
create policy "pos_state read" on public.pos_state for select using (true);

drop policy if exists "pos_state insert" on public.pos_state;
create policy "pos_state insert" on public.pos_state for insert with check (true);

drop policy if exists "pos_state update" on public.pos_state;
create policy "pos_state update" on public.pos_state for update using (true) with check (true);

drop policy if exists "pos_state delete" on public.pos_state;
create policy "pos_state delete" on public.pos_state for delete using (true);

grant select, insert, update, delete on public.pos_state to anon, authenticated;
