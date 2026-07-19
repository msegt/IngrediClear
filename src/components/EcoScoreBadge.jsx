import React, { useState, useRef, useEffect } from 'react'

const ECO_CONFIG = {
  a: { bg: '#1a9c3e', text: '#fff', label: 'A', detail: 'Very low environmental impact. High sustainability score.' },
  b: { bg: '#56a82e', text: '#fff', label: 'B', detail: 'Low environmental impact. Good sustainability score.' },
  c: { bg: '#d4b800', text: '#fff', label: 'C', detail: 'Moderate environmental impact.' },
  d: { bg: '#e07b18', text: '#fff', label: 'D', detail: 'High environmental impact.' },
  e: { bg: '#c0392b', text: '#fff', label: 'E', detail: 'Very high environmental impact.' },
  'not-applicable': null,
  unknown: null,
}

export default function EcoScoreBadge({ grade }) {
  const [open, setOpen] = useState(false)
  const dialogRef  = useRef(null)
  const triggerRef = useRef(null)
  const key = (grade || '').toLowerCase()
  const config = ECO_CONFIG[key]
  if (!config) return null

  const dialogId = 'eco-score-dialog'

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target) &&
          triggerRef.current && !triggerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Keyboard: Escape closes; Tab trap inside dialog
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus() }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll('a[href], button:not([disabled])')
        )
        if (!focusable.length) return
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus() }
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-slate-400 font-medium">Eco-Score</p>
      <span className="relative inline-flex">
        <button
          ref={triggerRef}
          type="button"
          aria-label={`Eco-Score ${config.label} — tap for explanation`}
          aria-expanded={open}
          aria-controls={dialogId}
          onClick={() => setOpen(o => !o)}
          style={{ backgroundColor: config.bg, color: config.text }}
          className="text-sm font-black px-3 py-1.5 rounded-lg transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        >
          {config.label} <span aria-hidden="true">🌍</span>
        </button>
        {open && (
          <div
            ref={dialogRef}
            id={dialogId}
            role="dialog"
            aria-modal="false"
            aria-label={`Eco-Score ${config.label} explanation`}
            className="absolute top-full left-0 mt-2 w-[min(260px,calc(100vw-24px))] rounded-xl bg-slate-800 border border-slate-700 shadow-xl px-3 py-2.5 text-xs text-slate-300 leading-relaxed z-50"
          >
            <p className="font-semibold text-white mb-1">Eco-Score {config.label}</p>
            <p className="mb-2">{config.detail}</p>
            <p className="text-slate-400">
              The Eco-Score considers the environmental impact of agricultural production,
              packaging, transportation, and end-of-life. Data from{' '}
              <a
                href="https://world.openfoodfacts.org/eco-score"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 underline underline-offset-2"
              >
                Open Food Facts
                <span className="sr-only"> (opens in new tab)</span>
              </a>.
            </p>
            <button
              onClick={() => { setOpen(false); triggerRef.current?.focus() }}
              className="mt-2 text-xs text-slate-500 hover:text-white transition"
              aria-label="Close Eco-Score explanation"
            >
              Close
            </button>
          </div>
        )}
      </span>
    </div>
  )
}
