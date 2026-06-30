import React, { useState } from 'react'
import { Search, Trophy, ShieldAlert, Briefcase, MapPin, Loader2, X } from 'lucide-react'
import type { GitHubUser } from './UserProfile'
import type { GitHubRepo } from './RepoList'

interface CompareDevelopersProps {
  patToken: string
  onRateLimitUpdate?: (headers: Headers) => void
  onInvalidToken?: () => void
}

const getErrorMessage = (err: unknown) => {
  return err instanceof Error ? err.message : 'An error occurred during comparison'
}

export const CompareDevelopers: React.FC<CompareDevelopersProps> = ({
  patToken,
  onRateLimitUpdate,
  onInvalidToken,
}) => {
  const [userAQuery, setUserAQuery] = useState('')
  const [userBQuery, setUserBQuery] = useState('')

  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [devA, setDevA] = useState<{ user: GitHubUser; repos: GitHubRepo[] } | null>(null)
  const [devB, setDevB] = useState<{ user: GitHubUser; repos: GitHubRepo[] } | null>(null)

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    ...(patToken ? { Authorization: `token ${patToken}` } : {}),
  }

  const fetchAllRepos = async (username: string) => {
    const allRepos: GitHubRepo[] = []
    let page = 1

    while (true) {
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
        { headers }
      )
      onRateLimitUpdate?.(reposRes.headers)

      if (!reposRes.ok) {
        if (reposRes.status === 401) {
          onInvalidToken?.()
          throw new Error('Your GitHub Personal Access Token is invalid or expired. Please set a valid PAT token.')
        }
        if (reposRes.status === 403) {
          throw new Error('GitHub API rate limit is exhausted. Add a valid PAT token or wait until the rate limit resets.')
        }
        throw new Error(`Failed to fetch repositories for "${username}" (Status ${reposRes.status})`)
      }

      const repos: GitHubRepo[] = await reposRes.json()
      allRepos.push(...repos)
      setLoadingMessage(`Loaded ${allRepos.length} repositories for ${username}...`)

      if (repos.length < 100) break
      page += 1
    }

    return allRepos
  }

  const fetchDevData = async (username: string) => {
    // Fetch profile
    setLoadingMessage(`Loading profile for ${username}...`)
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers })
    onRateLimitUpdate?.(userRes.headers)
    if (!userRes.ok) {
      if (userRes.status === 401) {
        onInvalidToken?.()
        throw new Error('Your GitHub Personal Access Token is invalid or expired. Please set a valid PAT token.')
      }
      if (userRes.status === 403) {
        throw new Error('GitHub API rate limit is exhausted. Add a valid PAT token or wait until the rate limit resets.')
      }
      if (userRes.status === 404) {
        throw new Error(`User "${username}" not found`)
      }
      throw new Error(`Failed to fetch user "${username}" (Status ${userRes.status})`)
    }
    const user: GitHubUser = await userRes.json()

    // Fetch repos
    setLoadingMessage(`Loading repositories for ${username}...`)
    const repos = await fetchAllRepos(username)

    return { user, repos }
  }

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userAQuery.trim() || !userBQuery.trim()) {
      setError('Please enter username for both Developer A and Developer B')
      return
    }

    setLoading(true)
    setLoadingMessage('Preparing comparison...')
    setError(null)

    try {
      const [dataA, dataB] = await Promise.all([
        fetchDevData(userAQuery.trim()),
        fetchDevData(userBQuery.trim()),
      ])

      setDevA(dataA)
      setDevB(dataB)
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }

  // Helper to calculate total stars
  const calculateTotalStars = (repos: GitHubRepo[]) => {
    return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  }

  // Helper to calculate total forks
  const calculateTotalForks = (repos: GitHubRepo[]) => {
    return repos.reduce((sum, repo) => sum + repo.forks_count, 0)
  }

  // Render comparison row
  const renderComparisonRow = (
    label: string,
    valA: number,
    valB: number,
    formatFn: (val: number) => string = (v) => v.toLocaleString()
  ) => {
    const isWinnerA = valA > valB
    const isWinnerB = valB > valA

    return (
      <div className="grid grid-cols-3 py-3.5 border-b border-zinc-100 dark:border-zinc-800 text-sm items-center">
        {/* Dev A Value */}
        <div className="text-center font-bold">
          <span
            className={`px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${isWinnerA
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                : 'text-zinc-600 dark:text-zinc-400 font-medium'
              }`}
          >
            {formatFn(valA)}
            {isWinnerA && <Trophy className="h-3.5 w-3.5" />}
          </span>
        </div>

        {/* Feature Label */}
        <div className="text-center text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          {label}
        </div>

        {/* Dev B Value */}
        <div className="text-center font-bold">
          <span
            className={`px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${isWinnerB
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                : 'text-zinc-600 dark:text-zinc-400 font-medium'
              }`}
          >
            {formatFn(valB)}
            {isWinnerB && <Trophy className="h-3.5 w-3.5" />}
          </span>
        </div>
      </div>
    )
  }

  const starsA = devA ? calculateTotalStars(devA.repos) : 0
  const starsB = devB ? calculateTotalStars(devB.repos) : 0

  const forksA = devA ? calculateTotalForks(devA.repos) : 0
  const forksB = devB ? calculateTotalForks(devB.repos) : 0

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Search Input Form */}
      <form
        onSubmit={handleCompare}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dev A Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Enter Developer A username..."
              value={userAQuery}
              onChange={(e) => setUserAQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-lg bg-zinc-50 focus:bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white"
            />
          </div>

          {/* Dev B Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Enter Developer B username..."
              value={userBQuery}
              onChange={(e) => setUserBQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-lg bg-zinc-50 focus:bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-violet-700 hover:to-indigo-700 active:scale-95 shadow-md shadow-violet-500/10 disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Comparing...
              </>
            ) : (
              'Compare Profiles'
            )}
          </button>
        </div>
      </form>

      {loading && loadingMessage && (
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-center text-sm font-medium text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/20 dark:text-violet-300">
          {loadingMessage}
        </div>
      )}

      {/* Error View */}
      {error && (
        <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Comparison results */}
      {devA && devB && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Header Row (Profile Cards side by side) */}
          <div className="grid grid-cols-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 py-6 px-4 items-center">
            {/* Dev A Profile */}
            <div className="text-center flex flex-col items-center">
              <img
                src={devA.user.avatar_url}
                alt={devA.user.name || devA.user.login}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-violet-500 object-cover"
              />
              <h4 className="mt-3 font-bold text-zinc-900 dark:text-white text-sm sm:text-base leading-tight">
                {devA.user.name || devA.user.login}
              </h4>
              <a
                href={devA.user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-violet-600 dark:text-violet-400 hover:underline mt-0.5"
              >
                @{devA.user.login}
              </a>
            </div>

            {/* Versus Label */}
            <div className="text-center font-extrabold text-2xl tracking-widest text-zinc-300 dark:text-zinc-700">
              VS
            </div>

            {/* Dev B Profile */}
            <div className="text-center flex flex-col items-center">
              <img
                src={devB.user.avatar_url}
                alt={devB.user.name || devB.user.login}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-violet-500 object-cover"
              />
              <h4 className="mt-3 font-bold text-zinc-900 dark:text-white text-sm sm:text-base leading-tight">
                {devB.user.name || devB.user.login}
              </h4>
              <a
                href={devB.user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-violet-600 dark:text-violet-400 hover:underline mt-0.5"
              >
                @{devB.user.login}
              </a>
            </div>
          </div>

          {/* Comparison Stats Table */}
          <div className="px-4 py-2">
            {renderComparisonRow('Followers', devA.user.followers, devB.user.followers)}
            {renderComparisonRow('Total Stars', starsA, starsB)}
            {renderComparisonRow('Total Forks', forksA, forksB)}
            {renderComparisonRow('Public Repos', devA.user.public_repos, devB.user.public_repos)}
            {renderComparisonRow('Public Gists', devA.user.public_gists, devB.user.public_gists)}
            {renderComparisonRow('Following', devA.user.following, devB.user.following)}
          </div>

          {/* Meta Info Comparison */}
          <div className="grid grid-cols-2 divide-x divide-zinc-100 dark:divide-zinc-800 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 p-6 gap-6">
            {/* Dev A Bio Info */}
            <div className="space-y-2">
              {devA.user.company && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-zinc-400" />
                  <span>{devA.user.company}</span>
                </div>
              )}
              {devA.user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                  <span>{devA.user.location}</span>
                </div>
              )}
            </div>

            {/* Dev B Bio Info */}
            <div className="space-y-2 pl-6">
              {devB.user.company && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-zinc-400" />
                  <span>{devB.user.company}</span>
                </div>
              )}
              {devB.user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                  <span>{devB.user.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
