import { useState, useEffect, useCallback, useRef } from 'react'
import { Navbar } from './components/Navbar'
import { UserProfile } from './components/UserProfile'
import type { GitHubUser } from './components/UserProfile'
import { RepoList } from './components/RepoList'
import type { GitHubRepo } from './components/RepoList'
import { StatsDashboard } from './components/StatsDashboard'
import { CompareDevelopers } from './components/CompareDevelopers'
import { ProfileSkeleton, RepoListSkeleton } from './components/Skeleton'
import {
  Search,
  BookOpen,
  BarChart3,
  Users2,
  History,
  X,
  ShieldAlert,
  Compass,
  KeyRound,
} from 'lucide-react'

interface RateLimit {
  limit: number
  remaining: number
  reset: number
}

const PRESET_USERS = ['torvalds', 'gaearon', 'taylorotwell', 'yyx990803']

const getErrorMessage = (err: unknown) => {
  return err instanceof Error ? err.message : 'Terjadi kesalahan jaringan yang tidak terduga.'
}

const readSearchHistory = () => {
  const saved = localStorage.getItem('search_history')
  if (!saved) return []

  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    localStorage.removeItem('search_history')
    return []
  }
}

const fetchAllRepos = async (
  username: string,
  headers: Record<string, string>,
  onProgress?: (loadedCount: number) => void,
  onRateLimitUpdate?: (headers: Headers) => void
) => {
  const allRepos: GitHubRepo[] = []
  let page = 1

  while (true) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
      { headers }
    )
    onRateLimitUpdate?.(response.headers)

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token GitHub PAT Anda tidak valid atau kedaluwarsa. Token telah dinonaktifkan. Silakan masukkan token PAT baru.')
      }
      if (response.status === 403) {
        throw new Error('Batas rate API GitHub telah habis. Tambahkan token PAT yang valid atau tunggu sampai batas direset.')
      }
      throw new Error(`Gagal mengambil repositori (Status ${response.status})`)
    }

    const repos: GitHubRepo[] = await response.json()
    allRepos.push(...repos)
    onProgress?.(allRepos.length)

    if (repos.length < 100) break
    page += 1
  }

  return allRepos
}


