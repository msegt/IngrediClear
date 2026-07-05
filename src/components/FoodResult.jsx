import React, { useState, useRef, useEffect } from 'react'
import { analyseFoodProduct } from '../data/foodChecker.js'
import NutritionGauge from './NutritionGauge.jsx'
import ImageLightbox from './ImageLightbox.jsx'
import NutriScoreBadge from './NutriScoreBadge.jsx'

function SourceLinks({ sources }) {
  if (!sources || sources.length === 0) return null
  return (
    <div className="mt-1.5 flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-500">Evidence</p>
      {sources.map((s, i) => (
        <a
          key={i}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2 leading-relaxed"
        >
          🔗 {s.label}
        </a>
      ))}
    </div>
  )
}

function UsdaTooltip() {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="Nutrition data source information"
        onClick={() => setOpen(o => !o)}
        onBlur={() => setOpen(false)}
        className="ml-1.5 w-4 h-4 rounded-full bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white transition text-[10px] font-bold leading-none flex items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-400"
      >
        i
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-xl bg-slate-800 border border-slate-700 shadow-xl px-3 py-2 text-xs text-slate-300 leading-relaxed z-50"
        >
          Some nutrition values were supplemented from{' '}
          <a
            href="https://fdc.nal.usda.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 underline underline-offset-2"
          >
            USDA FoodData Central
          </a>{' '}
          because Open Food Facts had incomplete data for this product.
        </span>
      )}
    </span>
  )
}

const NOVA_INFO = {
  1: { label: 'Unprocessed or minimally processed', detail: 'Natural foods with no or minimal industrial processing — e.g. fruit, vegetables, plain meat, eggs, milk, dried legumes.' },
  2: { label: 'Processed culinary ingredients', detail: 'Substances extracted from foods and used in cooking — e.g. oils, butter, flour, sugar, salt. Not usually eaten on their own.' },
  3: { label: 'Processed foods', detail: 'Foods made by adding salt, sugar, or oil to NOVA 1 foods — e.g. canned vegetables, salted nuts, cured meats, simple cheeses.' },
  4: { label: 'Ultra-processed foods', detail: 'Industrial formulations with 5+ ingredients, often including additives not found in home cooking — e.g. soft drinks, packaged snacks, instant noodles, reconstituted meat products. Associated with higher risk of obesity, type 2 diabetes, and cardiovascular disease in large prospective studies.' },
}

function NovaBadge({ group }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const tipRef = useRef(null)
  const num = parseInt(group, 10)
  if (!num || !NOVA_INFO[num]) return null

  useEffect(() => {
    if (!open || !tipRef.current) return
    const tip = tipRef.current
    const rect = tip.getBoundingClientRect()
    const vw = window.innerWidth
    const MARGIN = 12
    if (rect.right > vw - MARGIN) {
      tip.style.left = 'auto'
      tip.style.right = '0'
    }
    if (rect.left < MARGIN) {
      tip.style.left = '0'
      tip.style.right = 'auto'
    }
  }, [open])

  return (
    <span className="relative inline-flex">
      <button
        ref={btnRef}
        type="button"
        aria-label={`NOVA group ${num} — tap for explanation`}
        onClick={() => setOpen(o => !o)}
        onBlur={() => setOpen(false)}
        className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
      >
        NOVA {num} ℹ️
      </button>
      {open && (
        <span
          ref={tipRef}
          role="tooltip"
          className="absolute top-full left-0 mt-2 w-[min(256px,calc(100vw-24px))] rounded-xl bg-slate-800 border border-slate-700 shadow-xl px-3 py-2.5 text-xs text-slate-300 leading-relaxed z-50"
        >
          <span className="block font-semibold text-white mb-2">NOVA food processing scale</span>
          {[1, 2, 3, 4].map(n => (
            <span
              key={n}
              className={`flex gap-2 mb-1.5 last:mb-0 ${
                n === num ? 'text-purple-300 font-semibold' : 'text-slate-500'
              }`}
            >
              <span className="shrink-0">{n}.</span>
              <span>{NOVA_INFO[n].label}{n === num ? ` — ${NOVA_INFO[n].detail}` : ''}</span>
            </span>
          ))}
          <a
            href="https://world.openfoodfacts.org/nova"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-brand-400 underline underline-offset-2"
          >
            About NOVA (Monteiro et al.) — Open Food Facts
          </a>
        </span>
      )}
    </span>
  )
}

