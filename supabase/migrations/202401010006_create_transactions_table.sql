create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,
  user_id uuid references users(id) on delete set null,
  customer_id uuid references customers(id) on delete set null,
  subtotal integer not null default 0,
  discount integer default 0,
  total integer not null default 0,
  payment_method text not null default 'tunai' check (payment_method in ('tunai', 'qris')),
  status text not null default 'new' check (status in ('new', 'making', 'ready', 'done')),
  created_at timestamptz default now(),
  notes text
);

comment on table transactions is 'Riwayat transaksi penjualan';
comment on column transactions.id is 'ID transaksi unik';
comment on column transactions.order_number is 'Nomor order (A-001 format)';
comment on column transactions.user_id is 'ID kasir yang membuat transaksi';
comment on column transactions.customer_id is 'ID pelanggan (opsional)';
comment on column transactions.subtotal is 'Subtotal sebelum diskon';
comment on column transactions.discount is 'Nominal diskon';
comment on column transactions.total is 'Total bayar';
comment on column transactions.payment_method is 'Metode pembayaran';
comment on column transactions.status is 'Status transaksi';
comment on column transactions.created_at is 'Waktu transaksi';
comment on column transactions.notes is 'Catatan tambahan';