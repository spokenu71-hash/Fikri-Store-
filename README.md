# Fikri Store

Fikri Store adalah brand retail pilihan produk berkualitas. Saat ini katalog berfokus pada laptop; struktur brand disiapkan untuk berkembang ke kategori elektronik dan kebutuhan lainnya secara bertahap.

Website dibangun menggunakan React, Vite, Tailwind CSS, dan Supabase.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:5173.

## Build production

```bash
npm run build
```

Hasil build tersedia di folder `dist/`.

## Deployment

Project terhubung ke GitHub dan Cloudflare Pages.

- Production branch: `main`.
- Preview deployment: pull request dan branch non-production yang diaktifkan pada pengaturan Cloudflare Pages.
- Build command: `npm run build`.
- Build output directory: `dist`.
- Framework preset: Vite.

Perubahan pada pull request ini ditujukan untuk Cloudflare Pages Preview; deployment production tetap mengikuti branch `main`. Konfigurasi Netlify sudah tidak digunakan.

## Konten dan katalog

- Data katalog dikelola melalui dashboard Admin dan disimpan di Supabase.
- Foto homepage dikelola melalui menu Foto di Admin.
- Nomor WhatsApp dan helper tautan pesan berada di `src/lib/products.js`.
- Kategori produk saat ini mengikuti kebutuhan katalog laptop yang sedang aktif. Penambahan kategori elektronik baru perlu disertai penyesuaian skema kategori dan filter Admin agar data tetap konsisten.
