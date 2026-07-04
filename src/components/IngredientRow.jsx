import React from 'react'

const RATING_CONFIG = {
  harmful: { badge: 'badge-harmful', dot: 'bg-red-500', label: 'Harmful' },
  caution: { badge: 'badge-caution', dot: 'bg-yellow-500', label: 'Caution' },
  safe:    { badge: 'badge-safe',    dot: 'bg-emerald-500', label: 'Safe' },
  unknown: { badge: 'bg-slate-700/50 text-slate-400 border border-slate-700', dot: 'bg-slate-500', label: 'Unknown' }
}

export default function IngredientRow({ item }) {
  const config = RATING_CONFIG[item.rating] || RATING_CONFIG.unknown

  return (
    <div className="ingredient-row">
      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${config.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-white leading-snug">{item.name}</span>
          <div className="flex gap-1 flex-shrink-0">
            {item.isAllergen && (
              <span className="text-xs px-2 py-0.5 rounded-full badge-allergen">Allergen</span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.badge}`}>{config.label}</span>
          </div>
        </div>
        {item.concern && (
          <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.concern}</p>
        )}
      </div>
    </div>
  )
}
