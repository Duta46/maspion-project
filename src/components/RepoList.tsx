import React, { useState, useMemo } from 'react'
import { Star, GitFork, Search, ArrowUpDown, Calendar, HelpCircle } from 'lucide-react'

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  created_at: string
  license: { name: string } | null
  size: number
}

interface RepoListProps {
  repos: GitHubRepo[]
}

// Colors for programming languages
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-500',
  HTML: 'bg-orange-500',
  CSS: 'bg-indigo-500',
  Python: 'bg-blue-400',
  Ruby: 'bg-red-500',
  Go: 'bg-sky-400',
  PHP: 'bg-violet-500',
  Java: 'bg-amber-600',
  'C++': 'bg-pink-500',
  C: 'bg-gray-500',
  Rust: 'bg-orange-600',
  Swift: 'bg-orange-400',
  Kotlin: 'bg-purple-500',
  Shell: 'bg-emerald-500',
  Vue: 'bg-emerald-400',
}

export const RepoList: React.FC<RepoListProps> = ({ repos }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'updated' | 'name'>('stars')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All')

  // Get list of unique languages
  const languages = useMemo(() => {
    const langs = new Set<string>()
    repos.forEach((repo) => {
      if (repo.language) {
        langs.add(repo.language)
      }
    })
    return ['All', ...Array.from(langs)]
  }, [repos])

  // Filter and sort repos
  const filteredAndSortedRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        const matchesSearch =
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (repo.description &&
            repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesLanguage =
          selectedLanguage === 'All' || repo.language === selectedLanguage
        return matchesSearch && matchesLanguage
      })
      .sort((a, b) => {
        if (sortBy === 'stars') {
          return b.stargazers_count - a.stargazers_count
        } else if (sortBy === 'forks') {
          return b.forks_count - a.forks_count
        } else if (sortBy === 'updated') {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        } else {
          return a.name.localeCompare(b.name)
        }
      })
  }, [repos, searchTerm, sortBy, selectedLanguage])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-75">
      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-lg bg-zinc-50 focus:bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white"
          />
        </div>

        {/* Sort & Language */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Lang:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-4 w-4 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
            >
              <option value="stars">Stars</option>
              <option value="forks">Forks</option>
              <option value="updated">Updated</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Repos */}
      {filteredAndSortedRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedRepos.map((repo) => (
            <div
              key={repo.id}
              className="group flex flex-col justify-between p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 relative overflow-hidden"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-base truncate">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      {repo.name}
                    </a>
                  </h3>
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          LANGUAGE_COLORS[repo.language] || 'bg-zinc-400'
                        }`}
                      />
                      {repo.language}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 h-10 leading-relaxed">
                  {repo.description || <span className="italic text-zinc-300 dark:text-zinc-600">No description provided</span>}
                </p>
              </div>

              {/* Stats Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-3 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold">{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300">
                    <GitFork className="h-4 w-4 text-zinc-400" />
                    <span className="font-semibold">{repo.forks_count}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Updated {formatDate(repo.updated_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/10">
          <HelpCircle className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
          <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">No repositories found</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Try adjusting your search query or language filter.
          </p>
        </div>
      )}
    </div>
  )
}
