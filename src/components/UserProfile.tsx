import React from 'react'
import {
  MapPin,
  Link as LinkIcon,
  Users,
  Briefcase,
  Calendar,
  Layers,
  FileCode,
} from 'lucide-react'

const Twitter: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
}

interface UserProfileProps {
  user: GitHubUser
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format blog URL
  const getBlogUrl = (blog: string) => {
    if (blog.startsWith('http://') || blog.startsWith('https://')) {
      return blog
    }
    return `https://${blog}`
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Avatar */}
          <div className="relative group mx-auto md:mx-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-75 blur-sm transition duration-300 group-hover:opacity-100"></div>
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              className="relative rounded-full w-28 h-28 sm:w-32 sm:h-32 object-cover border-4 border-white dark:border-zinc-900"
            />
          </div>

          {/* User Details */}
          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {user.name || user.login}
                </h2>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 dark:text-violet-400 font-semibold text-sm hover:underline"
                >
                  @{user.login}
                </a>
              </div>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors mx-auto md:mx-0"
              >
                Lihat di GitHub
              </a>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="mt-4 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Meta Info */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              {user.company && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Briefcase className="h-4 w-4 shrink-0 text-zinc-400" />
                  <span className="truncate">{user.company}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
                  <span className="truncate">{user.location}</span>
                </div>
              )}
              {user.blog && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <LinkIcon className="h-4 w-4 shrink-0 text-zinc-400" />
                  <a
                    href={getBlogUrl(user.blog)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:text-violet-600 dark:hover:text-violet-400 hover:underline"
                  >
                    {user.blog}
                  </a>
                </div>
              )}
              {user.twitter_username && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Twitter className="h-4 w-4 shrink-0 text-zinc-400" />
                  <a
                    href={`https://twitter.com/${user.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:text-violet-600 dark:hover:text-violet-400 hover:underline"
                  >
                    @{user.twitter_username}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-center md:justify-start gap-2 col-span-1 sm:col-span-2">
                <Calendar className="h-4 w-4 shrink-0 text-zinc-400" />
                <span>Bergabung di GitHub pada {formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-100 dark:border-zinc-800/60 pt-6">
          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/40 p-4 text-center border border-zinc-100/50 dark:border-zinc-800/30">
            <div className="flex justify-center text-violet-600 dark:text-violet-400 mb-1">
              <Layers className="h-5 w-5" />
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
              {user.public_repos}
            </div>
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
              Repositori
            </div>
          </div>

          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/40 p-4 text-center border border-zinc-100/50 dark:border-zinc-800/30">
            <div className="flex justify-center text-violet-600 dark:text-violet-400 mb-1">
              <FileCode className="h-5 w-5" />
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
              {user.public_gists}
            </div>
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
              Gist
            </div>
          </div>

          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/40 p-4 text-center border border-zinc-100/50 dark:border-zinc-800/30">
            <div className="flex justify-center text-violet-600 dark:text-violet-400 mb-1">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
              {user.followers}
            </div>
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
              Pengikut
            </div>
          </div>

          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/40 p-4 text-center border border-zinc-100/50 dark:border-zinc-800/30">
            <div className="flex justify-center text-violet-600 dark:text-violet-400 mb-1">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
              {user.following}
            </div>
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
              Mengikuti
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
