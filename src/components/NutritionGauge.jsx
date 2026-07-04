import React, { useState } from 'react'

export default function NutritionGauge({ score, protein, scoreReasons = [] }) {
  const [showReasons, setShowReasons] = useState(false)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference
  const scoreColor = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'

  const impactStyle = {
    positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    negative: 'text-red-400 bg-red-500/10 border-red-500/30',
    neutral:  'text-slate-400 bg-slate-700/40 border-slate-600/40'
  }
  const impactIcon = { positive: '↑', negative: '↓', neutral: '•' }

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 items-center">
        {/* Gauge */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
              <circle cx="70" cy="70" r="54" stroke="#1e293b" strokeWidth="12" fill="none" />
              <circle
                cx="70" cy="70" r="54"
                stroke={scoreColor}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{score}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-white mt-2">Health score</p>
        </div>

        {/* Protein + explain button */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-slate-800 p-4 border border-slate-700">
            <p className="text-xs text-slate-400">Protein</p>
            <p className="text-3xl font-bold text-white mt-1">{protein ?? '–'}<span className="text-base text-slate-400"> g/100g</span></p>
          </div>
          {scoreReasons.length > 0 && (
            <button
              onClick={() => setShowReasons(v => !v)}
              className="text-xs text-brand-400 hover:text-brand-300 transition font-medium text-left"
            >
              {showReasons ? '▲ Hide explanation' : '▼ Why this score?'}
            </button>
          )}
        </div>
      </div>

      {/* Score breakdown */}
      {showReasons && scoreReasons.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-slate-300">Score breakdown</p>
          {scoreReasons.map((reason, i) => (
            <div key={i} className={`flex items-start gap-2 rounded-xl px-3 py-2 border text-xs ${impactStyle[reason.impact]}`}>
              <span className="font-bold mt-0.5 flex-shrink-0">{impactIcon[reason.impact]}</span>
              <span>{reason.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
