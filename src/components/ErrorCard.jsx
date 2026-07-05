import React from 'react'

export default function ErrorCard({ message, onRetry }) {
  const isNotFound = message && (message.includes('not found') || message.includes('No '))
  const isTimeout  = message && message.includes('timed out')
  const isNetwork  = message && message.includes('Network error')

  const icon  = isNotFound ? '\uD83D\uDD0D' : isTimeout ? '\u23F1' : '\uD83D\uDCE1'
  const title = isNotFound ? 'Product not found'
               : isTimeout  ? 'Request timed out'
               : isNetwork  ? 'Connection problem'
               : 'Something went wrong'

  const hint = isNotFound
    ? 'This product may not be in the database yet. Try switching between Cosmetics and Food mode, or search by name instead.'
    : isTimeout || isNetwork
    ? 'Make sure you have an active internet connection, then try again.'
    : null

  return (
    <div role="alert" className="card p-6 flex flex-col items-center text-center gap-4">
      <span aria-hidden="true" className="text-5xl">{icon}</span>
      <div>
        <p className="font-semibold text-white text-base">{title}</p>
        <p className="text-sm text-slate-400 mt-1">{message}</p>
        {hint && <p className="text-xs text-slate-500 mt-2 leading-relaxed">{hint}</p>}
      </div>
      <button onClick={onRetry} className="btn-primary px-8">
        Try again
      </button>
    </div>
  )
}
