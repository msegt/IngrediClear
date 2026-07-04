import React from 'react'
import { clearHistory } from '../data/history.js'

export default function ScanHistory({ history, onSelect }) {
  const [items, setItems] = React.useState(history)

  const handleClear = () => {
    setItems(clearHistory())
  }

  if (!items.length) {
    return (
      <div className="card p-8 flex flex-col items-center text-center gap-3">
        <span className="text-4xl">🕒</span>
        <p className="font-semibold text-white">No scan history yet</p>
        <p className="text-sm text-slate-400">Products you scan will appear here for quick re-access.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Recent Scans</h2>
        <button onClick={handleClear} className="text-xs text-slate-500 hover:text-red-400 transition">Clear all</button>
      </div>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => onSelect(item.barcode)}
          className="card p-3 flex items-center gap-3 hover:bg-slate-800 transition text-left w-full"
        >
          {item.image
            ? <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-contain bg-slate-800 flex-shrink-0" />
            : <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">🧴</div>
          }
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{item.name || 'Unknown Product'}</p>
            <p className="text-xs text-slate-400 truncate">{item.brand || ''}</p>
            <p className="text-xs text-slate-600 mt-0.5">{new Date(item.scannedAt).toLocaleDateString()}</p>
          </div>
          <span className="text-slate-600 text-sm">→</span>
        </button>
      ))}
    </div>
  )
}
