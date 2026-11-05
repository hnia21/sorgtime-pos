-- Aktifkan realtime untuk tabel pos_state agar perubahan langsung
-- terkirim ke semua perangkat yang membuka Sorgtime POS.
-- Jalankan di Supabase Dashboard -> SQL Editor. Polling 20 detik tetap
-- bekerja tanpa migrasi ini, jadi ini hanya untuk sinkronisasi instan.

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'pos_state'
  ) then
    alter publication supabase_realtime add table public.pos_state;
  end if;
end $$;
