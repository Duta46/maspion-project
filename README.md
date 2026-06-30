# 🐙 GitView Analytics — Panduan Pembuatan Aplikasi

> Langkah-langkah lengkap membangun aplikasi **GitHub Explorer** dari nol menggunakan React, TypeScript, Vite, dan Tailwind CSS v4.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)

---

## 📖 Daftar Isi

1. [Gambaran Aplikasi](#-gambaran-aplikasi)
2. [Persiapan & Prasyarat](#-persiapan--prasyarat)
3. [Langkah 1 — Buat Proyek Vite + React + TypeScript](#langkah-1--buat-proyek-vite--react--typescript)
4. [Langkah 2 — Install & Konfigurasi Tailwind CSS v4](#langkah-2--install--konfigurasi-tailwind-css-v4)
5. [Langkah 3 — Install Library Tambahan](#langkah-3--install-library-tambahan)
6. [Langkah 4 — Atur Struktur Folder](#langkah-4--atur-struktur-folder)
7. [Langkah 5 — Konfigurasi CSS Global (`index.css`)](#langkah-5--konfigurasi-css-global-indexcss)
8. [Langkah 6 — Buat Komponen `Navbar.tsx`](#langkah-6--buat-komponen-navbartsx)
9. [Langkah 7 — Buat Komponen `UserProfile.tsx`](#langkah-7--buat-komponen-userprofiletsx)
10. [Langkah 8 — Buat Komponen `RepoList.tsx`](#langkah-8--buat-komponen-repolisttsx)
11. [Langkah 9 — Buat Komponen `StatsDashboard.tsx`](#langkah-9--buat-komponen-statsdashboardtsx)
12. [Langkah 10 — Buat Komponen `CompareDevelopers.tsx`](#langkah-10--buat-komponen-comparedeveloperstsx)
13. [Langkah 11 — Rakit Semua di `App.tsx`](#langkah-11--rakit-semua-di-apptsx)
14. [Langkah 12 — Jalankan & Uji Aplikasi](#langkah-12--jalankan--uji-aplikasi)
15. [Perintah yang Tersedia](#-perintah-yang-tersedia)

---

## 🎯 Gambaran Aplikasi

**GitView Analytics** adalah aplikasi web Single Page Application (SPA) yang terhubung ke **GitHub REST API v3**. Pengguna dapat:

| Fitur | Deskripsi |
|---|---|
| 🔍 **Cari Developer** | Ketik username GitHub → tampil profil lengkap |
| 📁 **Daftar Repositori** | Lihat semua repo publik, sort by stars/forks/update |
| 📊 **Statistics Dashboard** | Chart distribusi bahasa, total stars, dan ringkasan aktivitas |
| ⚖️ **Compare Developers** | Bandingkan dua developer secara berdampingan |
| 🌓 **Dark / Light Mode** | Toggle tema, pilihan tersimpan otomatis di browser |
| 🔑 **PAT Token** | Input token pribadi untuk meningkatkan batas API |
| 🕓 **Search History** | Riwayat 5 pencarian terakhir tersimpan di browser |
| ⚡ **Rate Limit Indicator** | Tampilkan sisa kuota API secara real-time |

**Tech Stack yang digunakan:**

| Teknologi | Versi | Peran |
|---|---|---|
| React | 19 | Library UI berbasis komponen |
| TypeScript | ~6 | Type safety, cegah bug sebelum runtime |
| Vite | 8 | Build tool & dev server yang sangat cepat |
| Tailwind CSS | v4 | Utility-first CSS framework |
| Lucide React | ^1.22 | Library ikon SVG siap pakai |
| GitHub REST API v3 | — | Sumber data utama (profil, repo, dll.) |

---

## ⚙️ Persiapan & Prasyarat

Sebelum memulai, pastikan sudah terinstal:

### Node.js (wajib)

Node.js adalah runtime JavaScript. npm (package manager) terinstal otomatis bersamanya.

```bash
# Cek versi — harus Node.js 18 atau lebih baru
node --version   # Contoh output: v22.0.0
npm --version    # Contoh output: 10.5.0
```

> Belum punya? Download di [nodejs.org](https://nodejs.org) → pilih versi **LTS**.

### Code Editor

Gunakan **Visual Studio Code** ([code.visualstudio.com](https://code.visualstudio.com)).

Extension yang disarankan:
- **ESLint** — deteksi masalah kode
- **Tailwind CSS IntelliSense** — autocomplete class Tailwind
- **Prettier** — format kode otomatis

---

## Langkah 1 — Buat Proyek Vite + React + TypeScript

Vite adalah build tool modern yang jauh lebih cepat dari Create React App. Template `react-ts` sudah menyertakan React + TypeScript siap pakai.

### Jalankan perintah ini di terminal:

```bash
npm create vite@latest maspion-project -- --template react-ts
```

**Penjelasan flag:**
- `npm create vite@latest` — jalankan scaffolding Vite versi terbaru
- `maspion-project` — nama folder proyek yang akan dibuat
- `--template react-ts` — gunakan template React + TypeScript

### Masuk ke folder dan install dependensi awal:

```bash
cd maspion-project
npm install
```

> `npm install` mengunduh semua library ke folder `node_modules/`. Proses ini butuh waktu 1–3 menit tergantung koneksi internet.

### Coba jalankan untuk memastikan setup berhasil:

```bash
npm run dev
```

Buka browser ke **http://localhost:5173** — seharusnya muncul halaman default Vite + React.

> Tekan `Ctrl + C` di terminal untuk menghentikan dev server setelah konfirmasi berhasil.

### Struktur awal yang dibuat Vite:

```
maspion-project/
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── public/
│   └── vite.svg
└── src/
    ├── main.tsx        ← Titik masuk React
    ├── App.tsx         ← Komponen root (akan kita ubah total)
    ├── App.css         ← CSS untuk App (bisa dikosongkan)
    ├── index.css       ← CSS global (akan kita konfigurasi)
    └── assets/
```

---

## Langkah 2 — Install & Konfigurasi Tailwind CSS v4

Tailwind CSS v4 menggunakan pendekatan **"CSS-first"** — tidak perlu file `tailwind.config.js` terpisah. Konfigurasi dilakukan langsung di dalam file CSS.

### Install Tailwind dan plugin Vite-nya:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

**Penjelasan:**
- `tailwindcss` — core library Tailwind CSS v4
- `@tailwindcss/vite` — plugin agar Vite bisa memproses Tailwind
- `-D` — install sebagai *devDependency* (hanya untuk development, bukan production)

### Daftarkan plugin di `vite.config.ts`:

Buka file `vite.config.ts` dan ubah menjadi:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'   // ← tambahkan baris ini

export default defineConfig({
  plugins: [react(), tailwindcss()],            // ← tambahkan tailwindcss()
})
```

### Aktifkan Tailwind di `src/index.css`:

Ganti seluruh isi `src/index.css` dengan baris import di paling atas:

```css
@import "tailwindcss";
```

> ✅ Setelah ini, semua Tailwind utility class sudah bisa digunakan di seluruh komponen React.

---

## Langkah 3 — Install Library Tambahan

### Install Lucide React (library ikon):

```bash
npm install lucide-react
```

Lucide menyediakan ratusan ikon SVG yang bisa langsung dipakai sebagai komponen React:

```tsx
import { Search, Star, GitFork } from 'lucide-react'

// Cara penggunaan
<Search className="h-4 w-4" />
<Star className="h-4 w-4 text-yellow-500" />
```

### Cek `package.json` setelah semua install:

File `package.json` seharusnya terlihat seperti ini:

```json
{
  "dependencies": {
    "lucide-react": "^1.22.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.1",
    "@vitejs/plugin-react": "^6.0.2",
    "tailwindcss": "^4.3.1",
    "typescript": "~6.0.2",
    "vite": "^8.1.0"
  }
}
```

---

## Langkah 4 — Atur Struktur Folder

Buat folder `components` di dalam `src/`, lalu siapkan file-file komponen yang akan kita isi di langkah berikutnya:

```bash
mkdir src/components
```

Atau buat manual lewat panel Explorer di VS Code. Struktur akhir yang kita tuju:

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── App.css
└── components/
    ├── Navbar.tsx
    ├── UserProfile.tsx
    ├── RepoList.tsx
    ├── StatsDashboard.tsx
    └── CompareDevelopers.tsx
```

---

## Langkah 5 — Konfigurasi CSS Global (`index.css`)

File `src/index.css` adalah tempat kita mengatur style global aplikasi. Isi dengan konfigurasi lengkap berikut:

```css
@import "tailwindcss";

/* Aktifkan dark mode berbasis kelas .dark di elemen ancestor */
@custom-variant dark (&:where(.dark, .dark *));

/* Transisi warna yang halus saat toggle dark/light mode */
body {
  transition: background-color 300ms ease, color 300ms ease;
}

/* Scrollbar kustom untuk tampilan yang lebih bersih */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
```

**Penjelasan baris penting:**

| Baris | Fungsi |
|---|---|
| `@import "tailwindcss"` | Aktifkan semua utility class Tailwind |
| `@custom-variant dark (...)` | Beritahu Tailwind cara membaca kelas `.dark` untuk dark mode |
| `transition: background-color 300ms` | Transisi warna mulus 300ms saat toggle tema |

---

## Langkah 6 — Buat Komponen `Navbar.tsx`

Navbar adalah header sticky di bagian atas halaman. Komponen ini menerima data dari `App.tsx` melalui **props**.

**Buat file `src/components/Navbar.tsx`**

Navbar memiliki empat bagian utama:
- Logo "GitView Analytics" di kiri
- Indikator rate limit API (warna berubah sesuai sisa kuota)
- Tombol untuk input PAT Token (tersimpan ke `localStorage`)
- Tombol toggle dark/light mode

**Definisikan interface Props:**

```tsx
interface RateLimit {
  limit: number
  remaining: number
  reset: number
}

interface NavbarProps {
  patToken: string
  onPatTokenChange: (token: string) => void
  rateLimit: RateLimit | null
  theme: 'dark' | 'light'
  onThemeToggle: () => void
}
```

**Logika warna indikator rate limit:**

```tsx
const getRateLimitColor = () => {
  if (!rateLimit) return 'text-zinc-400'
  const percentage = (rateLimit.remaining / rateLimit.limit) * 100
  if (percentage > 50) return 'text-emerald-400'   // Banyak sisa → hijau
  if (percentage > 20) return 'text-amber-400'      // Menipis → kuning
  return 'text-red-400'                             // Hampir habis → merah
}
```

**Ekspor komponen:**

```tsx
export const Navbar: React.FC<NavbarProps> = ({
  patToken,
  onPatTokenChange,
  rateLimit,
  theme,
  onThemeToggle
}) => {
  // ... JSX navbar
}
```

---

## Langkah 7 — Buat Komponen `UserProfile.tsx`

Komponen ini menampilkan kartu profil lengkap dari user GitHub yang dicari.

**Buat file `src/components/UserProfile.tsx`**

**Pertama, definisikan interface dan ekspor agar bisa diimpor dari `App.tsx`:**

```tsx
export interface GitHubUser {
  login: string           // Username (contoh: "torvalds")
  name: string | null     // Nama lengkap (bisa null jika tidak diisi)
  avatar_url: string      // URL foto profil
  bio: string | null      // Bio singkat
  public_repos: number    // Jumlah repo publik
  followers: number       // Jumlah followers
  following: number       // Jumlah following
  location: string | null // Lokasi (contoh: "Helsinki, Finland")
  blog: string | null     // Website personal
  company: string | null  // Perusahaan
  html_url: string        // URL profil GitHub
  created_at: string      // Tanggal akun dibuat (format ISO 8601)
}

interface UserProfileProps {
  user: GitHubUser
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  // ... JSX kartu profil
}
```

**Yang ditampilkan di kartu profil:**
- Foto avatar bundar di kiri
- Nama lengkap + `@username`
- Teks bio
- Tiga angka statistik: **Followers**, **Following**, **Repos**
- Baris info tambahan (hanya tampil jika datanya ada): lokasi, website, perusahaan
- Tombol **"View on GitHub"** dengan link ke `user.html_url`

---

## Langkah 8 — Buat Komponen `RepoList.tsx`

Komponen ini menampilkan daftar repositori publik dengan fitur filter bahasa dan pengurutan.

**Buat file `src/components/RepoList.tsx`**

**Definisikan interface data repositori dan ekspor:**

```tsx
export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number    // Jumlah bintang
  forks_count: number         // Jumlah fork
  language: string | null     // Bahasa pemrograman utama
  updated_at: string          // Kapan terakhir diupdate
  license: { name: string } | null
  fork: boolean               // Apakah ini fork dari repo lain
}
```

**Implementasikan tiga state kontrol:**

```tsx
const [filterLang, setFilterLang] = useState('all')   // Filter bahasa
const [sortBy, setSortBy] = useState('stars')          // Cara pengurutan
const [searchTerm, setSearchTerm] = useState('')       // Pencarian nama repo
```

**Logika filter + sort (client-side):**

```tsx
const filteredAndSortedRepos = repos
  .filter(repo => {
    const langMatch = filterLang === 'all' || repo.language === filterLang
    const searchMatch = repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    return langMatch && searchMatch
  })
  .sort((a, b) => {
    if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count
    if (sortBy === 'forks') return b.forks_count - a.forks_count
    // Default: sort by updated_at (terbaru di atas)
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })
```

**Daftar bahasa untuk dropdown filter — otomatis dari data:**

```tsx
const languages = ['all', ...new Set(repos.map(r => r.language).filter(Boolean) as string[])]
```

---

## Langkah 9 — Buat Komponen `StatsDashboard.tsx`

Dashboard analitik yang merangkum statistik dari semua repositori user.

**Buat file `src/components/StatsDashboard.tsx`**

**Hitung semua statistik dari array repos:**

```tsx
// Total bintang dari semua repo
const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)

// Total fork dari semua repo
const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0)

// Rata-rata bintang per repo
const avgStars = repos.length > 0 ? (totalStars / repos.length).toFixed(1) : '0'

// Repo paling populer (paling banyak bintang)
const topRepo = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0]

// Hitung distribusi bahasa pemrograman
const languageMap: Record<string, number> = {}
repos.forEach(repo => {
  if (repo.language) {
    languageMap[repo.language] = (languageMap[repo.language] || 0) + 1
  }
})
```

**Visualisasi chart bahasa — dibuat murni dengan CSS (tanpa library chart):**

```tsx
const maxCount = Math.max(...Object.values(languageMap))

{Object.entries(languageMap)
  .sort(([, a], [, b]) => b - a)   // Sort dari yang terbanyak
  .slice(0, 8)                      // Ambil 8 bahasa teratas
  .map(([lang, count]) => (
    <div key={lang} className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{lang}</span>
        <span>{count} repo</span>
      </div>
      {/* Lebar bar proporsional terhadap jumlah repo */}
      <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full">
        <div
          className="h-2 rounded-full bg-indigo-500"
          style={{ width: `${(count / maxCount) * 100}%` }}
        />
      </div>
    </div>
  ))
}
```

---

## Langkah 10 — Buat Komponen `CompareDevelopers.tsx`

Komponen untuk membandingkan dua developer GitHub secara berdampingan.

**Buat file `src/components/CompareDevelopers.tsx`**

**Interface Props:**

```tsx
interface CompareDevelopersProps {
  patToken: string
  onRateLimitUpdate: (headers: Headers) => void
}
```

**Fetch dua user secara paralel menggunakan `Promise.all`:**

```tsx
const handleCompare = async () => {
  setLoading(true)
  setError(null)

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    ...(patToken ? { Authorization: `token ${patToken}` } : {}),
  }

  try {
    // Promise.all menjalankan kedua fetch SECARA BERSAMAAN (paralel)
    // jauh lebih cepat dari menjalankan satu per satu (berurutan)
    const [res1, res2] = await Promise.all([
      fetch(`https://api.github.com/users/${username1}`, { headers }),
      fetch(`https://api.github.com/users/${username2}`, { headers }),
    ])

    onRateLimitUpdate(res1.headers)

    const [user1Data, user2Data] = await Promise.all([res1.json(), res2.json()])

    // Ambil juga data repo keduanya secara paralel
    const [repos1Data, repos2Data] = await Promise.all([
      fetch(`https://api.github.com/users/${username1}/repos?per_page=100`, { headers }).then(r => r.json()),
      fetch(`https://api.github.com/users/${username2}/repos?per_page=100`, { headers }).then(r => r.json()),
    ])

    setUser1({ user: user1Data, repos: repos1Data })
    setUser2({ user: user2Data, repos: repos2Data })
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
  } finally {
    setLoading(false)
  }
}
```

**Kategori yang dibandingkan dengan highlight pemenang:**

| Kategori | Penentu Pemenang |
|---|---|
| Followers | Yang lebih banyak |
| Public Repos | Yang lebih banyak |
| Total Stars | Yang lebih banyak |
| Total Forks | Yang lebih banyak |
| Account Age | Yang lebih lama (lebih senior) |

---

## Langkah 11 — Rakit Semua di `App.tsx`

`App.tsx` adalah komponen root yang menyatukan semua komponen dan mengelola seluruh state aplikasi.

**Buat/ganti `src/App.tsx` dengan struktur berikut:**

### Import semua yang dibutuhkan:

```tsx
import { useState, useEffect, useCallback } from 'react'
import { Navbar } from './components/Navbar'
import { UserProfile } from './components/UserProfile'
import type { GitHubUser } from './components/UserProfile'
import { RepoList } from './components/RepoList'
import type { GitHubRepo } from './components/RepoList'
import { StatsDashboard } from './components/StatsDashboard'
import { CompareDevelopers } from './components/CompareDevelopers'
import { Search, BookOpen, BarChart3, Users2, History, X, Loader2 } from 'lucide-react'
```

### Definisikan interface RateLimit:

```tsx
interface RateLimit {
  limit: number
  remaining: number
  reset: number
}
```

### Preset users — tombol cepat untuk developer terkenal:

```tsx
const PRESET_USERS = ['torvalds', 'gaearon', 'taylorotwell', 'yyx990803']
// torvalds     = Linus Torvalds (pencipta Linux & Git)
// gaearon      = Dan Abramov (co-creator Redux, React DevTools)
// taylorotwell = Taylor Otwell (pencipta Laravel)
// yyx990803    = Evan You (pencipta Vue.js & Vite)
```

### State yang dikelola App:

```tsx
function App() {
  // Tema — dibaca dari localStorage, fallback ke preferensi OS
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // PAT Token — dibaca dari localStorage
  const [patToken, setPatToken] = useState<string>(() => {
    return localStorage.getItem('github_pat') || ''
  })

  // Navigasi tab
  const [activeTab, setActiveTab] = useState<'explore' | 'compare'>('explore')
  const [exploreSubTab, setExploreSubTab] = useState<'repos' | 'stats'>('repos')

  // Data pencarian & profil aktif
  const [searchQuery, setSearchQuery] = useState('')
  const [activeUser, setActiveUser] = useState<GitHubUser | null>(null)
  const [activeRepos, setActiveRepos] = useState<GitHubRepo[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('search_history')
    return saved ? JSON.parse(saved) : []
  })

  // Status API & loading
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null)
```

### Implementasi Dark Mode:

```tsx
  // Terapkan kelas .dark ke <html> setiap kali state theme berubah
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)   // Simpan pilihan ke localStorage
  }, [theme])
```

### Fungsi baca rate limit dari header respons:

```tsx
  const updateRateLimit = useCallback((headers: Headers) => {
    const remaining = headers.get('X-RateLimit-Remaining')
    const limit = headers.get('X-RateLimit-Limit')
    const reset = headers.get('X-RateLimit-Reset')
    if (remaining && limit && reset) {
      setRateLimit({
        remaining: parseInt(remaining),
        limit: parseInt(limit),
        reset: parseInt(reset),
      })
    }
  }, [])
```

### Fungsi fetch data GitHub:

```tsx
  const fetchUserData = useCallback(async (username: string) => {
    setLoading(true)
    setError(null)

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      ...(patToken ? { Authorization: `token ${patToken}` } : {}),
    }

    try {
      // Fetch profil user
      const response = await fetch(`https://api.github.com/users/${username}`, { headers })
      updateRateLimit(response.headers)

      if (!response.ok) {
        if (response.status === 404) throw new Error('User tidak ditemukan')
        if (response.status === 403) throw new Error('Rate limit habis, tambahkan PAT Token')
        throw new Error(`Error ${response.status}`)
      }

      const userData = await response.json()
      setActiveUser(userData)

      // Fetch daftar repo
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100`,
        { headers }
      )
      const reposData = await reposResponse.json()
      setActiveRepos(reposData)

      // Simpan ke riwayat pencarian (max 5 item, no duplicate)
      setSearchHistory(prev => {
        const updated = [username, ...prev.filter(n => n !== username)].slice(0, 5)
        localStorage.setItem('search_history', JSON.stringify(updated))
        return updated
      })

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)   // Selalu matikan loading, baik sukses maupun gagal
    }
  }, [patToken, updateRateLimit])
```

### Handler PAT Token:

```tsx
  const handlePatTokenChange = (token: string) => {
    setPatToken(token)
    if (token) {
      localStorage.setItem('github_pat', token)
    } else {
      localStorage.removeItem('github_pat')
    }
  }
```

### GitHub API Endpoints yang digunakan:

| Endpoint | Method | Keterangan |
|---|---|---|
| `https://api.github.com/users/{username}` | GET | Profil pengguna |
| `https://api.github.com/users/{username}/repos?per_page=100` | GET | Daftar repositori (max 100) |
| `https://api.github.com/rate_limit` | GET | Info sisa kuota API |

**Batas rate limit:**
- Tanpa token: **60 request/jam**
- Dengan PAT Token: **5.000 request/jam**

### Render JSX — rakit semua komponen:

```tsx
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">

      {/* Navbar sticky di atas */}
      <Navbar
        patToken={patToken}
        onPatTokenChange={handlePatTokenChange}
        rateLimit={rateLimit}
        theme={theme}
        onThemeToggle={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Tab navigasi utama: Explore | Compare */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('explore')}>Explore</button>
          <button onClick={() => setActiveTab('compare')}>Compare</button>
        </div>

        {activeTab === 'explore' && (
          <>
            {/* Form pencarian username */}
            <form onSubmit={e => { e.preventDefault(); fetchUserData(searchQuery) }}>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Masukkan username GitHub..."
              />
              <button type="submit">Cari</button>
            </form>

            {/* Tombol preset users */}
            <div>
              {PRESET_USERS.map(user => (
                <button key={user} onClick={() => fetchUserData(user)}>
                  {user}
                </button>
              ))}
            </div>

            {/* Tampilkan loading / error / hasil */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {activeUser && (
              <>
                <UserProfile user={activeUser} />

                {/* Sub-tab: Repos | Stats */}
                <div>
                  <button onClick={() => setExploreSubTab('repos')}>Repositories</button>
                  <button onClick={() => setExploreSubTab('stats')}>Statistics</button>
                </div>

                {exploreSubTab === 'repos' && <RepoList repos={activeRepos} />}
                {exploreSubTab === 'stats' && <StatsDashboard repos={activeRepos} user={activeUser} />}
              </>
            )}
          </>
        )}

        {activeTab === 'compare' && (
          <CompareDevelopers
            patToken={patToken}
            onRateLimitUpdate={updateRateLimit}
          />
        )}

      </main>
    </div>
  )
}

export default App
```

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

<div align="center">
  <p>Dibuat dengan ❤️ menggunakan React + Vite + Tailwind CSS v4</p>
  <p>Data bersumber dari <a href="https://docs.github.com/en/rest">GitHub REST API v3</a></p>
</div>
