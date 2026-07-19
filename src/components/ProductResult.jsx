import React, { useMemo, useState } from 'react'
import { analyseIngredients } from '../data/ingredientChecker.js'
import { detectCategory, getCategoryWarnings } from '../data/categoryDetector.js'
import IngredientRow     from './IngredientRow.jsx'
import ImageLightbox     from './ImageLightbox.jsx'
import IngredientCapture from './IngredientCapture.jsx'

export default function ProductResult({ product, onBack }) {
  const [showAll, setShowAll]           = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [manualIngredients, setManualIngredients] = useState(null)

  const ingredientsText = manualIngredients ?? (product.ingredients_text || '')
  const hasIngredients  = ingredientsText.trim().length > 0

  const analysed         = useMemo(() => analyseIngredients(ingredientsText), [ingredientsText])
  const category         = useMemo(() => detectCategory(product), [product])
  const categoryWarnings = useMemo(() => getCategoryWarnings(category), [category])

  const { harmful, allergens, caution, safe, unknown } = useMemo(() => {
    const groups = { harmful: [], allergens: [], caution: [], safe: [], unknown: [] }
    for (const item of analysed) {
      if (item.rating === 'harmful') groups.harmful.push(item)
      else if (item.isAllergen && item.rating === 'caution') groups.caution.push(item)
      else if (item.isAllergen) groups.allergens.push(item)
      else if (item.rating === 'caution') groups.caution.push(item)
      else if (item.rating === 'safe') groups.safe.push(item)
      else groups.unknown.push(item)
    }
    return groups
  }, [analysed])

  const overallScore = useMemo(() => {
    if (!hasIngredients) return 'unknown'
    if (harmful.length > 0) return 'harmful'
    if (caution.length > 0) return 'caution'
    return 'safe'
  }, [hasIngredients, harmful, caution])

  const scoreReason = useMemo(() => {
    if (!hasIngredients) return 'No ingredient list available — safety cannot be assessed.'
    if (overallScore === 'harmful')
      return `${harmful.length} ingredient${harmful.length > 1 ? 's' : ''} matched a known or suspected hazard. See details below.`
    if (overallScore === 'caution')
      return `${caution.length} ingredient${caution.length > 1 ? 's' : ''} with a use-with-caution flag. See details below.`
    const allergenNote = allergens.length > 0
      ? ` Contains ${allergens.length} EU-listed fragrance allergen${allergens.length > 1 ? 's' : ''} — safe for most people, but avoid if you have a sensitivity to ${allergens.length > 1 ? 'these ingredients' : 'this ingredient'}.`
      : ''
    const unknownNote = unknown.length > 0
      ? ` ${unknown.length} ingredient${unknown.length > 1 ? 's' : ''} were not in our database and could not be assessed.`
      : ''
    return `No harmful or flagged ingredients detected.${allergenNote}${unknownNote}`
  }, [overallScore, hasIngredients, harmful, caution, allergens, unknown])

  const scoreConfig = {
    safe:    { emoji: '\u2705', label: 'Generally Safe',               color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    caution: { emoji: '\u26a0\ufe0f', label: 'Use with Caution',      color: 'text-yellow-400',  bg: 'bg-yellow-500/10  border-yellow-500/30'  },
    harmful: { emoji: '\uD83D\uDEAB', label: 'Harmful Ingredients Detected', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
    unknown: { emoji: '\u2753', label: 'Ingredients Not Available',    color: 'text-slate-400',  bg: 'bg-slate-700/40   border-slate-600/40'    }
  }
  const score    = scoreConfig[overallScore]
  const imageUrl = product.image_url || product.image_front_url

  const handleShare = async () => {
    const text = `IngrediClear result for ${product.product_name || 'this product'}:\n${score.emoji} ${score.label}\n${scoreReason}\n\nhttps://github.com/msegt/IngrediClear`
    if (navigator.share) {
      await navigator.share({ title: 'IngrediClear', text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Result copied to clipboard!')
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      {lightboxOpen && imageUrl && (
        <ImageLightbox
          src={imageUrl}
          alt={product.product_name || 'Product image'}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Scan another product"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
        >
          <span aria-hidden="true">←</span> Scan another
        </button>
        <button
          onClick={handleShare}
          aria-label="Share this result"
          className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition font-medium"
        >
          <span aria-hidden="true">↑</span> Share
        </button>
      </div>

      {/* Product header */}
      <div className="card p-4 flex gap-4 items-start">
        {imageUrl && (
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label={`View full-size image of ${product.product_name || 'product'}`}
            className="relative flex-shrink-0 rounded-xl overflow-hidden group focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <img
              src={imageUrl}
              alt={product.product_name || 'Product'}
              className="w-20 h-20 object-contain bg-slate-800 transition group-hover:brightness-75"
              onError={e => e.target.parentElement.style.display = 'none'}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition pointer-events-none">
              <span className="text-white text-xl drop-shadow-lg" aria-hidden="true">🔍</span>
            </div>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-white text-lg leading-tight">{product.product_name || 'Unknown Product'}</h2>
          {product.brands && <p className="text-sm text-slate-400 mt-0.5">{product.brands}</p>}
          {category && (
            <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Category-specific warnings */}
      {categoryWarnings.length > 0 && (
        <div className="card p-4 border border-blue-500/30 bg-blue-500/10">
          <p className="text-xs font-semibold text-blue-400 mb-2"><span aria-hidden="true">📋</span> {category} — What to watch for</p>
          <ul className="flex flex-col gap-1">
            {categoryWarnings.map((w, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2"><span className="text-blue-400 mt-0.5" aria-hidden="true">•</span>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* No-ingredients capture prompt */}
      {!hasIngredients && (
        <div className="flex flex-col gap-4">
          <div className="card p-4 border border-amber-500/30 bg-amber-500/10 flex gap-3 items-start">
            <span className="text-2xl mt-0.5" aria-hidden="true">📋</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-400 text-sm">No ingredient list in the database</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                This product was found but has no ingredient data yet. Paste the list from the packaging
                or take a photo — the analysis runs entirely on your device.
              </p>
            </div>
          </div>

          <IngredientCapture onAnalyse={(text) => setManualIngredients(text)} />

          {product.id && product._source !== 'upcitemdb' && product._source !== 'manual' && (
            <a
              href={`https://world.openbeautyfacts.org/product/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-xs text-slate-400 hover:text-brand-400 transition underline underline-offset-2"
            >
              Also add these ingredients to Open Beauty Facts to help others
              <span aria-hidden="true"> →</span>
            </a>
          )}
        </div>
      )}

      {/* Everything below only renders once we have ingredients */}
      {hasIngredients && (
        <>
          {manualIngredients && (
            <div className="card p-3 border border-brand-500/30 bg-brand-500/10 flex items-center gap-3">
              <span aria-hidden="true">ℹ️</span>
              <p className="text-xs text-brand-300 leading-relaxed flex-1">
                Analysis based on ingredients you entered — not from the product database.
              </p>
              <button
                onClick={() => setManualIngredients(null)}
                className="text-xs text-slate-400 hover:text-white transition flex-shrink-0"
                aria-label="Clear manually entered ingredients"
              >
                Clear
              </button>
            </div>
          )}

          {/* Overall score */}
          <div
            className={`card p-4 border ${score.bg} flex items-center gap-4`}
            role="status"
            aria-label={`Overall result: ${score.label}. ${scoreReason}`}
          >
            <span className="text-4xl" aria-hidden="true">{score.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-lg ${score.color}`} aria-hidden="true">{score.label}</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed" aria-hidden="true">{scoreReason}</p>
            </div>
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-4 gap-2" role="list" aria-label="Ingredient summary">
            {[
              { label: 'Harmful',   count: harmful.length,  color: 'text-red-400     bg-red-500/10    border-red-500/20'      },
              { label: 'Allergens', count: allergens.length, color: 'text-orange-400  bg-orange-500/10 border-orange-500/20'   },
              { label: 'Caution',   count: caution.length,  color: 'text-yellow-400  bg-yellow-500/10 border-yellow-500/20'   },
              { label: 'Safe',      count: safe.length,     color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
            ].map(s => (
              <div
                key={s.label}
                role="listitem"
                aria-label={`${s.count} ${s.label.toLowerCase()} ingredient${s.count !== 1 ? 's' : ''}`}
                className={`border rounded-xl p-2.5 text-center ${s.color}`}
              >
                <div className="text-xl font-bold" aria-hidden="true">{s.count}</div>
                <div className="text-xs mt-0.5 opacity-80" aria-hidden="true">{s.label}</div>
              </div>
            ))}
          </div>

          {unknown.length > 0 && (
            <div className="card p-3 border border-slate-600/40 bg-slate-700/20 flex gap-3 items-start">
              <span className="text-lg mt-0.5" aria-hidden="true">❓</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-300">{unknown.length} ingredient{unknown.length > 1 ? 's' : ''} not in our database</span> and could not be assessed. This does not mean they are safe — it means we have no data on them.
              </p>
            </div>
          )}

          {harmful.length > 0   && <IngredientSection title="Harmful Ingredients"      titleEmoji="\uD83D\uDEAB" items={harmful} />}
          {caution.length > 0   && <IngredientSection title="Use with Caution"         titleEmoji="\u26A0\uFE0F" items={caution} />}
          {allergens.length > 0 && (
            <IngredientSection
              title="Fragrance Allergens Detected"
              titleEmoji="\uD83E\uDD27"
              items={allergens}
              note="These ingredients are safe for most people. They are listed here because the EU legally requires manufacturers to declare them on labels — so that anyone with a known sensitivity can identify and avoid them. If you have an allergy or sensitivity to any of these, do not use this product."
            />
          )}

          {(safe.length > 0 || unknown.length > 0) && (
            <div className="card">
              <button
                onClick={() => setShowAll(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition"
                aria-expanded={showAll}
                aria-controls="safe-unclassified-list"
              >
                <span><span aria-hidden="true">✅</span> Safe &amp; unclassified ({safe.length + unknown.length})</span>
                <span className="text-xs" aria-hidden="true">{showAll ? '\u25b2 Hide' : '\u25bc Show'}</span>
              </button>
              {showAll && (
                <div id="safe-unclassified-list" className="px-4 pb-3">
                  {[...safe, ...unknown].map((item, i) => <IngredientRow key={i} item={item} />)}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* text-slate-400 ensures passing contrast on bg-slate-950 */}
      <p className="text-center text-xs text-slate-400 px-4">
        Data from Open Beauty Facts (CC BY-SA). Not medical advice — consult a dermatologist for personal guidance.
      </p>
    </div>
  )
}

function IngredientSection({ title, titleEmoji, items, note }) {
  return (
    <div className="card">
      <div className="px-4 pt-4 pb-2">
        <h3 className="font-semibold text-white text-sm">
          {titleEmoji && <span aria-hidden="true">{titleEmoji} </span>}{title}
        </h3>
        {note && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{note}</p>}
      </div>
      <div className="px-4 pb-2">
        {items.map((item, i) => <IngredientRow key={i} item={item} />)}
      </div>
    </div>
  )
}
