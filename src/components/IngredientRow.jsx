import React, { useState } from 'react'

const RATING_CONFIG = {
  harmful: { badge: 'badge-harmful', dot: 'bg-red-500',     label: 'Harmful'  },
  caution: { badge: 'badge-caution', dot: 'bg-yellow-500',  label: 'Caution'  },
  safe:    { badge: 'badge-safe',    dot: 'bg-emerald-500', label: 'Safe'     },
  unknown: { badge: 'bg-slate-700/50 text-slate-400 border border-slate-700', dot: 'bg-slate-500', label: 'Unknown' }
}

function HazardBar({ score }) {
  const pct    = (score / 10) * 100
  const colour = score >= 7 ? 'bg-red-500' : score >= 4 ? 'bg-yellow-500' : 'bg-emerald-500'
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-label={`Hazard score ${score} out of 10`}
        className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"
      >
        <div className={`h-full rounded-full transition-all ${colour}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-12 text-right">Score {score}/10</span>
    </div>
  )
}

function SourceLinks({ sources }) {
  if (!sources || sources.length === 0) return null
  return (
    <div className="mt-2 flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-500">Evidence &amp; sources</p>
      {sources.map((s, i) => (
        <a
          key={i}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2 leading-relaxed"
        >
          🔗 {s.label}
        </a>
      ))}
    </div>
  )
}

export default function IngredientRow({ item }) {
  const [expanded, setExpanded] = useState(false)
  const config = RATING_CONFIG[item.rating] || RATING_CONFIG.unknown

  const hasDetail = !!(item.concern || item.alternatives || (item.sources && item.sources.length > 0))

  const handleToggle = () => {
    if (hasDetail) setExpanded(v => !v)
  }

  return (
    <div
      role={hasDetail ? 'button' : undefined}
      tabIndex={hasDetail ? 0 : undefined}
      aria-expanded={hasDetail ? expanded : undefined}
      aria-label={hasDetail
        ? `${item.name} — ${config.label}${item.isAllergen ? ', allergen' : ''}. Tap for details.`
        : `${item.name} — ${config.label}`
      }
      onClick={handleToggle}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleToggle()}
      className={`ingredient-row ${hasDetail ? 'cursor-pointer select-none' : 'cursor-default'}`}
    >
      <span aria-hidden="true" className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${config.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-white leading-snug">{item.name}</span>
            {item.description && !item.concern && (
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0 items-center">
            {item.isAllergen && (
              <span className="text-xs px-2 py-0.5 rounded-full badge-allergen">Allergen</span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.badge}`}>{config.label}</span>
            {hasDetail && (
              <span aria-hidden="true" className="text-slate-600 text-xs ml-0.5">{expanded ? '▲' : '▼'}</span>
            )}
          </div>
        </div>

        {item.hazardScore != null && <HazardBar score={item.hazardScore} />}

        {expanded && hasDetail && (
          <div className="mt-2 flex flex-col gap-2 animate-fade-in">
            {item.concern && (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 rounded-lg p-2.5">
                <span aria-hidden="true">⚠️ </span>{item.concern}
              </p>
            )}
            {item.alternatives && (
              <div className="bg-emerald-900/30 border border-emerald-800/40 rounded-lg p-2.5">
                <p className="text-xs font-semibold text-emerald-400 mb-1"><span aria-hidden="true">✅ </span>Safer alternatives</p>
                <p className="text-xs text-slate-300 leading-relaxed">{item.alternatives}</p>
              </div>
            )}
            <SourceLinks sources={item.sources} />
          </div>
        )}
      </div>
    </div>
  )
}
