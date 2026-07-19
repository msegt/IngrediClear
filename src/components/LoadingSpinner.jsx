import React from 'react'

export default function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Analysing product, please wait"
      className="flex flex-col items-center gap-4 py-16"
    >
      <div className="relative" aria-hidden="true">
        <div className="w-16 h-16 border-4 border-slate-800 rounded-full" />
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🌿</div>
      </div>
      <div className="text-center" aria-hidden="true">
        <p className="font-semibold text-white">Analysing product…</p>
        <p className="text-sm text-slate-400 mt-1">Checking ingredient safety</p>
      </div>
    </div>
  )
}
