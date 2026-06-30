import React, { useState } from 'react'
import { Key, Check, Sun, Moon } from 'lucide-react'

const Github: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

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
  showInput: boolean
  onShowInputToggle: (open: boolean) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  patToken,
  onPatTokenChange,
  rateLimit,
  theme,
  onThemeToggle,
  showInput,
  onShowInputToggle,
}) => {
  const [tokenInput, setTokenInput] = useState(patToken)
  const [isSaved, setIsSaved] = useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Autofocus input field when it becomes visible
  React.useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showInput])

  // Sync internal state if token is changed or cleared externally (e.g. on 401 invalidation)
  React.useEffect(() => {
    setTokenInput(patToken)
  }, [patToken])

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault()
    onPatTokenChange(tokenInput.trim())
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleClearToken = () => {
    setTokenInput('')
    onPatTokenChange('')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-zinc-900 p-2 text-white dark:bg-white dark:text-zinc-900 transition-colors">
            <Github className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-zinc-900 dark:text-white text-lg">
              GitView
            </span>
            <span className="ml-1 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Analytics
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Rate Limit Stats */}
          {rateLimit && (
            <div className="hidden md:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <span className="font-medium">API Limit:</span>
              <span
                className={`font-semibold ${
                  rateLimit.remaining < 10
                    ? 'text-red-500'
                    : rateLimit.remaining < 30
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                }`}
              >
                {rateLimit.remaining}
              </span>
              <span>/</span>
              <span>{rateLimit.limit}</span>
            </div>
          )}

          {/* PAT Token Configuration */}
          <div className="relative">
            {showInput ? (
              <form
                onSubmit={handleSaveToken}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    onShowInputToggle(false)
                  }
                }}
                className="absolute right-0 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white p-1.5 shadow-lg dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-zinc-900 w-72 transition-all animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <input
                  ref={inputRef}
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste GitHub PAT token..."
                  aria-label="GitHub Personal Access Token"
                  className="flex-1 bg-transparent px-2.5 py-1 text-xs text-zinc-900 focus:outline-none dark:text-white"
                />
                <button
                  type="submit"
                  className="rounded bg-violet-600 px-2 py-1 text-xs font-medium text-white hover:bg-violet-700 active:bg-violet-800 transition-colors"
                >
                  {isSaved ? <Check className="h-3 w-3" /> : 'Save'}
                </button>
                {patToken && (
                  <button
                    type="button"
                    onClick={handleClearToken}
                    className="rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </form>
            ) : null}

            <button
              onClick={() => onShowInputToggle(!showInput)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                patToken
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300 border border-violet-200 dark:border-violet-800/50'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <Key className="h-3.5 w-3.5" />
              <span>{patToken ? 'PAT Active' : 'Set PAT Token'}</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