function App() {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // GitHub Personal Access Token State
  const [patToken, setPatToken] = useState<string>(() => {
    return localStorage.getItem('github_pat') || ''
  })

  // Navigation State
  const [activeTab, setActiveTab] = useState<'explore' | 'compare'>('explore')
  const [exploreSubTab, setExploreSubTab] = useState<'repos' | 'stats'>('repos')

  // Search and Active Profile State
  const [searchQuery, setSearchQuery] = useState('')
  const [activeUser, setActiveUser] = useState<GitHubUser | null>(null)
  const [activeRepos, setActiveRepos] = useState<GitHubRepo[]>([])
  const [activeUsers, setActiveUsers] = useState<GitHubUser[]>([])
  const [activeUsersRepos, setActiveUsersRepos] = useState<Record<string, GitHubRepo[]>>({})
  const [searchResults, setSearchResults] = useState<Partial<GitHubUser>[]>([])
  const [selectedResults, setSelectedResults] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    return readSearchHistory()
  })

  // API Status & Loading State
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null)
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [tokenNotice, setTokenNotice] = useState<string | null>(null)

  // Search input reference for keyboard focusing shortcut
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Apply Theme class
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K or / to focus search input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement).isContentEditable
      )

      if (
        (e.key === 'k' && (e.ctrlKey || e.metaKey)) ||
        (e.key === '/' && !isInput)
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      }

      if (e.key === 'Escape') {
        if (showTokenInput) {
          setShowTokenInput(false)
          return
        }
        if (error) setError(null)
        if (tokenNotice) setTokenNotice(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [error, showTokenInput, tokenNotice])

  // Save PAT token
  const handlePatTokenChange = useCallback((token: string) => {
    const trimmedToken = token.trim()
    setPatToken(trimmedToken)
    if (trimmedToken) {
      localStorage.setItem('github_pat', trimmedToken)
      setTokenNotice('Token PAT disimpan. Permintaan selanjutnya akan menggunakan batas API GitHub yang lebih tinggi.')
    } else {
      localStorage.removeItem('github_pat')
      setTokenNotice('Token PAT dihapus. Permintaan akan menggunakan batas API GitHub publik.')
    }
  }, [])

  // Update Rate Limit from Response Headers
  const updateRateLimit = useCallback((headers: Headers) => {
    const limit = headers.get('X-RateLimit-Limit')
    const remaining = headers.get('X-RateLimit-Remaining')
    const reset = headers.get('X-RateLimit-Reset')

    if (limit && remaining && reset) {
      setRateLimit({
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
      })
    }
  }, [])

  const disableToken = useCallback((message: string) => {
    handlePatTokenChange('')
    setShowTokenInput(true)
    setTokenNotice(message)
  }, [handlePatTokenChange])

  // Fetch Rate Limit directly
  const fetchRateLimit = useCallback(async () => {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      }
      if (patToken) {
        headers['Authorization'] = `token ${patToken}`
      }
      const res = await fetch('https://api.github.com/rate_limit', { headers })
      if (res.status === 401) {
        // Token is invalid/expired
        disableToken('Token Personal Access GitHub yang disimpan tidak valid atau kedaluwarsa. Kami menonaktifkannya. Silakan masukkan token PAT yang valid.')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setRateLimit({
          limit: data.rate.limit,
          remaining: data.rate.remaining,
          reset: data.rate.reset,
        })
      }
    } catch (err) {
      console.error('Error fetching rate limit:', err)
    }
  }, [patToken, disableToken])

  // Fetch initially and when token changes
  useEffect(() => {
    fetchRateLimit()
  }, [fetchRateLimit])

  // Main Fetch logic for single user
  const fetchUserData = useCallback(async (username: string) => {
    if (!username.trim()) return

    setLoading(true)
    setLoadingMessage(`Memuat profil ${username.trim()}...`)
    setError(null)

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    }
    if (patToken) {
      headers['Authorization'] = `token ${patToken}`
    }

    try {
      // 1. Fetch User Profile
      const userRes = await fetch(`https://api.github.com/users/${username}`, { headers })
      updateRateLimit(userRes.headers)

      if (!userRes.ok) {
        if (userRes.status === 401) {
          disableToken('Token Personal Access Anda tidak valid atau kedaluwarsa. Silakan masukkan token GitHub PAT yang valid.')
          throw new Error('Token Personal Access Anda tidak valid atau kedaluwarsa. Kami telah menonaktifkannya. Silakan masukkan token GitHub PAT yang valid di pengaturan.')
        }
        if (userRes.status === 404) {
          throw new Error(`Pengguna GitHub "${username}" tidak ditemukan. Periksa kembali nama yang dimasukkan.`)
        }
        if (userRes.status === 403) {
          throw new Error('Batas API telah terlampaui. Silakan tambahkan Personal Access Token (PAT) di pengaturan.')
        }
        throw new Error(`Kesalahan API (Status ${userRes.status})`)
      }

      const userData: GitHubUser = await userRes.json()

      // 2. Fetch User Repos
      setLoadingMessage(`Memuat repositori untuk ${username.trim()}...`)
      const reposData = await fetchAllRepos(
        username.trim(),
        headers,
        (loadedCount) => setLoadingMessage(`Memuat ${loadedCount} repositori...`),
        updateRateLimit
      )

      // Update states (single-user mode)
      setActiveUser(userData)
      setActiveRepos(reposData)
      // clear multi-user state and any previous search result list
      setActiveUsers([])
      setActiveUsersRepos({})
      setSearchResults([])
      setSelectedResults([])

      // Add to search history
      setSearchHistory((prev) => {
        const updated = [username, ...prev.filter((name) => name !== username)].slice(0, 5)
        localStorage.setItem('search_history', JSON.stringify(updated))
        return updated
      })
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }, [patToken, disableToken, updateRateLimit])

  // Fetch multiple users (up to 5)
  const fetchMultipleUsers = useCallback(async (usernames: string[]) => {
    if (!usernames.length) return
    if (usernames.length === 1) {
      await fetchUserData(usernames[0])
      return
    }

    setLoading(true)
    setLoadingMessage(`Menyiapkan pencarian untuk ${usernames.length} pengguna...`)
    setError(null)

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    }
    if (patToken) headers['Authorization'] = `token ${patToken}`

    const users: GitHubUser[] = []
    const reposMap: Record<string, GitHubRepo[]> = {}

    try {
      for (let i = 0; i < usernames.length; i++) {
        const username = usernames[i].trim()
        setLoadingMessage(`Memuat profil ${username}... (${i + 1}/${usernames.length})`)

        const userRes = await fetch(`https://api.github.com/users/${username}`, { headers })
        updateRateLimit(userRes.headers)
        if (!userRes.ok) {
          if (userRes.status === 401) {
            disableToken('Token Personal Access Anda tidak valid atau kedaluwarsa. Silakan masukkan token GitHub PAT yang valid.')
            throw new Error('Token Personal Access tidak valid atau kedaluwarsa.')
          }
          if (userRes.status === 404) throw new Error(`Pengguna GitHub "${username}" tidak ditemukan.`)
          if (userRes.status === 403) throw new Error('Batas API telah terlampaui. Tambahkan Personal Access Token (PAT).')
          throw new Error(`Kesalahan API (Status ${userRes.status})`)
        }

        const userData: GitHubUser = await userRes.json()
        users.push(userData)

        setLoadingMessage(`Memuat repositori ${username}...`)
        const repos = await fetchAllRepos(username, headers, (loaded) => setLoadingMessage(`Memuat ${loaded} repositori untuk ${username}...`), updateRateLimit)
        reposMap[userData.login] = repos
      }

      // Update states
      setActiveUsers(users)
      setActiveUsersRepos(reposMap)
      // clear single-user state
      setActiveUser(null)
      setActiveRepos([])

      // Add to search history (merge preserving order, up to 5)
      setSearchHistory((prev) => {
        const merged = [...usernames, ...prev].map((s) => s.trim()).filter(Boolean)
        const unique = Array.from(new Set(merged)).slice(0, 5)
        localStorage.setItem('search_history', JSON.stringify(unique))
        return unique
      })
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }, [patToken, disableToken, updateRateLimit])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const raw = searchQuery.trim()
    if (!raw) return
    // split by commas or whitespace, allow up to 5 usernames
    const candidates = raw.split(/[,\s]+/).filter(Boolean).slice(0, 5)
    if (candidates.length > 1) {
      fetchMultipleUsers(candidates)
    } else {
      // If single token, perform a search for matching usernames and show list
      searchUsersByLogin(candidates[0])
    }
  }
  
  // Search GitHub users by login substring and show list (max 5)
  const searchUsersByLogin = useCallback(async (query: string) => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setLoadingMessage(`Mencari pengguna "${query}"...`)

    const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
    if (patToken) headers['Authorization'] = `token ${patToken}`

    try {
      // search users by login
      const q = encodeURIComponent(`${query} in:login`)
      const res = await fetch(`https://api.github.com/search/users?q=${q}&per_page=5`, { headers })
      updateRateLimit(res.headers)
      if (!res.ok) {
        if (res.status === 401) {
          disableToken('Token Personal Access Anda tidak valid atau kedaluwarsa. Silakan masukkan token GitHub PAT yang valid.')
          throw new Error('Token tidak valid')
        }
        if (res.status === 403) throw new Error('Batas API GitHub terlampaui. Gunakan PAT.')
        throw new Error(`Gagal mencari pengguna (Status ${res.status})`)
      }

      const data = await res.json()
      const items: Partial<GitHubUser>[] = Array.isArray(data.items) ? data.items.slice(0, 5) : []
      setSearchResults(items)
      // clear any active user(s)
      setActiveUser(null)
      setActiveUsers([])
      setActiveRepos([])
      setActiveUsersRepos({})
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }, [patToken, disableToken, updateRateLimit])

  const handlePresetClick = (username: string) => {
    setSearchQuery(username)
    fetchUserData(username)
  }

  const clearHistoryItem = (e: React.MouseEvent, username: string) => {
    e.stopPropagation()
    setSearchHistory((prev) => {
      const updated = prev.filter((name) => name !== username)
      localStorage.setItem('search_history', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        patToken={patToken}
        onPatTokenChange={handlePatTokenChange}
        rateLimit={rateLimit}
        theme={theme}
        onThemeToggle={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        showInput={showTokenInput}
        onShowInputToggle={setShowTokenInput}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-zinc-200 dark:border-zinc-800">
          <nav className="flex flex-wrap justify-center gap-4 py-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-bold text-sm transition-all ${
                activeTab === 'explore'
                  ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Compass className="h-4 w-4" />
              Jelajah Profil
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-bold text-sm transition-all ${
                activeTab === 'compare'
                  ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Users2 className="h-4 w-4" />
              Bandingkan Developer
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'explore' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Search & Presets */}
            <div className={(activeUser || activeUsers.length === 1) ? 'lg:col-span-12 space-y-6' : 'lg:col-span-4 space-y-6'}>
              {/* Search Form */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                  Cari Developer
                </h3>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <label htmlFor="search-input" className="sr-only">Cari pengguna GitHub</label>
                    <input
                      id="search-input"
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Masukkan username GitHub..."
                      className="w-full pl-10 pr-12 py-2.5 text-sm border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-lg bg-zinc-50 focus:bg-white dark:bg-zinc-950 dark:focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white"
                    />
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-[9px] font-medium text-zinc-400 dark:border-zinc-800/60 dark:bg-zinc-900">
                      <span>⌘</span>K
                    </kbd>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-700 text-white rounded px-2 py-1 text-xs font-medium disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    Cari
                  </button>
                </form>

                {/* Presets */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Saran Cepat
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_USERS.map((username) => (
                      <button
                        key={username}
                        type="button"
                        onClick={() => handlePresetClick(username)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        {username}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search History */}
                {searchHistory.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                    <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                      <History className="h-3 w-3" />
                      Pencarian Terakhir
                    </span>
                    <div className="space-y-1.5">
                      {searchHistory.map((username) => (
                        <div
                          key={username}
                          onClick={() => handlePresetClick(username)}
                          className="flex items-center justify-between text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer text-zinc-600 dark:text-zinc-300 transition-colors group"
                        >
                          <span>{username}</span>
                          <button
                            type="button"
                            onClick={(e) => clearHistoryItem(e, username)}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right Column: User Results & Dashboard */}
            <div className={`${activeUser || activeUsers.length === 1 ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-6 overflow-hidden`}>
              {loading && (
                <div className="space-y-6">
                  <div role="status" aria-live="polite" className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm font-medium text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/20 dark:text-violet-300">
                    {loadingMessage || 'Memuat data GitHub...'}
                  </div>
                  <ProfileSkeleton />
                  {exploreSubTab === 'repos' ? <RepoListSkeleton /> : null}
                </div>
              )}

              {tokenNotice && !loading && (
                <div role="status" aria-live="polite" className="flex items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/20 dark:text-violet-300">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 shrink-0" />
                    <span>{tokenNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTokenNotice(null)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/30"
                  >
                    Tutup
                  </button>
                </div>
              )}

              {error && (
                <div role="alert" aria-live="assertive" className="flex items-center gap-3 p-5 border border-red-200 bg-red-50 text-red-700 rounded-2xl dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
                  <ShieldAlert className="h-6 w-6 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Gagal Memuat Profil</h4>
                    <p className="text-xs mt-0.5 leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {/* Multi-user results */}
              {!loading && !error && activeUsers.length > 0 && (
                <div className="space-y-6">
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">Hasil Pencarian (Beberapa Pengguna)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeUsers.map((u) => (
                      <div key={u.login} className="space-y-4">
                        <UserProfile user={u} />
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
                          <h4 className="text-sm font-bold mb-2">Repositories {`(${(activeUsersRepos[u.login] || []).length})`}</h4>
                          <RepoList repos={activeUsersRepos[u.login] || []} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!loading && !error && activeUser && (
                <div className="space-y-6">
                  {/* Profile Info Card */}
                  <UserProfile user={activeUser} />

                  {/* Sub tab navigation */}
                  <div className="flex border-b border-zinc-200 dark:border-zinc-800/60">
                    <button
                      onClick={() => setExploreSubTab('repos')}
                      className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs uppercase tracking-wider transition-all ${
                        exploreSubTab === 'repos'
                          ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                          : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                      }`}
                    >
                      <BookOpen className="h-4 w-4" />
                      Repositories ({activeRepos.length})
                    </button>
                    <button
                      onClick={() => setExploreSubTab('stats')}
                      className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs uppercase tracking-wider transition-all ${
                        exploreSubTab === 'stats'
                          ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                          : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                      }`}
                    >
                      <BarChart3 className="h-4 w-4" />
                      Dashboard Analitik
                    </button>
                  </div>

                  {/* Sub tab view */}
                  {exploreSubTab === 'repos' ? (
                    <RepoList repos={activeRepos} />
                  ) : (
                    <StatsDashboard repos={activeRepos} />
                  )}
                </div>
              )}

              {!loading && !error && !activeUser && (
                <div className="flex flex-col items-stretch justify-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center p-6">
                  <div className="mx-auto rounded-full bg-violet-50 dark:bg-violet-950/20 p-4 text-violet-600 dark:text-violet-400">
                    <Compass className="h-10 w-10 animate-spin-slow" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">
                    Mulai Menjelajah Akun GitHub
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                    Cari username akun GitHub di panel kiri atau klik saran cepat untuk melihat analisis profil.
                  </p>

                  {searchResults.length > 0 ? (
                    <div className="mt-6 text-left">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Hasil Pencarian</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">Pilih sampai 5 username untuk dimuat bersama.</p>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Dipilih: {selectedResults.length}</span>
                      </div>
                      <div className="grid gap-3">
                        {searchResults.map((u) => (
                          u && u.login ? (
                            <div key={u.login} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950">
                              <button
                                type="button"
                                onClick={() => fetchUserData(u.login!)}
                                className="flex items-center gap-3 text-left flex-1"
                              >
                                <img src={u.avatar_url} alt={u.login} className="h-10 w-10 rounded-full" />
                                <div>
                                  <p className="font-semibold text-zinc-900 dark:text-white">{u.login}</p>
                                  {u.html_url && <p className="text-xs text-zinc-500 dark:text-zinc-400">{u.html_url}</p>}
                                </div>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedResults((prev) => {
                                    const exists = prev.includes(u.login!)
                                    let next = exists ? prev.filter((p) => p !== u.login) : [...prev, u.login!]
                                    if (next.length > 5) next = next.slice(0, 5)
                                    return next
                                  })
                                }}
                                aria-pressed={selectedResults.includes(u.login!)}
                                className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${selectedResults.includes(u.login!) ? 'bg-violet-600 text-white' : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800'}`}
                              >
                                {selectedResults.includes(u.login!) ? 'Dipilih' : 'Pilih'}
                              </button>
                            </div>
                          ) : null
                        ))}
                      </div>
                      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                          type="button"
                          disabled={selectedResults.length === 0}
                          onClick={() => fetchMultipleUsers(selectedResults)}
                          className="w-full sm:w-auto text-xs font-semibold px-3 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
                        >
                          Muat pengguna yang dipilih
                        </button>
                        <button
                          type="button"
                          disabled={selectedResults.length === 0}
                          onClick={() => setSelectedResults([])}
                          className="w-full sm:w-auto text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 disabled:opacity-50"
                        >
                          Bersihkan pilihan
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Compare Tab */
          <CompareDevelopers
            patToken={patToken}
            onRateLimitUpdate={updateRateLimit}
            onInvalidToken={() => disableToken('Token Personal Access Anda tidak valid atau kedaluwarsa. Silakan setel token GitHub PAT yang valid.')}
          />
        )}
      </main>
    </div>
  )
}

export default App
