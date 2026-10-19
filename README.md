# Fikri Store - Landing Page Laptop Second

Landing page e-commerce laptop second. Dibangun dengan React + Vite + Tailwind CSS.

## Cara Menjalankan

npm install
npm run dev

Buka http://localhost:5173

## Build Production

npm run build

Hasil build ada di folder dist/.

## Deploy ke Netlify

### Opsi 1 - Via Git (otomatis)
1. Push folder ini ke repository GitHub/GitLab
2. Di Netlify, klik Add new site lalu Import an existing project
3. Pilih repository Anda
4. Build command: npm run build (sudah ada di netlify.toml)
5. Publish directory: dist (sudah ada di netlify.toml)
6. Klik Deploy

### Opsi 2 - Drag and Drop (manual)
1. Jalankan npm run build
2. Buka https://app.netlify.com/drop
3. Drag folder dist/ ke halaman tersebut

File netlify.toml sudah dikonfigurasi: build command, publish directory, dan SPA redirect.

## Edit Konten

Semua data produk, harga, FAQ, use cases, value props, dan nomor WhatsApp ada di:
src/lib/products.js

Untuk ganti nomor WhatsApp, edit WHATSAPP_NUMBER di file tersebut.
