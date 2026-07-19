import React, { useState } from 'react'
import { clearHistory } from '../data/history.js'

export default function ScanHistory({ history, onSelect, productType = 'cosmetics' }) {
  const [items, setItems] = useState(history)
  const [confirmClear, setConfirmClear] = useState(false)

  React.useEffect(() => { setItems(history) }, [history])

  const handleClear = () => {
    setItems(clearHistory())
    setConfirmClear(false)
  }

  const fallbackIcon = productType === 'food' ? '🍽️' : '🧴'
  const emptyLabel   = productType === 'food' ? 'food products' : 'cosmetics'

  if (!items.length) {
    return (
      <div className="card p-8 flex flex-col items-center text-center gap-3" role="status">
        <span aria-hidden="true" className="text-4xl">🕒</span>
        <p className="font-semibold text-white">No history yet</p>
        <p className="text-sm text-slate-400">
          {emptyLabel.charAt(0).toUpperCase() + emptyLabel.slice(1)} you scan will appear here for quick re-access.
        </p>
      </div>
    )
  }

  return (
    <section aria-label="Scan history" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Recent scans</h2>
        {confirmClear ? (
          <div className="flex items-center gap-2" role="group" aria-label="Confirm clear history">
            <span className="text-xs text-slate-400">Clear all?</span>
            <button
              onClick={handleClear}
              className="text-xs text-red-400 hover:text-red-300 transition font-semibold py-1 px-2 rounded-lg"
              aria-label="Yes, clear all scan history"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="text-xs text-slate-400 hover:text-white transition py-1 px-2 rounded-lg"
              aria-label="Cancel, keep scan history"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            aria-label="Clear all scan history"
            className="text-xs text-slate-500 hover:text-red-400 transition py-1 px-2 rounded-lg"
          >
            Clear all
          </button>
        )}
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i}>
            <button
              onClick={() => onSelect(item.barcode)}
              aria-label={`Re-check ${item.name || 'Unknown product'}${item.brand ? ', ' + item.brand : ''}`}
              className="card w-full p-3 flex items-center gap-3 hover:bg-slate-800 active:bg-slate-700 transition text-left min-h-[64px]"
            >
              {item.image
                ? <img src={item.image} alt="" aria-hidden="true" className="w-12 h-12 rounded-lg object-contain bg-slate-800 flex-shrink-0" />
                : <div aria-hidden="true" className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">{fallbackIcon}</div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.name || 'Unknown Product'}</p>
                {item.brand && <p className="text-xs text-slate-400 truncate">{item.brand}</p>}
                <p className="text-xs text-slate-600 mt-0.5">
                  <time dateTime={item.scannedAt}>{new Date(item.scannedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                </p>
              </div>
              <span aria-hidden="true" className="text-slate-500 text-lg flex-shrink-0">›</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
