import React, { useState } from 'react'

export default function ManualEntry({ onSubmit }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed.length >= 6) onSubmit(trimmed)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="card p-5">
        <h2 className="font-semibold text-white mb-1">Enter Barcode Manually</h2>
        <p className="text-sm text-slate-400 mb-4">
          Type the barcode number printed below the barcode stripes on your product.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
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
      </div>

      {/* Example barcodes for demo */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">🧪 Try a demo product</h3>
        <div className="flex flex-col gap-2">
          {[
            { name: 'Dove Intensive Cream', code: '8712561614133' },
            { name: "Nivea Soft Moisturising", code: '4005808224067' },
            { name: "L'Oréal Elvive Shampoo", code: '3600522851264' }
          ].map(item => (
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
    </div>
  )
}
