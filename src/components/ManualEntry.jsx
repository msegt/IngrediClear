import React, { useState, useRef } from 'react'
import { searchProductsByName }     from '../api/openBeautyFacts.js'
import { searchFoodProductsByName } from '../api/openFoodFacts.js'
import IngredientCapture            from './IngredientCapture.jsx'

export default function ManualEntry({ onSubmit, onIngredients, productType = 'cosmetics' }) {
  const [mode, setMode]               = useState('barcode')
  const [value, setValue]             = useState('')
  const [results, setResults]         = useState([])
  const [searching, setSearching]     = useState(false)
  const [searchError, setSearchError] = useState('')
  const resultsRef = useRef(null)

  const isFood = productType === 'food'
  const namePlaceholder = isFood ? 'e.g. Nutella, Greek yogurt, oat milk' : 'e.g. Nivea Sun Cream SPF50'
  const nameHint = isFood
    ? 'Search by food name, brand, or type.'
    : 'Search by product name, brand, or type.'

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
        const products = isFood
          ? await searchFoodProductsByName(trimmed)
          : await searchProductsByName(trimmed)
        setResults(products)
        // Move focus to results region so screen readers announce the new content
        setTimeout(() => resultsRef.current?.focus(), 100)
      } catch (err) {
        setSearchError(err.message)
      } finally {
        setSearching(false)
      }
    }
  }

  const handleSelectResult = (product) => onSubmit(product.code || product.id)

  const modes = [
    { id: 'barcode',      label: 'Barcode',      emoji: null },
    { id: 'name',         label: 'Search',       emoji: null },
    ...(!isFood ? [{ id: 'ingredients', label: 'Paste / Photo', emoji: '📋' }] : [])
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* Mode toggle */}
      <div
        role="group"
        aria-label="Entry method"
        className="flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800"
      >
        {modes.map(m => (
          <button
            key={m.id}
            aria-pressed={mode === m.id}
            onClick={() => { setMode(m.id); setValue(''); setResults([]); setSearchError('') }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95 ${
              mode === m.id
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.emoji && <span aria-hidden="true">{m.emoji} </span>}{m.label}
          </button>
        ))}
      </div>

      {/* Barcode input */}
      {mode === 'barcode' && (
        <div className="card p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            <label htmlFor="barcode-input" className="text-sm text-slate-400">
              Type the number printed beneath the barcode stripes.
            </label>
            <input
              id="barcode-input"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={isFood ? 'e.g. 3017620422003' : 'e.g. 3600523462452'}
              aria-label="Barcode number"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/50 transition text-lg tracking-widest"
            />
            <button
              type="submit"
              disabled={value.trim().length < 6}
              aria-disabled={value.trim().length < 6}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check product
            </button>
          </form>
        </div>
      )}

      {/* Name search */}
      {mode === 'name' && (
        <div className="card p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            <label htmlFor="name-input" className="text-sm text-slate-400">
              {nameHint}
            </label>
            <input
              id="name-input"
              type="search"
              value={value}
              onChange={e => { setValue(e.target.value); setResults([]); setSearchError('') }}
              placeholder={namePlaceholder}
              aria-label="Product name"
              autoComplete="off"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/50 transition"
            />
            <button
              type="submit"
              disabled={value.trim().length < 2 || searching}
              aria-disabled={value.trim().length < 2 || searching}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {searching
                ? <><span aria-hidden="true" className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Searching…</span></>
                : 'Search products'}
            </button>
          </form>
        </div>
      )}

      {/* Paste / Photo */}
      {mode === 'ingredients' && (
        <IngredientCapture onAnalyse={onIngredients} />
      )}

      {/* Search error */}
      {searchError && (
        <div role="alert" className="card p-4 border border-red-500/30 bg-red-500/10">
          <p className="text-sm text-red-400">{searchError}</p>
        </div>
      )}

      {/* Search results */}
      {results.length > 0 && (
        <section
          ref={resultsRef}
          tabIndex={-1}
          aria-label={`Search results: ${results.length} product${results.length !== 1 ? 's' : ''} found`}
          className="card focus:outline-none"
        >
          <p className="text-xs font-semibold text-slate-400 px-4 pt-4 pb-2">
            {results.length} result{results.length !== 1 ? 's' : ''} — tap a product to check its ingredients
          </p>
          <ul className="flex flex-col pb-2">
            {results.map((product, i) => (
              <li key={product.code || i}>
                <button
                  onClick={() => handleSelectResult(product)}
                  aria-label={`Check ${product.product_name || 'Unknown product'}${product.brands ? ' by ' + product.brands : ''}`}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 active:bg-slate-700 transition text-left border-t border-slate-800 first:border-0 min-h-[64px]"
                >
                  {(product.image_front_url || product.image_url)
                    ? <img src={product.image_front_url || product.image_url} alt="" aria-hidden="true" className="w-12 h-12 rounded-lg object-contain bg-slate-800 flex-shrink-0" />
                    : <div aria-hidden="true" className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                        {isFood ? '🍽️' : '🧴'}
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{product.product_name}</p>
                    {product.brands && <p className="text-xs text-slate-400 truncate">{product.brands}</p>}
                    {product.categories && <p className="text-xs text-slate-500 truncate">{product.categories.split(',')[0]}</p>}
                  </div>
                  <span aria-hidden="true" className="text-slate-500 flex-shrink-0 text-lg">›</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
