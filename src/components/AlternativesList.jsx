import React, { useState, useEffect } from 'react'

/**
 * Displays a horizontally-scrollable row of product alternatives.
 *
 * Props:
 *   fetchAlternatives  – async () => Product[]   (called once on mount)
 *   currentGrade       – string | null  (used only for food, to label improvement)
 *   type               – 'food' | 'cosmetic'
 */
export default function AlternativesList({ fetchAlternatives, currentGrade, type }) {
  const [alternatives, setAlternatives] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const results = await fetchAlternatives()
        if (!cancelled) setAlternatives(results || [])
      } catch {
        if (!cancelled) setAlternatives([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Nothing to show and not loading — don't render anything
  if (!loading && alternatives.length === 0) return null

  const gradeColor = (grade) => {
    const g = (grade || '').toLowerCase()
    if (g === 'a') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    if (g === 'b') return 'bg-lime-500/20 text-lime-300 border-lime-500/30'
    if (g === 'c') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    if (g === 'd') return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    return 'bg-slate-700/40 text-slate-400 border-slate-600/30'
  }

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <span aria-hidden="true" className="text-lg">✨</span>
        <h3 className="text-sm font-semibold text-white">
          {type === 'food' ? 'Healthier Alternatives' : 'Safer Alternatives'}
        </h3>
      </div>

      <div
        className="flex overflow-x-auto gap-3 pb-1 snap-x snap-mandatory"
        role="list"
        aria-label={type === 'food' ? 'Healthier product alternatives' : 'Safer product alternatives'}
        aria-busy={loading}
      >
        {loading
          ? /* Skeleton cards */
            [1, 2, 3].map(i => (
              <div
                key={i}
                aria-hidden="true"
                className="flex-shrink-0 snap-start w-36 h-52 rounded-2xl bg-slate-700/40 animate-pulse"
              />
            ))
          : alternatives.map(alt => {
              const grade = type === 'food' ? alt.nutriscore_grade : alt.ecoscore_grade
              const allergenCount = Array.isArray(alt.allergens_tags) ? alt.allergens_tags.length : null

              // Build a short "why better" reason string
              const reasons = []
              if (type === 'food' && grade && currentGrade) {
                reasons.push(`Nutri-Score ${grade.toUpperCase()} vs ${currentGrade.toUpperCase()}`)
              }
              if (type === 'cosmetic' && allergenCount !== null && allergenCount === 0) {
                reasons.push('No declared allergens')
              } else if (type === 'cosmetic' && grade) {
                reasons.push(`Eco-Score ${grade.toUpperCase()}`)
              }
              if (alt.labels && alt.labels.toLowerCase().includes('organic')) reasons.push('Organic')

              return (
                <div
                  key={alt.code}
                  role="listitem"
                  aria-label={`${alt.product_name || 'Product'}${reasons.length ? '. ' + reasons.join(', ') : ''}`}
                  className="flex-shrink-0 snap-start w-36 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3 flex flex-col gap-1.5 hover:border-brand-500/50 hover:bg-slate-800 transition cursor-default"
                >
                  {alt.image_front_small_url
                    ? (
                      <img
                        src={alt.image_front_small_url}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-20 object-contain rounded-lg bg-slate-900/40"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    )
                    : <div className="w-full h-20 rounded-lg bg-slate-900/40 flex items-center justify-center"><span aria-hidden="true" className="text-2xl">📦</span></div>
                  }

                  {alt.brands && (
                    <p className="text-[10px] text-slate-500 truncate">{alt.brands}</p>
                  )}
                  <p className="text-xs text-white font-medium leading-tight line-clamp-2">{alt.product_name || 'Unknown'}</p>

                  {grade && (
                    <span className={`mt-auto self-start text-[10px] font-bold px-2 py-0.5 rounded-full border ${gradeColor(grade)}`}>
                      {type === 'food' ? 'Nutri' : 'Eco'}-{grade.toUpperCase()}
                    </span>
                  )}

                  {reasons.length > 0 && (
                    <p className="text-[10px] text-slate-500 leading-tight">{reasons.join(' · ')}</p>
                  )}
                </div>
              )
            })
        }
      </div>

      <p className="text-[10px] text-slate-600 mt-2">
        Suggestions from {type === 'food' ? 'Open Food Facts' : 'Open Beauty Facts'}. Not personalised advice.
      </p>
    </div>
  )
}
