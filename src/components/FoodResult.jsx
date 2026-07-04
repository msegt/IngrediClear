import React from 'react'
import { analyseFoodProduct } from '../data/foodChecker.js'
import NutritionGauge from './NutritionGauge.jsx'

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

export default function FoodResult({ product, onBack }) {
  const analysis = analyseFoodProduct(product)
  const imageUrl = product.image_front_url || product.image_url

  return (
    <div className="flex flex-col gap-4 pb-8">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium">
        ← Scan another
      </button>

      <div className="card p-4 flex gap-4 items-start">
        {imageUrl && (
          <img src={imageUrl} alt={product.product_name}
            className="w-20 h-20 object-contain rounded-xl bg-slate-800 flex-shrink-0"
            onError={e => e.target.style.display = 'none'}
          />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-white text-lg leading-tight">{product.product_name || 'Unknown food item'}</h2>
          {product.brands && <p className="text-sm text-slate-400 mt-0.5">{product.brands}</p>}
          {product.categories && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.categories}</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {analysis.nutriscore && (
              <span className="text-xs px-2 py-1 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">Nutri-Score {analysis.nutriscore}</span>
            )}
            {analysis.novaGroup && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">NOVA {analysis.novaGroup}</span>
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

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Sugar',    value: analysis.nutrients.sugar,        unit: 'g/100g' },
          { label: 'Salt',     value: analysis.nutrients.salt,         unit: 'g/100g' },
          { label: 'Sat. fat', value: analysis.nutrients.saturatedFat, unit: 'g/100g' },
          { label: 'Fibre',    value: analysis.nutrients.fiber,        unit: 'g/100g' }
        ].map(item => (
          <div key={item.label} className="card p-3 text-center">
            <p className="text-xs text-slate-400">{item.label}</p>
            <p className="text-lg font-bold text-white mt-1">{item.value ?? '–'}</p>
            <p className="text-xs text-slate-600">{item.unit}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-600 px-4">
        Data from Open Food Facts (ODbL). Informational only — not medical or dietary advice.
      </p>
    </div>
  )
}
