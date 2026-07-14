import React, { useState } from 'react'

const ECO_CONFIG = {
  a: { bg: '#1a9c3e', text: '#fff', label: 'A', detail: 'Very low environmental impact. High sustainability score.' },
  b: { bg: '#56a82e', text: '#fff', label: 'B', detail: 'Low environmental impact. Good sustainability score.' },
  c: { bg: '#d4b800', text: '#fff', label: 'C', detail: 'Moderate environmental impact.' },
  d: { bg: '#e07b18', text: '#fff', label: 'D', detail: 'High environmental impact.' },
  e: { bg: '#c0392b', text: '#fff', label: 'E', detail: 'Very high environmental impact.' },
  'not-applicable': null,
  unknown: null,
}

/**
 * Displays the Eco-Score grade from Open Food Facts.
 * @param {string} grade  ecoscore_grade from OFF product (a–e, unknown, not-applicable)
 */
export default function EcoScoreBadge({ grade }) {
  const [open, setOpen] = useState(false)
  const key = (grade || '').toLowerCase()
  const config = ECO_CONFIG[key]
  if (!config) return null

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-slate-400 font-medium">Eco-Score</p>
      <span className="relative inline-flex">
        <button
          type="button"
          aria-label={`Eco-Score ${config.label} — tap for explanation`}
          onClick={() => setOpen(o => !o)}
          onBlur={() => setOpen(false)}
          style={{ backgroundColor: config.bg, color: config.text }}
          className="text-sm font-black px-3 py-1.5 rounded-lg transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        >
          {config.label} 🌍
        </button>
        {open && (
          <span
            role="tooltip"
            className="absolute top-full left-0 mt-2 w-[min(260px,calc(100vw-24px))] rounded-xl bg-slate-800 border border-slate-700 shadow-xl px-3 py-2.5 text-xs text-slate-300 leading-relaxed z-50"
          >
            <span className="block font-semibold text-white mb-1">Eco-Score {config.label}</span>
            <span className="block mb-2">{config.detail}</span>
            <span className="block text-slate-400">
              The Eco-Score considers the environmental impact of agricultural production,
              packaging, transportation, and end-of-life. Data from{' '}
              <a
                href="https://world.openfoodfacts.org/eco-score"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 underline underline-offset-2"
              >
                Open Food Facts
              </a>.
            </span>
          </span>
        )}
      </span>
    </div>
  )
}
