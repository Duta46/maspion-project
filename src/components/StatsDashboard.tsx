import React, { useMemo } from 'react'
import { Award, Code2, ShieldAlert, Star, GitFork, HardDrive } from 'lucide-react'
import type { GitHubRepo } from './RepoList'

interface StatsDashboardProps {
  repos: GitHubRepo[]
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ repos }) => {
  // 1. Calculate General Aggregates
  const stats = useMemo(() => {
    let totalStars = 0
    let totalForks = 0
    let totalSize = 0
    let maxStars = 0
    let highestStarredRepo: GitHubRepo | null = null

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count
      totalForks += repo.forks_count
      totalSize += repo.size

      if (repo.stargazers_count >= maxStars) {
        maxStars = repo.stargazers_count
        highestStarredRepo = repo
      }
    })

    const avgSize = repos.length ? Math.round(totalSize / repos.length) : 0

    return {
      totalStars,
      totalForks,
      avgSize,
      highestStarredRepo: highestStarredRepo as GitHubRepo | null,
    }
  }, [repos])

  // 2. Programming Languages Distribution
  const languageStats = useMemo(() => {
    const langCounts: Record<string, number> = {}
    let totalWithLanguage = 0

    repos.forEach((repo) => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1
        totalWithLanguage++
      }
    })

    const sortedLangs = Object.entries(langCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalWithLanguage ? Math.round((count / totalWithLanguage) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    return sortedLangs.slice(0, 5) // Top 5 languages
  }, [repos])

  // Colors for languages
  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      JavaScript: '#facc15',
      TypeScript: '#3b82f6',
      HTML: '#f97316',
      CSS: '#6366f1',
      Python: '#60a5fa',
      Ruby: '#ef4444',
      Go: '#38bdf8',
      PHP: '#8b5cf6',
      Java: '#d97706',
      'C++': '#ec4899',
      C: '#6b7280',
      Rust: '#ea580c',
    }
    return colors[lang] || '#a1a1aa'
  }

  // 3. Repository Star Distribution (Top 5 most starred repos)
  const topStarredRepos = useMemo(() => {
    return [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
  }, [repos])

  if (repos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/10">
        <ShieldAlert className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
        <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">Tidak ada data untuk statistik</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 text-center">
          Pengguna ini tidak memiliki repositori untuk menghasilkan metrik dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
      {/* Aggregates row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Total Stars Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Total Bintang Diterima
              </p>
              <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2">
                {stats.totalStars.toLocaleString()}
              </h3>
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-2 text-amber-500">
              <Star className="h-6 w-6 fill-amber-500" />
            </div>
          </div>
        </div>

        {/* Total Forks Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Total Forks
              </p>
              <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2">
                {stats.totalForks.toLocaleString()}
              </h3>
            </div>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-2 text-blue-500">
              <GitFork className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Ukuran Repo Rata-rata */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Ukuran Repo Rata-rata
              </p>
              <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2">
                {stats.avgSize >= 1024
                  ? `${(stats.avgSize / 1024).toFixed(1)} MB`
                  : `${stats.avgSize} KB`}
              </h3>
            </div>
            <div className="rounded-lg bg-violet-50 dark:bg-violet-950/20 p-2 text-violet-500">
              <HardDrive className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid for Charts & Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language distribution card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h4 className="font-bold text-zinc-900 dark:text-white text-base">Bahasa Teratas</h4>
          </div>

          <div className="space-y-4">
            {languageStats.length > 0 ? (
              languageStats.map((lang) => (
                <div key={lang.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full inline-block"
                        style={{ backgroundColor: getLanguageColor(lang.name) }}
                      />
                      {lang.name}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                      {lang.count} repositori ({lang.percentage}%)
                    </span>
                  </div>
                  {/* Custom progress bar */}
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: getLanguageColor(lang.name),
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-400 italic">Tidak ada data bahasa tersedia</p>
            )}
          </div>
        </div>

        {/* Stars distribution card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h4 className="font-bold text-zinc-900 dark:text-white text-base">Repositori Paling Banyak Bintang</h4>
          </div>

          <div className="space-y-4">
            {topStarredRepos.map((repo) => {
              const maxStars = topStarredRepos[0]?.stargazers_count || 1
              const percentage = Math.max(10, Math.round((repo.stargazers_count / maxStars) * 100))

              return (
                <div key={repo.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[200px]">
                      {repo.name}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 shrink-0 font-medium">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {repo.stargazers_count}
                    </span>
                  </div>
                  {/* SVG/CSS Mini Bar Chart */}
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Spotlight highlight */}
      {stats.highestStarredRepo && (
        <div className="relative bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl p-6 shadow-md overflow-hidden">
          {/* Decorative background */}
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 sm:translate-x-12 sm:translate-y-12 select-none">
            <Star className="h-64 w-64 fill-white text-white" />
          </div>

          <div className="relative z-10 space-y-3">
            <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Repositori Unggulan
            </span>
            <div>
              <h4 className="text-xl font-bold">
                <a
                  href={stats.highestStarredRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {stats.highestStarredRepo.name}
                </a>
              </h4>
              <p className="text-xs text-white/80 mt-1 line-clamp-2 max-w-xl">
                {stats.highestStarredRepo.description || 'Deskripsi tidak tersedia'}
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center gap-1.5 font-semibold">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                <span>{stats.highestStarredRepo.stargazers_count.toLocaleString()} Stars</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <GitFork className="h-4 w-4" />
                <span>{stats.highestStarredRepo.forks_count.toLocaleString()} Forks</span>
              </div>
              {stats.highestStarredRepo.language && (
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  <span>{stats.highestStarredRepo.language}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
