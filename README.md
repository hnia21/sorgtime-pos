# Sorgtime POS

Prototipe fungsional aplikasi kasir dan operasional Sorgtime Diet Coffee. Aplikasi menggunakan data produk, aset, palet, dan identitas visual dari proyek Sorgtime serta mencakup POS, KDS barista, inventori berbasis resep, pelanggan/loyalty, laporan, transaksi tunai dan QRIS statis, serta simulasi offline.

Data transaksi dimulai dari nol. Nomor antrean dimulai dari `A-001`, transaksi tidak menambahkan pajak, QRIS merchant dapat diunggah dan ditampilkan dalam ukuran besar agar mudah dipindai, dan nota 80 mm berlogo Sorgtime dicetak melalui dialog printer browser.

Kasir menggunakan siklus shift penuh. Saat shift dibuka, kas awal dicatat dan nomor antrean direset ke `A-001`; setiap transaksi tetap memiliki ID internal unik agar nomor yang berulang antarsift tidak tertukar. Saat shift ditutup, kas aktual dan selisih kas disimpan, katalog serta pembayaran dikunci, dan transaksi baru hanya dapat dibuat setelah shift berikutnya dibuka. Riwayat lima shift terakhir tersedia dari tombol status shift.

Sysadmin dan admin dapat membuat atau mengedit promo/voucher (persentase maupun nominal, termasuk minimum pembelian), mengelola katalog menu lengkap dengan foto dan harga, serta menambah, mengedit, atau menghapus setiap item “Tambahan” langsung dari modal Atur Pesanan. Foto yang diunggah dioptimalkan sebelum disimpan. Pengaturan tersebut tersimpan di perangkat dan harga item yang sudah masuk keranjang tidak diubah secara retroaktif.

Inventori mendukung penambahan dan pengeditan item bahan, penghapusan item, serta penyesuaian stok dengan mode tambah, kurangi, atau set jumlah aktual. Setiap penyesuaian dicatat sebagai pergerakan stok lokal dan diringkas pada metrik harian.

Resep dan HPP awal disinkronkan dari `dist/assets/hpp.xlsx` untuk Original Soft, Original Strong, Caramel, Tiramisu, Hazelnut, dan Matcha. Setiap penjualan mengurangi stok berdasarkan pemakaian ml, gram, atau pcs per gelas. Admin dapat mengubah pemetaan item stok, takaran, satuan, harga beli, dan isi kemasan melalui tombol **Resep & HPP**.

Halaman **Riwayat transaksi** menyimpan waktu pemesanan, kasir, pelanggan, jumlah item, metode pembayaran, status, HPP, porsi bonus pekerja, dan laba kotor. Nilai HPP serta bonus disimpan sebagai snapshot saat transaksi agar laporan lama tidak berubah ketika resep diedit. Riwayat dapat difilter berdasarkan tanggal, kasir, pembayaran, status, atau kata kunci, diekspor ke CSV, dibuka detail jejak statusnya, dan dicetak ulang sebagai nota 80 mm.

Halaman **Laporan** menyediakan filter tanggal, karyawan, dan metode pembayaran; preset hari ini, kemarin, tujuh hari, dan bulan berjalan; perbandingan omzet harian dengan hari sebelumnya; laporan HPP dan laba operasional; arus kas aktual; menu terlaris; distribusi pembayaran; serta ekspor CSV lengkap. Penggajian dihitung berdasarkan kehadiran shift/transaksi atau koreksi kehadiran manual, sehingga barista dan karyawan tanpa transaksi tetap dapat dicatat. Standar awalnya Rp500.000 per bulan dengan empat hari libur dan bonus Rp1.000 per cup minuman sesuai kasir. Bonus selalu memakai seluruh cup pada periode dan tidak berubah ketika penjualan difilter berdasarkan metode pembayaran. Hanya sysadmin yang dapat mencatat pembayaran gaji atau memilih sasaran **semua karyawan**. Nominal pembayaran per karyawan menerima nilai rupiah bulat berapa pun; pelunasan semua karyawan mencatat sisa hak tiap orang sebagai transaksi pembayaran terpisah. Laporan menampilkan total hak, jumlah dibayar, sisa kewajiban, arus kas aktual, serta estimasi kas setelah seluruh kewajiban dibayar. Bonus pekerja yang sudah menjadi komponen HPP resep direkonsiliasi dan tidak dikurangkan dua kali. Pembelian inventori dicatat sebagai arus kas keluar ketika stok ditambahkan, bukan sebagai pengurang laba kedua setelah HPP. Menu terjual tanpa resep HPP ditandai sebagai data yang perlu dilengkapi.

Pembayaran gaji menampilkan seluruh akun karyawan aktif, termasuk yang belum memiliki absensi atau transaksi. Pilihan **Semua karyawan** menyediakan rincian nominal per orang yang dapat disunting dan total gabungan otomatis. Nominal Rp0 dilewati; pembayaran dicatat terpisah untuk setiap penerima dengan nominal positif. Tanpa kehadiran, hak gaji otomatis tetap Rp0, tetapi sysadmin dapat memasukkan pembayaran secara manual.

Pada pembukaan pertama, aplikasi meminta pembuatan akun `sysadmin`. Sysadmin memiliki akses penuh dan dapat membuat akun admin/barista; admin mengelola operasional dan akun barista; barista hanya dapat membuka KDS. Tidak tersedia akun atau password bawaan.

## Menjalankan secara lokal

```bash
python3 -m http.server 4173 --directory dist
```

Buka `http://localhost:4173`. Data demo disimpan di `localStorage` browser.

## Catatan

Versi ini adalah implementasi frontend local-first untuk validasi alur dan UX. Integrasi backend, printer native, gateway pembayaran, autentikasi PIN, dan sinkronisasi multi-perangkat memerlukan layanan produksi terpisah.
