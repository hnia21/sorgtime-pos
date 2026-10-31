create table if not exists addons (
  id text primary key,
  name text not null,
  price integer not null default 0
);

comment on table addons is 'Daftar tambahan (topping, es, dll)';
comment on column addons.id is 'ID tambahan unik';
comment on column addons.name is 'Nama tambahan';
comment on column addons.price is 'Harga tambahan';