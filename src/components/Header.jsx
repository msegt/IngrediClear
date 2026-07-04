import React from 'react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60">
      <div className="flex items-center gap-3 px-4 py-3" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-brand-500/30">
          🌿
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-none">IngrediClear</h1>
          <p className="text-xs text-slate-400 leading-none mt-0.5">Know what's in your cosmetics</p>
        </div>
      </div>
    </header>
  )
}
