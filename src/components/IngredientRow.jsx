import React, { useState } from 'react'

const RATING_CONFIG = {
  harmful: { badge: 'badge-harmful', dot: 'bg-red-500',     label: 'Harmful'  },
  caution: { badge: 'badge-caution', dot: 'bg-yellow-500',  label: 'Caution'  },
  safe:    { badge: 'badge-safe',    dot: 'bg-emerald-500', label: 'Safe'     },
  unknown: { badge: 'bg-slate-700/50 text-slate-400 border border-slate-700', dot: 'bg-slate-500', label: 'Unknown' }
}

function HazardBar({ score }) {
  const pct = (score / 10) * 100
  const colour = score >= 7 ? 'bg-red-500' : score >= 4 ? 'bg-yellow-500' : 'bg-emerald-500'
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colour}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right">EWG {score}/10</span>
    </div>
  )
}

export default function IngredientRow({ item }) {
  const [expanded, setExpanded] = useState(false)
  const config = RATING_CONFIG[item.rating] || RATING_CONFIG.unknown

  return (
    <div
      className="ingredient-row cursor-pointer select-none"
      onClick={() => setExpanded(v => !v)}
    >
      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${config.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-white leading-snug">{item.name}</span>
          <div className="flex gap-1 flex-shrink-0 items-center">
            {item.isAllergen && (
              <span className="text-xs px-2 py-0.5 rounded-full badge-allergen">Allergen</span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.badge}`}>{config.label}</span>
            <span className="text-slate-600 text-xs ml-0.5">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        {item.hazardScore && <HazardBar score={item.hazardScore} />}

        {expanded && (
          <div className="mt-2 flex flex-col gap-2 animate-fade-in">
            {item.concern && (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 rounded-lg p-2.5">
                ⚠️ {item.concern}
              </p>
            )}
            {item.alternatives && (
              <div className="bg-emerald-900/30 border border-emerald-800/40 rounded-lg p-2.5">
                <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Safer alternatives</p>
                <p className="text-xs text-slate-300 leading-relaxed">{item.alternatives}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
