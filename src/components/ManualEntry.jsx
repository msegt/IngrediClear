import React, { useState } from 'react'
import { searchProductsByName } from '../api/openBeautyFacts.js'

const DEMO_PRODUCTS = [
  { name: 'Dove Intensive Cream',   code: '8712561614133' },
  { name: 'Nivea Soft Moisturising', code: '4005808224067' },
  { name: "L'Oréal Elvive Shampoo", code: '3600522851264' }
]

export default function ManualEntry({ onSubmit }) {
  const [mode, setMode]           = useState('barcode') // 'barcode' | 'name'
  const [value, setValue]         = useState('')
  const [results, setResults]     = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const isBarcode = (v) => /^[0-9]{6,}$/.test(v.trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return

    if (mode === 'barcode') {
      onSubmit(trimmed)
    } else {
      setSearching(true)
      setSearchError('')
      setResults([])
      try {
        const products = await searchProductsByName(trimmed)
        setResults(products)
      } catch (err) {
        setSearchError(err.message)
      } finally {
        setSearching(false)
      }
    }
  }

  const handleSelectResult = (product) => {
    // Use barcode (code) if available, otherwise fall back to id
    onSubmit(product.code || product.id)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
        {[{ id: 'barcode', label: '📶 Barcode number' }, { id: 'name', label: '🔍 Product name' }].map(m => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setValue(''); setResults([]); setSearchError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              mode === m.id
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Input card */}
      <div className="card p-5">
        {mode === 'barcode' ? (
          <>
            <p className="text-sm text-slate-400 mb-3">Type the number printed beneath the barcode stripes.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                inputMode="numeric"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="e.g. 3600523462452"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition text-lg tracking-widest"
              />
              <button
                type="submit"
                disabled={value.trim().length < 6}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check Ingredients →
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-3">Search by product name, brand, or type (e.g. “nivea sun cream”).</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="search"
                value={value}
                onChange={e => { setValue(e.target.value); setResults([]); setSearchError('') }}
                placeholder="e.g. Nivea Sun Cream SPF50"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={value.trim().length < 2 || searching}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {searching
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Searching…</>
                  : 'Search →'}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Search error */}
      {searchError && (
        <div className="card p-4 border border-red-500/30 bg-red-500/10">
          <p className="text-sm text-red-400">{searchError}</p>
        </div>
      )}

      {/* Search results */}
      {results.length > 0 && (
        <div className="card">
          <p className="text-xs font-semibold text-slate-400 px-4 pt-4 pb-2">{results.length} result{results.length !== 1 ? 's' : ''} found — tap to check ingredients</p>
          <div className="flex flex-col pb-2">
            {results.map((product, i) => (
              <button
                key={product.code || i}
                onClick={() => handleSelectResult(product)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition text-left border-t border-slate-800 first:border-0"
              >
                {(product.image_front_url || product.image_url)
                  ? <img src={product.image_front_url || product.image_url} alt="" className="w-12 h-12 rounded-lg object-contain bg-slate-800 flex-shrink-0" />
                  : <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">🧴</div>
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.product_name}</p>
                  {product.brands && <p className="text-xs text-slate-400 truncate">{product.brands}</p>}
                  {product.categories && <p className="text-xs text-slate-600 truncate">{product.categories.split(',')[0]}</p>}
                </div>
                <span className="text-slate-600 flex-shrink-0">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Demo products — only show in barcode mode when no results */}
      {mode === 'barcode' && results.length === 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">🧪 Try a demo product</h3>
          <div className="flex flex-col gap-2">
            {DEMO_PRODUCTS.map(item => (
              <button
                key={item.code}
                onClick={() => { setValue(item.code); onSubmit(item.code) }}
                className="flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-left"
              >
                <span className="text-sm text-slate-200">{item.name}</span>
                <span className="text-xs text-slate-500 font-mono">{item.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