export default function FoodResult({ product, onBack }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const analysis = analyseFoodProduct(product)
  const imageUrl = product.image_front_url || product.image_url
  const usdaEnriched = !!product._usdaEnriched

  return (
    <div className="flex flex-col gap-4 pb-8">
      {lightboxOpen && imageUrl && (
        <ImageLightbox
          src={imageUrl}
          alt={product.product_name || 'Food product image'}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium">
        ← Scan another
      </button>

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
              <span className="text-white text-xl drop-shadow-lg">🔍</span>
            </div>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-white text-lg leading-tight">{product.product_name || 'Unknown food item'}</h2>
          {product.brands && <p className="text-sm text-slate-400 mt-0.5">{product.brands}</p>}
          {product.categories && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.categories}</p>}
          <div className="flex flex-wrap items-end gap-4 mt-3">
            {analysis.nutriscore && (
              <NutriScoreBadge grade={analysis.nutriscore} />
            )}
            {analysis.novaGroup && (
              <div className="flex flex-col gap-1 justify-end pb-0.5">
                <NovaBadge group={analysis.novaGroup} />
              </div>
            )}
          </div>
        </div>
      </div>

      <NutritionGauge
        score={analysis.healthScore}
        protein={analysis.nutrients.protein}
        scoreReasons={analysis.scoreReasons}
      />

      {analysis.allergens.length > 0 && (
        <div className="card p-4 border border-orange-500/30 bg-orange-500/10">
          <p className="text-sm font-semibold text-orange-400 mb-2">⚠️ Contains allergens</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {analysis.allergens.map((a, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">{a.label}</span>
            ))}
          </div>
          <p className="text-xs text-slate-400">Allergens are declared as required by EU Food Information Regulation 1169/2011.</p>
          <SourceLinks sources={[{ label: 'EU Regulation 1169/2011 — Food allergen labelling', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169' }]} />
        </div>
      )}

      {analysis.flags.length > 0 && (
        <div className="card p-4">
          <p className="text-sm font-semibold text-white mb-2">📊 Nutritional flags</p>
          <div className="flex flex-col gap-3">
            {analysis.flags.map((flag, i) => (
              <div key={i} className={`rounded-xl p-3 border ${
                flag.level === 'high'     ? 'bg-red-500/10 border-red-500/30' :
                flag.level === 'moderate' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                            'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                <p className="text-sm font-semibold text-white">{flag.label}</p>
                <p className="text-xs text-slate-400 mt-1">{flag.detail}</p>
                <SourceLinks sources={flag.sources} />
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.additiveFlags.length > 0 && (
        <div className="card p-4">
          <p className="text-sm font-semibold text-white mb-2">🚩 Notable ingredients</p>
          <div className="flex flex-col gap-3">
            {analysis.additiveFlags.map((item, i) => (
              <div key={i} className="rounded-xl p-3 border border-slate-700 bg-slate-800/70">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-slate-400 mt-1">{item.detail}</p>
                <SourceLinks sources={item.sources} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex items-center mb-3">
          <p className="text-sm font-semibold text-white">Nutrition per 100g</p>
          {usdaEnriched && <UsdaTooltip />}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Sugar',    value: analysis.nutrients.sugar,        unit: 'g/100g' },
            { label: 'Salt',     value: analysis.nutrients.salt,         unit: 'g/100g' },
            { label: 'Sat. fat', value: analysis.nutrients.saturatedFat, unit: 'g/100g' },
            { label: 'Fibre',    value: analysis.nutrients.fiber,        unit: 'g/100g' }
          ].map(item => (
            <div key={item.label} className="bg-slate-800/60 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-lg font-bold text-white mt-1">{item.value ?? '–'}</p>
              <p className="text-xs text-slate-600">{item.unit}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-slate-600 px-4">
        {usdaEnriched
          ? 'Data from Open Food Facts (ODbL) + USDA FoodData Central. Informational only — not medical or dietary advice.'
          : 'Data from Open Food Facts (ODbL). Informational only — not medical or dietary advice.'}
      </p>
    </div>
  )
}
