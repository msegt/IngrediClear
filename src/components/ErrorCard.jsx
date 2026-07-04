import React from 'react'

export default function ErrorCard({ message, onRetry }) {
  return (
    <div className="card p-6 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center text-3xl">⚠️</div>
      <div>
        <h2 className="font-semibold text-white">Product Not Found</h2>
        <p className="text-sm text-slate-400 mt-1">{message}</p>
      </div>
      <button onClick={onRetry} className="btn-primary w-full">Try Another Product</button>
      <div className="w-full border-t border-slate-800 pt-4 flex flex-col gap-2">
        <p className="text-xs text-slate-500 font-medium">Want to add this product?</p>
        <a
          href="https://world.openbeautyfacts.org/cgi/product.pl"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-sm text-center"
        >
          Add to Open Beauty Facts →
        </a>
      </div>
    </div>
  )
}
