import React from 'react'

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Avatar Skeleton */}
        <div className="mx-auto md:mx-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />

        {/* User Details Skeleton */}
        <div className="flex-1 w-full space-y-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="space-y-2">
              {/* Name */}
              <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg mx-auto md:mx-0" />
              {/* Login */}
              <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg mx-auto md:mx-0" />
            </div>
            {/* Button */}
            <div className="h-8 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg mx-auto md:mx-0" />
          </div>

          {/* Bio */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800/60 rounded" />
            <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800/60 rounded mx-auto md:mx-0" />
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="h-4 w-36 bg-zinc-100 dark:bg-zinc-800/60 rounded mx-auto md:mx-0" />
            <div className="h-4 w-40 bg-zinc-100 dark:bg-zinc-800/60 rounded mx-auto md:mx-0" />
            <div className="h-4 w-48 bg-zinc-100 dark:bg-zinc-800/60 rounded mx-auto md:mx-0" />
            <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded mx-auto md:mx-0" />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-100 dark:border-zinc-800/60 pt-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-zinc-50 dark:bg-zinc-900/40 p-4 text-center border border-zinc-100/50 dark:border-zinc-800/30 space-y-2"
          >
            <div className="h-4 w-5 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
            <div className="h-6 w-12 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
            <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export const RepoListSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Grid of Repos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4"
          >
            <div className="flex justify-between items-start gap-4">
              {/* Title */}
              <div className="h-5 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
              {/* Badge */}
              <div className="h-5 w-16 bg-zinc-100 dark:bg-zinc-800/80 rounded-full" />
            </div>

            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded" />
              <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="h-4 w-10 bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-10 bg-zinc-100 dark:bg-zinc-800 rounded" />
              </div>
              <div className="h-4 w-28 bg-zinc-100 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const CompareSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        {/* Header Grid */}
        <div className="grid grid-cols-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 py-6 px-4 items-center">
          {/* Dev A Profile */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3.5 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
          </div>

          {/* Versus Label */}
          <div className="text-center font-extrabold text-2xl text-zinc-300 dark:text-zinc-700">
            VS
          </div>

          {/* Dev B Profile */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3.5 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
          </div>
        </div>

        {/* Comparison Stats Table */}
        <div className="px-4 py-2 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-3 py-3.5 border-b border-zinc-100 dark:border-zinc-800 items-center"
            >
              <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
              <div className="h-3.5 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded mx-auto" />
              <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
