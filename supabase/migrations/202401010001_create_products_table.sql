create table if not exists products (
  id integer primary key,
  name text not null,
  category text not null,
  price integer not null default 0,
  image text,
  badge text,
  sold integer default 0
);

comment on table products is 'Daftar menu minuman dan makanan';
comment on column products.id is 'ID produk unik';
comment on column products.name is 'Nama menu';
comment on column products.category is 'Kategori menu';
comment on column products.price is 'Harga jual';
comment on column products.image is 'Path gambar menu';
comment on column products.badge is 'Badge status (TERLARIS, FAVORIT, dll)';
comment on column products.sold is 'Jumlah terjual';