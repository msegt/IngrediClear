import React from 'react'

export default function ErrorCard({ message, onRetry }) {
  return (
    <div className="card p-6 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center text-3xl">
        ⚠️
      </div>
      <div>
        <h2 className="font-semibold text-white">Product Not Found</h2>
        <p className="text-sm text-slate-400 mt-1">{message}</p>
      </div>
      <button onClick={onRetry} className="btn-primary w-full">
        Try Another Product
      </button>
      <p className="text-xs text-slate-500">
        This product may not be in the Open Beauty Facts database yet.
      </p>
    </div>
  )
}
