import React from 'react'

// Inline SVG logo — matches favicon.svg and apple-touch-icon.svg exactly
function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="36" height="36" aria-hidden="true">
      {/* Background */}
      <rect width="1024" height="1024" rx="220" fill="#0f172a"/>
      {/* Magnifying glass circle */}
      <circle cx="440" cy="420" r="220" fill="none" stroke="#e2e8f0" strokeWidth="60" strokeLinecap="round"/>
      {/* Handle */}
      <line x1="610" y1="590" x2="760" y2="760" stroke="#e2e8f0" strokeWidth="68" strokeLinecap="round"/>
      {/* Leaf body inside lens */}
      <path d="M 340 480 Q 340 300 520 300 Q 520 480 340 480 Z" fill="#10b981"/>
      <path d="M 340 480 Q 520 480 520 300 Q 440 390 340 480 Z" fill="#059669"/>
      {/* Leaf vein */}
      <path d="M 340 480 Q 430 390 520 300" fill="none" stroke="#d1fae5" strokeWidth="10" strokeLinecap="round"/>
      {/* Leaf glow */}
      <circle cx="430" cy="390" r="80" fill="#10b981" opacity="0.18"/>
    </svg>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60">
      <div className="flex items-center gap-3 px-4 py-3" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <Logo />
        <div>
          <h1 className="text-lg font-bold text-white leading-none">IngrediClear</h1>
          <p className="text-xs text-slate-400 leading-none mt-0.5">Know what's in your cosmetics &amp; food</p>
        </div>
      </div>
    </header>
  )
}
