# Maspion GitHub Explorer

Aplikasi web sederhana untuk melihat profil GitHub developer, cek repositori, dan membandingkan dua akun secara langsung.

## Fitur utama

- Cari pengguna GitHub berdasarkan username
- Lihat profil lengkap, avatar, bio, jumlah follower, dan daftar repositori
- Filter dan urutkan repositori berdasarkan bahasa, bintang, fork, atau terakhir diperbarui
- Lihat statistik ringkas seperti total bintang, fork, dan bahasa yang paling sering dipakai
- Bandingkan dua developer secara berdampingan
- Pilih mode gelap atau terang dan simpan preferensi di browser
- Bisa pakai GitHub Personal Access Token (PAT) supaya batas API lebih besar

## Demo

Aplikasi ini bisa dilihat di:

```text
https://maspion-project.vercel.app/
```

## Cara menjalankan

1. Install dependensi:

```bash
npm install
```

2. Jalankan development server:

```bash
npm run dev
```

3. Buka browser di:

```text
http://localhost:5173
```

4. Kalau mau build untuk production:

```bash
npm run build
```

5. Kalau mau lihat hasil build lokal:

```bash
npm run preview
```

## Struktur proyek

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── App.css
└── components/
    ├── Navbar.tsx
    ├── UserProfile.tsx
    ├── RepoList.tsx
    ├── StatsDashboard.tsx
    └── CompareDevelopers.tsx
```

## Teknologi yang dipakai

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Lucide React
- GitHub REST API

## Tips saat pakai demo

- Fokus ke alur pencarian profil dan tampilan repositori
- Coba fitur perbandingan dua developer sekaligus
- Kalau sering kena batas API, pakai PAT supaya lebih nyaman
- Manfaatkan filter dan pengurutan untuk melihat repositori yang lebih relevan

## Kalau ada error

Aplikasi akan menampilkan pesan yang cukup jelas kalau:

- Username tidak ditemukan
- Batas API habis
- PAT tidak valid atau sudah kadaluarsa
- Koneksi internet bermasalah
- Data repositori gagal dimuat

## Perintah yang tersedia

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Batas API GitHub

Tanpa token, GitHub API biasanya memberi batas sekitar 60 request per jam. Kalau pakai Personal Access Token, batasnya bisa naik sampai 5.000 request per jam.

## Cara membuat PAT GitHub (opsional)

Kalau mau menambah batas API, kamu bisa bikin token dari akun GitHub.

1. Masuk ke GitHub
2. Buka menu profil lalu pilih Settings
3. Masuk ke Developer settings
4. Pilih Personal access tokens
5. Klik Generate new token
6. Isi note dan pilih masa berlaku token
7. Kalau cuma butuh data publik, biasanya tidak perlu memberi scope tambahan
8. Salin token dan tempelkan di aplikasi

> Jangan pernah menyimpan token di repo atau membagikannya ke orang lain.

