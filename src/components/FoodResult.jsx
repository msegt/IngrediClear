import React, { useState, useRef, useEffect } from 'react'
import { analyseFoodProduct } from '../data/foodChecker.js'
import NutritionGauge from './NutritionGauge.jsx'
import ImageLightbox from './ImageLightbox.jsx'
import NutriScoreBadge from './NutriScoreBadge.jsx'
import EcoScoreBadge from './EcoScoreBadge.jsx'
import PackagingFlags from './PackagingFlags.jsx'
import { addToGroceryList, removeFromGroceryList, isInGroceryList } from '../data/groceryList.js'

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

// Official NOVA colours used by Open Food Facts / Santé publique France
const NOVA_COLORS = {
  1: { bg: '#1d8348', text: '#ffffff', ring: '#1d8348' },
  2: { bg: '#58b55e', text: '#ffffff', ring: '#58b55e' },
  3: { bg: '#f07e18', text: '#ffffff', ring: '#f07e18' },
  4: { bg: '#d63a2f', text: '#ffffff', ring: '#d63a2f' },
}

const NOVA_INFO = {
  1: { label: 'Unprocessed or minimally processed', detail: 'Natural foods with no or minimal industrial processing — e.g. fruit, vegetables, plain meat, eggs, milk, dried legumes.' },
  2: { label: 'Processed culinary ingredients', detail: 'Substances extracted from foods and used in cooking — e.g. oils, butter, flour, sugar, salt. Not usually eaten on their own.' },
  3: { label: 'Processed foods', detail: 'Foods made by adding salt, sugar, or oil to NOVA 1 foods — e.g. canned vegetables, salted nuts, cured meats, simple cheeses.' },
  4: { label: 'Ultra-processed foods', detail: 'Industrial formulations with 5+ ingredients, often including additives not found in home cooking — e.g. soft drinks, packaged snacks, instant noodles, reconstituted meat products. Associated with higher risk of obesity, type 2 diabetes, and cardiovascular disease in large prospective studies.' },
}

function NovaBadge({ group }) {
  const [open, setOpen] = useState(false)
  const tipRef = useRef(null)
  const num = parseInt(group, 10)
  if (!num || !NOVA_INFO[num]) return null

  const color = NOVA_COLORS[num]

  useEffect(() => {
    if (!open || !tipRef.current) return
    const tip = tipRef.current
    const rect = tip.getBoundingClientRect()
    const vw = window.innerWidth
    const MARGIN = 12
    if (rect.right > vw - MARGIN) { tip.style.left = 'auto'; tip.style.right = '0' }
    if (rect.left < MARGIN)       { tip.style.left = '0';    tip.style.right = 'auto' }
  }, [open])

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-slate-400 font-medium">NOVA group</p>
      <span className="relative inline-flex">
        <button
          type="button"
          aria-label={`NOVA group ${num} — tap for explanation`}
          onClick={() => setOpen(o => !o)}
          onBlur={() => setOpen(false)}
          style={{
            backgroundColor: color.bg,
            color: color.text,
            boxShadow: `0 0 0 2px ${color.ring}44`,
          }}
          className="text-sm font-black px-3 py-1.5 rounded-lg transition hover:brightness-110 focus:outline-none focus-visible:ring-2"
        >
          {num} ℹ️
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
                className="flex gap-2 mb-1.5 last:mb-0"
                style={{ color: n === num ? NOVA_COLORS[n].bg : undefined }}
              >
                <span
                  className="shrink-0 font-black text-xs w-4 h-4 rounded flex items-center justify-center text-white"
                  style={{ backgroundColor: NOVA_COLORS[n].bg, opacity: n === num ? 1 : 0.45 }}
                >
                  {n}
                </span>
                <span className={n === num ? 'font-semibold text-white' : 'text-slate-500'}>
                  {NOVA_INFO[n].label}{n === num ? ` — ${NOVA_INFO[n].detail}` : ''}
                </span>
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
    </div>
  )
}

