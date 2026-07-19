import React, { useState, useEffect } from 'react'
import {
  getGroceryList,
  removeFromGroceryList,
  clearGroceryList,
} from '../data/groceryList.js'

const NOVA_COLORS = {
  1: '#1d8348',
  2: '#58b55e',
  3: '#f07e18',
  4: '#d63a2f',
}

const NUTRISCORE_COLORS = {
  A: '#1a9c3e',
  B: '#56a82e',
  C: '#d4b800',
  D: '#e07b18',
  E: '#c0392b',
}

function avgNova(list) {
  const withNova = list.filter(i => i.novaGroup)
  if (!withNova.length) return null
  return (withNova.reduce((s, i) => s + Number(i.novaGroup), 0) / withNova.length).toFixed(1)
}

function processingLabel(avg) {
  if (avg === null) return null
  if (avg <= 1.5) return { text: 'Mostly unprocessed', color: '#1d8348' }
  if (avg <= 2.5) return { text: 'Lightly processed', color: '#58b55e' }
  if (avg <= 3.2) return { text: 'Moderately processed', color: '#f07e18' }
  return { text: 'Highly processed', color: '#d63a2f' }
}

export default function GroceryList({ onScanBarcode }) {
  const [list, setList] = useState(getGroceryList)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => { setList(getGroceryList()) }, [])

  const handleRemove = barcode => {
    setList(removeFromGroceryList(barcode))
  }

  const handleClear = () => {
    setList(clearGroceryList())
    setConfirmClear(false)
  }

  const avg = avgNova(list)
  const label = processingLabel(avg ? parseFloat(avg) : null)

  if (!list.length) {
    return (
      <div className="card p-8 flex flex-col items-center text-center gap-3" role="status">
        <span aria-hidden="true" className="text-4xl">🛒</span>
        <p className="font-semibold text-white">Your grocery list is empty</p>
        <p className="text-sm text-slate-400">
          Tap the <span aria-hidden="true">🛒</span><span className="sr-only">shopping cart</span> button on any scanned food product to save it here.
        </p>
      </div>
    )
  }

  return (
    <section aria-label="Grocery list" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white"><span aria-hidden="true">🛒 </span>Grocery list</h2>
        {confirmClear ? (
          <div className="flex items-center gap-2" role="group" aria-label="Confirm clear grocery list">
            <span className="text-xs text-slate-400">Clear all?</span>
            <button
              onClick={handleClear}
              className="text-xs text-red-400 hover:text-red-300 transition font-semibold py-1 px-2 rounded-lg"
              aria-label="Yes, clear grocery list"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="text-xs text-slate-400 hover:text-white transition py-1 px-2 rounded-lg"
              aria-label="Cancel, keep grocery list"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            aria-label="Clear all items from grocery list"
            className="text-xs text-slate-500 hover:text-red-400 transition py-1 px-2 rounded-lg"
          >
            Clear all
          </button>
        )}
      </div>

      {avg && label && (
        <div
          className="rounded-xl p-3 border text-center"
          role="note"
          aria-label={`Average processing level: NOVA ${avg}, ${label.text}`}
          style={{ borderColor: label.color + '55', backgroundColor: label.color + '18' }}
        >
          <p className="text-xs text-slate-400" aria-hidden="true">Average processing level</p>
          <p className="text-lg font-bold mt-0.5" style={{ color: label.color }} aria-hidden="true">
            NOVA {avg} — {label.text}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Based on {list.filter(i => i.novaGroup).length} of {list.length} items with NOVA data.
          </p>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {list.map((item, i) => (
          <li key={item.barcode || i}>
            <div className="card w-full p-3 flex items-center gap-3 min-h-[64px]">
              {item.image
                ? <img src={item.image} alt="" aria-hidden="true" className="w-12 h-12 rounded-lg object-contain bg-slate-800 flex-shrink-0" />
                : <div aria-hidden="true" className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">🍽️</div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.name || 'Unknown product'}</p>
                {item.brand && <p className="text-xs text-slate-400 truncate">{item.brand}</p>}
                <div className="flex gap-2 mt-1 flex-wrap">
                  {item.nutriscore && (
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      aria-label={`Nutri-Score ${item.nutriscore.toUpperCase()}`}
                      style={{ backgroundColor: NUTRISCORE_COLORS[item.nutriscore.toUpperCase()] || '#555', color: '#fff' }}
                    >
                      <span aria-hidden="true">NS {item.nutriscore.toUpperCase()}</span>
                    </span>
                  )}
                  {item.novaGroup && (
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      aria-label={`NOVA group ${item.novaGroup}`}
                      style={{ backgroundColor: NOVA_COLORS[item.novaGroup] || '#555', color: '#fff' }}
                    >
                      <span aria-hidden="true">NOVA {item.novaGroup}</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                {onScanBarcode && item.barcode && (
                  <button
                    onClick={() => onScanBarcode(item.barcode)}
                    className="text-xs text-brand-400 hover:text-brand-300 transition"
                    aria-label={`Re-scan ${item.name || 'this product'}`}
                  >
                    Scan
                  </button>
                )}
                <button
                  onClick={() => handleRemove(item.barcode)}
                  className="text-xs text-slate-500 hover:text-red-400 transition"
                  aria-label={`Remove ${item.name || 'this product'} from grocery list`}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
