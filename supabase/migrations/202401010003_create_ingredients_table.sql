create table if not exists ingredients (
  id integer primary key generated always as identity,
  name text not null,
  sku text,
  category text not null,
  icon text,
  stock numeric not null default 0,
  unit text not null,
  min_stock numeric not null default 0,
  max_stock numeric not null default 9999
);

comment on table ingredients is 'Bahan baku dan inventori';
comment on column ingredients.id is 'ID bahan unik';
comment on column ingredients.name is 'Nama bahan';
comment on column ingredients.sku is 'SKU bahan';
comment on column ingredients.category is 'Kategori bahan';
comment on column ingredients.icon is 'Icon tampilan';
comment on column ingredients.stock is 'Stok tersedia';
comment on column ingredients.unit is 'Satuan (L, pcs, kg)';
comment on column ingredients.min_stock is 'Stok minimum';
comment on column ingredients.max_stock is 'Stok maksimum';