export default function FoodResult({ product, onBack }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [inGroceryList, setInGroceryList] = useState(() => isInGroceryList(product.code || product.id))
  const analysis = analyseFoodProduct(product)
  const imageUrl = product.image_front_url || product.image_url
  const usdaEnriched = !!product._usdaEnriched

  const handleGroceryToggle = () => {
    const barcode = product.code || product.id
    if (inGroceryList) {
      removeFromGroceryList(barcode)
      setInGroceryList(false)
    } else {
      addToGroceryList({
        barcode,
        name: product.product_name || 'Unknown',
        brand: product.brands || '',
        image: imageUrl || '',
        nutriscore: analysis.nutriscore || '',
        novaGroup: analysis.novaGroup || null,
      })
      setInGroceryList(true)
    }
  }

  const nutritionItems = [
    { label: 'Energy',    value: analysis.nutrients.energyKcal,   unit: 'kcal/100g' },
    { label: 'Fat',       value: analysis.nutrients.totalFat,     unit: 'g/100g' },
    { label: 'Sat. fat',  value: analysis.nutrients.saturatedFat, unit: 'g/100g' },
    { label: 'Carbs',     value: analysis.nutrients.carbohydrates,unit: 'g/100g' },
    { label: 'Sugar',     value: analysis.nutrients.sugar,        unit: 'g/100g' },
    { label: 'Fibre',     value: analysis.nutrients.fiber,        unit: 'g/100g' },
    { label: 'Protein',   value: analysis.nutrients.protein,      unit: 'g/100g' },
    { label: 'Salt',      value: analysis.nutrients.salt,         unit: 'g/100g' },
  ].filter(item => item.value !== null && item.value !== undefined)

  return (
    <div className="flex flex-col gap-4 pb-8">
      {lightboxOpen && imageUrl && (
        <ImageLightbox
          src={imageUrl}
          alt={product.product_name || 'Food product image'}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium">
          ← Scan another
        </button>
        <button
          onClick={handleGroceryToggle}
          aria-label={inGroceryList ? 'Remove from grocery list' : 'Add to grocery list'}
          title={inGroceryList ? 'Remove from grocery list' : 'Add to grocery list'}
          className={`text-xl transition ${
            inGroceryList ? 'text-emerald-400 hover:text-red-400' : 'text-slate-500 hover:text-emerald-400'
          }`}
        >
          {inGroceryList ? '🛒✓' : '🛒'}
        </button>
      </div>

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
              <NovaBadge group={analysis.novaGroup} />
            )}
            <EcoScoreBadge grade={product.ecoscore_grade} />
          </div>
        </div>
      </div>

      <NutritionGauge
        score={analysis.healthScore}
        protein={analysis.nutrients.protein}
        scoreReasons={analysis.scoreReasons}
        dataQuality={analysis.dataQuality}
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

      {/* ── Seed oils ───────────────────────────────────────────────── */}
      {analysis.seedOilFlag && (
        <div className="card p-4 border border-yellow-500/20 bg-yellow-500/5">
          <p className="text-sm font-semibold text-white mb-1">{analysis.seedOilFlag.label}</p>
          <p className="text-xs text-slate-400">{analysis.seedOilFlag.detail}</p>
          {analysis.seedOilFlag.detected && analysis.seedOilFlag.detected.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {analysis.seedOilFlag.detected.map((oil, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/25">{oil}</span>
              ))}
            </div>
          )}
          <SourceLinks sources={analysis.seedOilFlag.sources} />
        </div>
      )}

      {/* ── Pesticide risk ──────────────────────────────────────────── */}
      {analysis.pesticideFlag && (
        <div className="card p-4 border border-lime-500/20 bg-lime-500/5">
          <p className="text-sm font-semibold text-white mb-1">{analysis.pesticideFlag.label}</p>
          <p className="text-xs text-slate-400">{analysis.pesticideFlag.detail}</p>
          <SourceLinks sources={analysis.pesticideFlag.sources} />
        </div>
      )}

      {/* ── Heavy metals ────────────────────────────────────────────── */}
      {analysis.heavyMetalFlags && analysis.heavyMetalFlags.length > 0 && (
        <div className="card p-4">
          <p className="text-sm font-semibold text-white mb-2">⚗️ Heavy metal risk</p>
          <div className="flex flex-col gap-3">
            {analysis.heavyMetalFlags.map((item, i) => (
              <div key={i} className="rounded-xl p-3 border border-slate-600 bg-slate-800/50">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-slate-400 mt-1">{item.detail}</p>
                <SourceLinks sources={item.sources} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Packaging flags ─────────────────────────────────────────── */}
      <PackagingFlags packagingTags={product.packaging_tags || []} />

      {nutritionItems.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center mb-3">
            <p className="text-sm font-semibold text-white">Nutrition per 100g</p>
            {usdaEnriched && <UsdaTooltip />}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {nutritionItems.map(item => (
              <div key={item.label} className="bg-slate-800/60 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-lg font-bold text-white mt-1">{item.value}</p>
                <p className="text-xs text-slate-600">{item.unit}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-600 px-4">
        {usdaEnriched
          ? 'Data from Open Food Facts (ODbL) + USDA FoodData Central. Informational only — not medical or dietary advice.'
          : 'Data from Open Food Facts (ODbL). Informational only — not medical or dietary advice.'}
      </p>
    </div>
  )
}
