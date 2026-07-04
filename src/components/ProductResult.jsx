import React, { useMemo, useState } from 'react'
import { analyseIngredients } from '../data/ingredientChecker.js'
import IngredientRow from './IngredientRow.jsx'

export default function ProductResult({ product, onBack }) {
  const [showAll, setShowAll] = useState(false)

  const analysed = useMemo(() => analyseIngredients(product.ingredients_text || ''), [product])

  const { harmful, allergens, caution, safe, unknown } = useMemo(() => {
    const groups = { harmful: [], allergens: [], caution: [], safe: [], unknown: [] }
    for (const item of analysed) {
      if (item.rating === 'harmful') groups.harmful.push(item)
      else if (item.isAllergen) groups.allergens.push(item)
      else if (item.rating === 'caution') groups.caution.push(item)
      else if (item.rating === 'safe') groups.safe.push(item)
      else groups.unknown.push(item)
    }
    return groups
  }, [analysed])

  const overallScore = useMemo(() => {
    if (harmful.length > 0) return 'harmful'
    if (allergens.length > 0 || caution.length > 2) return 'caution'
    return 'safe'
  }, [harmful, allergens, caution])

  const scoreConfig = {
    safe: { emoji: '✅', label: 'Generally Safe', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    caution: { emoji: '⚠️', label: 'Use with Caution', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
    harmful: { emoji: '🚫', label: 'Harmful Ingredients Detected', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' }
  }
  const score = scoreConfig[overallScore]

  const imageUrl = product.image_url || product.image_front_url

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium">
        <span>←</span> Scan another product
      </button>

      {/* Product header */}
      <div className="card p-4 flex gap-4 items-start">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.product_name}
            className="w-20 h-20 object-contain rounded-xl bg-slate-800 flex-shrink-0"
            onError={e => e.target.style.display = 'none'}
          />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-white text-lg leading-tight truncate">
            {product.product_name || 'Unknown Product'}
          </h2>
          {product.brands && (
            <p className="text-sm text-slate-400 mt-0.5">{product.brands}</p>
          )}
          {product.categories && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.categories.split(',')[0]}</p>
          )}
        </div>
      </div>

      {/* Overall score */}
      <div className={`card p-4 border ${score.bg} flex items-center gap-4`}>
        <span className="text-4xl">{score.emoji}</span>
        <div>
          <p className={`font-bold text-lg ${score.color}`}>{score.label}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {harmful.length} harmful · {allergens.length} allergens · {caution.length} caution flags
          </p>
        </div>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Harmful', count: harmful.length, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
          { label: 'Allergens', count: allergens.length, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
          { label: 'Caution', count: caution.length, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
          { label: 'Safe', count: safe.length, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
        ].map(s => (
          <div key={s.label} className={`border rounded-xl p-2.5 text-center ${s.color}`}>
            <div className="text-xl font-bold">{s.count}</div>
            <div className="text-xs mt-0.5 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Ingredient sections */}
      {harmful.length > 0 && <IngredientSection title="🚫 Harmful Ingredients" items={harmful} />}
      {allergens.length > 0 && <IngredientSection title="🤧 Allergens" items={allergens} />}
      {caution.length > 0 && <IngredientSection title="⚠️ Use with Caution" items={caution} />}

      {/* Safe / unknown toggle */}
      {(safe.length > 0 || unknown.length > 0) && (
        <div className="card">
          <button
            onClick={() => setShowAll(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition"
          >
            <span>✅ Safe & unclassified ingredients ({safe.length + unknown.length})</span>
            <span className="text-xs">{showAll ? '▲ Hide' : '▼ Show'}</span>
          </button>
          {showAll && (
            <div className="px-4 pb-3">
              {[...safe, ...unknown].map((item, i) => (
                <IngredientRow key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {analysed.length === 0 && (
        <div className="card p-5 text-center">
          <p className="text-slate-400 text-sm">No ingredient data available for this product in the Open Beauty Facts database.</p>
        </div>
      )}

      <p className="text-center text-xs text-slate-600 px-4">
        Data from Open Beauty Facts (CC BY-SA). Always consult a dermatologist for medical advice.
      </p>
    </div>
  )
}

function IngredientSection({ title, items }) {
  return (
    <div className="card">
      <div className="px-4 pt-4 pb-2">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
      </div>
      <div className="px-4 pb-2">
        {items.map((item, i) => <IngredientRow key={i} item={item} />)}
      </div>
    </div>
  )
}
