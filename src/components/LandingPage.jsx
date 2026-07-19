import React from 'react'

function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="72" height="72" aria-hidden="true" focusable="false">
      <rect width="1024" height="1024" rx="220" fill="#0f172a"/>
      <circle cx="440" cy="420" r="220" fill="none" stroke="#e2e8f0" strokeWidth="60" strokeLinecap="round"/>
      <line x1="610" y1="590" x2="760" y2="760" stroke="#e2e8f0" strokeWidth="68" strokeLinecap="round"/>
      <path d="M 340 480 Q 340 300 520 300 Q 520 480 340 480 Z" fill="#10b981"/>
      <path d="M 340 480 Q 520 480 520 300 Q 440 390 340 480 Z" fill="#059669"/>
      <path d="M 340 480 Q 430 390 520 300" fill="none" stroke="#d1fae5" strokeWidth="10" strokeLinecap="round"/>
      <circle cx="430" cy="390" r="80" fill="#10b981" opacity="0.18"/>
    </svg>
  )
}

const FEATURES = [
  { emoji: '\uD83D\uDCF7', title: 'Scan a barcode', desc: 'Point your camera at any product barcode for an instant analysis.' },
  { emoji: '\u2328\uFE0F', title: 'Type it in', desc: 'Enter a barcode number manually if scanning is not possible.' },
  { emoji: '\uD83E\uDDF4', title: 'Cosmetics', desc: 'Check for harmful chemicals, banned substances, and fragrance allergens.' },
  { emoji: '\uD83C\uDF7D\uFE0F', title: 'Food', desc: 'See allergens, additives, Nutri-Score, and Nova processing level.' },
]

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="flex flex-col min-h-screen px-6 pb-12 animate-fade-in" style={{ paddingTop: 'max(48px, env(safe-area-inset-top))' }}>

      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-5 pt-8 pb-10">
        <div className="p-1 rounded-3xl shadow-2xl shadow-brand-500/20">
          <Logo />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            IngrediClear
          </h1>
          <p className="text-slate-400 mt-2 text-base leading-relaxed max-w-xs mx-auto">
            Know exactly what’s in your cosmetics and food — before you buy or use them.
          </p>
        </div>
        <button
          onClick={onGetStarted}
          aria-label="Get started with IngrediClear"
          className="btn-primary w-full max-w-xs text-base mt-2"
        >
          Get started <span aria-hidden="true">→</span>
        </button>
        <p className="text-xs text-slate-600">Free · No sign-up · Open data</p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-xs text-slate-600 font-medium">What you can do</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        {FEATURES.map(f => (
          <div key={f.title} className="card p-4 flex flex-col gap-2">
            <span aria-hidden="true" className="text-2xl">{f.emoji}</span>
            <p className="text-sm font-semibold text-white leading-tight">{f.title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Trust strip */}
      <div className="card p-4 flex flex-col gap-2 text-center">
        <p className="text-xs font-semibold text-slate-400">Powered by open data</p>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1">
          {['Open Beauty Facts', 'Open Food Facts', 'EU CosIng', 'IARC', 'SCCS'].map(s => (
            <span key={s} className="text-xs text-slate-500">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
