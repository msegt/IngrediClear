import React from 'react'

export default function NutritionGauge({ score, protein }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference

  const scoreColor = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="card p-5">
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
              <circle cx="70" cy="70" r="54" stroke="#1e293b" strokeWidth="12" fill="none" />
              <circle
                cx="70"
                cy="70"
                r="54"
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

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-slate-800 p-4 border border-slate-700">
            <p className="text-xs text-slate-400">Protein</p>
            <p className="text-3xl font-bold text-white mt-1">{protein ?? '–'}<span className="text-base text-slate-400"> g/100g</span></p>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            This score summarises Nutri-Score when available, otherwise it estimates healthiness from sugar, salt, saturated fat, protein and fibre.
          </p>
        </div>
      </div>
    </div>
  )
}
