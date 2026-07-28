import React, { useState, useEffect } from 'react'

/**
 * AlternativesList
 * Displays healthier/safer product alternatives after a scan.
 * Shows skeleton loaders while fetching to prevent layout shift.
 *
 * Props:
 *   fetchFn     — async () => Product[]  (already partially applied by parent)
 *   title       — string, e.g. "Healthier alternatives"
 *   gradeLabel  — string, e.g. "Nutri-Score" or "Eco-Score"
 *   gradeKey    — string, property name on each product, e.g. "nutriscore_grade"
 *   gradeColors — object mapping grade letter to Tailwind text colour class
 */
export default function AlternativesList({ fetchFn, title = 'Better alternatives', gradeLabel, gradeKey, gradeColors = {} }) {
  const [alternatives, setAlternatives] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    fetchFn()
      .then(results => {
        if (!cancelled) {
          setAlternatives(results)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) { setError(true); setLoading(false) }
      })
    return () => { cancelled = true }
  }, [])

  // Nothing to show — render nothing rather than an empty section
  if (!loading && (error || alternatives.length === 0)) return null

  const gradeColorClass = grade =>
    gradeColors[grade?.toLowerCase()] ?? 'text-emerald-400'

  return (
    <div className="card p-4">
      <p className="text-sm font-semibold text-white mb-3">
        <span aria-hidden="true">✨ </span>{title}
      </p>

      <div
        className="flex overflow-x-auto gap-3 pb-1 snap-x scrollbar-hide"
        role="list"
        aria-label={title}
        aria-busy={loading}
      >
        {loading ? (
          // ── Skeleton loaders (3 cards) ──────────────────────────────────
          [1, 2, 3].map(i => (
            <div
              key={i}
              aria-hidden="true"
              className="flex-shrink-0 w-36 h-52 bg-slate-800 animate-pulse rounded-2xl snap-start"
            />
          ))
        ) : (
          // ── Real product cards ──────────────────────────────────────────
          alternatives.map(alt => {
            const grade      = alt[gradeKey]?.toUpperCase()
            const allergens  = alt.allergens_tags || []
            const imageUrl   = alt.image_front_small_url
            const name       = alt.product_name || 'Unknown product'
            const brand      = alt.brands || ''

            return (
              <div
                key={alt.code}
                role="listitem"
                className="flex-shrink-0 w-36 bg-slate-800 rounded-2xl p-3 snap-start flex flex-col gap-1.5 border border-slate-700 hover:border-brand-400/50 transition-colors"
              >
                {/* Product image */}
                <div className="w-full h-20 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-contain"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <span className="text-3xl" aria-hidden="true">🛍️</span>
                  )}
                </div>

                {/* Brand + name */}
                {brand && <p className="text-[10px] text-slate-500 truncate">{brand}</p>}
                <p className="text-xs font-semibold text-white leading-tight line-clamp-2">{name}</p>

                {/* Grade badge */}
                {grade && (
                  <span className={`mt-auto text-xs font-bold ${gradeColorClass(alt[gradeKey])} bg-slate-900/60 rounded-lg px-2 py-1 w-max`}>
                    {gradeLabel} {grade}
                  </span>
                )}

                {/* Allergen count — lower is better */}
                {allergens.length === 0 && (
                  <span className="text-[10px] text-emerald-400">✓ No allergens listed</span>
                )}
              </div>
            )
          })
        )}
      </div>

      <p className="text-[10px] text-slate-600 mt-2">Alternatives sourced from Open Food Facts / Open Beauty Facts (ODbL).</p>
    </div>
  )
}
