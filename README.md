# Maspion GitHub Explorer

Aplikasi web untuk mencari dan membandingkan profil GitHub developer.

## Fitur Utama

- Mencari pengguna GitHub berdasarkan username
- Menampilkan profil lengkap, avatar, bio, statistik pengikut, dan daftar repositori
- Memfilter dan mengurutkan repositori berdasarkan bahasa, bintang (stars), forks, atau pembaruan terakhir
- Dashboard statistik untuk melihat total bintang, forks, dan bahasa teratas
- Membandingkan dua developer secara berdampingan (side-by-side)
- Mode Gelap / Terang dengan preferensi tersimpan pada browser
- Dukungan GitHub Personal Access Token (PAT) untuk meningkatkan batas rate API

## Demo Langsung

Aplikasi tersedia di:

```text
https://maspion-project.vercel.app/
```

## Cara Menjalankan

1. Install dependensi:

```bash
npm install
```

2. Jalankan development server:

```bash
npm run dev
```

3. Buka browser ke:

```text
http://localhost:5173
```

4. Build untuk production:

```bash
npm run build
```

5. Preview hasil build:

```bash
npm run preview
```

## Struktur Proyek

```
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

## Teknologi

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS v4
- Lucide React
- GitHub REST API v3

## Catatan Demo

- Fokus pada alur pencarian profil dan tampilan repositori
- Tunjukkan fitur perbandingan dua developer secara bersamaan
- Jelaskan cara kerja Personal Access Token (PAT) untuk menambah limit API
- Sorot fitur filter dan pengurutan sebagai nilai tambah untuk analisis kode

## Penanganan Error

Aplikasi menampilkan pesan kesalahan yang jelas ketika terjadi kondisi berikut:

- Username tidak ditemukan → tampilkan instruksi untuk memeriksa kembali input
- Batas rate API habis → arahkan pengguna untuk memasukkan GitHub PAT
- PAT tidak valid atau kedaluwarsa → informasikan pengguna agar mengganti token
- Gangguan koneksi jaringan → instruksikan pengguna untuk memeriksa koneksi internet
- Gagal memuat data repositori → berikan opsi untuk mengulangi pencarian

## Script yang Tersedia

- `npm run dev` — jalankan development server
- `npm run build` — build aplikasi untuk produksi
- `npm run preview` — preview hasil build
- `npm run lint` — cek kualitas kode dengan ESLint

---

## Langkah 12 — Jalankan & Uji Aplikasi

### Jalankan dev server:

```bash
npm run dev
```

Buka browser ke **http://localhost:5173**

### Checklist pengujian:

- [ ] Halaman terbuka dengan tampilan dark/light mode
- [ ] Toggle dark/light mode berfungsi dan tersimpan setelah refresh
- [ ] Ketik username GitHub → profil dan daftar repo muncul
- [ ] Preset users (torvalds, gaearon, dll.) bisa diklik langsung
- [ ] Riwayat pencarian muncul setelah beberapa kali mencari
- [ ] Tab Repos → filter bahasa dan sort berfungsi
- [ ] Tab Stats → chart bahasa dan statistik tampil dengan benar
- [ ] Tab Compare → isi dua username → data muncul side-by-side dengan highlight pemenang
- [ ] Input PAT Token → status berubah menjadi "PAT Active"
- [ ] Indikator rate limit menampilkan angka yang berubah setelah pencarian

### Cara membuat PAT Token GitHub (opsional, untuk tambah limit API):

1. Login ke [github.com](https://github.com)
2. Klik foto profil → **Settings**
3. Scroll ke bawah → **Developer settings** (sidebar kiri)
4. Klik **Personal access tokens** → **Tokens (classic)**
5. Klik **Generate new token (classic)**
6. Isi **Note** (contoh: "GitView App"), pilih **Expiration**
7. **Scopes:** tidak perlu centang apa-apa untuk data publik
8. Klik **Generate token** → **salin token (hanya tampil sekali!)**
9. Paste di kolom PAT Token di aplikasi → klik **Save**

> ⚠️ **Jangan pernah commit PAT Token ke Git repository!** Token yang bocor bisa disalahgunakan.

---

## 🧪 Perintah yang Tersedia

```bash
# Jalankan development server dengan hot reload aktif
npm run dev

# Build untuk production (output ke folder /dist)
npm run build

# Preview hasil build production secara lokal
npm run preview

# Jalankan ESLint untuk cek kualitas kode
npm run lint
```

**Perbedaan `dev` vs `build`:**

| Perintah | Tujuan | Kode |
|---|---|---|
| `npm run dev` | Pengembangan | Tidak dioptimasi, ada hot reload |
| `npm run build` | Production | Dioptimasi & diminifikasi, siap di-deploy |

---

## 📚 Referensi

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [GitHub REST API v3 Docs](https://docs.github.com/en/rest)
- [Lucide React Icons](https://lucide.dev)

---

