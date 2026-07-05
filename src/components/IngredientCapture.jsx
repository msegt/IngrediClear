/**
 * IngredientCapture — lets users analyse ingredients without a barcode.
 *
 * Two modes:
 *  • Paste  — textarea → instant client-side analysis
 *  • Photo  — camera/gallery photo → Tesseract.js OCR (loaded lazily from CDN)
 *            → extracted text shown for review → analysis
 */
import React, { useState, useRef } from 'react'

const OCR_WORKER_URL = 'https://unpkg.com/tesseract.js@5/dist/worker.min.js'
const OCR_CORE_URL   = 'https://unpkg.com/tesseract.js-core@5/tesseract-core-simd-lstm.wasm.js'

export default function IngredientCapture({ onAnalyse }) {
  const [tab, setTab]             = useState('paste')   // 'paste' | 'photo'
  const [pasteText, setPasteText] = useState('')
  const [ocrText, setOcrText]     = useState('')
  const [ocrStatus, setOcrStatus] = useState(null)      // null | 'loading' | 'done' | 'error'
  const [ocrError, setOcrError]   = useState('')
  const [ocrProgress, setOcrProgress] = useState(0)
  const [previewUrl, setPreviewUrl]   = useState(null)
  const fileRef = useRef(null)

  // ── Paste tab ─────────────────────────────────────────────────────────────
  const handlePasteSubmit = (e) => {
    e.preventDefault()
    const text = pasteText.trim()
    if (text.length < 5) return
    onAnalyse(text)
  }

  // ── Photo tab ─────────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setOcrText('')
    setOcrError('')
    setOcrProgress(0)
    setOcrStatus('loading')

    try {
      // Lazy-load Tesseract.js from unpkg — only downloaded once, then cached by the browser
      const { createWorker } = await import(
        /* @vite-ignore */
        'https://unpkg.com/tesseract.js@5/dist/tesseract.esm.min.js'
      )

      const worker = await createWorker('eng', 1, {
        workerPath:  OCR_WORKER_URL,
        corePath:    OCR_CORE_URL,
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100))
          }
        }
      })

      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      // Post-process: strip very short tokens, keep ingredient-like lines
      const cleaned = text
        .replace(/\r\n/g, '\n')
        .replace(/[^a-zA-Z0-9\s,;.()/\-+%\u00C0-\u024F]/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim()

      setOcrText(cleaned)
      setOcrStatus('done')
    } catch (err) {
      console.error('OCR error:', err)
      setOcrError('OCR failed — check your internet connection and try again, or switch to Paste mode.')
      setOcrStatus('error')
    }
  }

  const handleOcrSubmit = (e) => {
    e.preventDefault()
    const text = ocrText.trim()
    if (text.length < 5) return
    onAnalyse(text)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Mode toggle */}
      <div
        role="group"
        aria-label="Ingredient capture method"
        className="flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800"
      >
        {[
          { id: 'paste', label: '📋 Paste text' },
          { id: 'photo', label: '📷 Scan photo' },
        ].map(m => (
          <button
            key={m.id}
            aria-pressed={tab === m.id}
            onClick={() => { setTab(m.id); setOcrText(''); setOcrStatus(null); setPreviewUrl(null) }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95 ${
              tab === m.id
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Paste tab ──────────────────────────────────────────────────── */}
      {tab === 'paste' && (
        <div className="card p-5">
          <form onSubmit={handlePasteSubmit} className="flex flex-col gap-3" noValidate>
            <label htmlFor="ingredient-paste" className="text-sm text-slate-400">
              Copy the ingredient list from the packaging or product page and paste it below.
            </label>
            <textarea
              id="ingredient-paste"
              rows={6}
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
              placeholder="e.g. Aqua, Glycerin, Niacinamide, Sodium Hyaluronate, Phenoxyethanol…"
              aria-label="Paste ingredients"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/50 transition text-sm resize-none leading-relaxed"
            />
            <button
              type="submit"
              disabled={pasteText.trim().length < 5}
              aria-disabled={pasteText.trim().length < 5}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Analyse ingredients
            </button>
          </form>
        </div>
      )}

      {/* ── Photo tab ──────────────────────────────────────────────────── */}
      {tab === 'photo' && (
        <div className="flex flex-col gap-3">
          <div className="card p-5 flex flex-col gap-3">
            <p className="text-sm text-slate-400">
              Take a photo of the ingredient list on the packaging. Good lighting and a steady hand help accuracy.
            </p>

            {/* Hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              aria-label="Choose or take a photo"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={ocrStatus === 'loading'}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {ocrStatus === 'loading'
                ? <><span aria-hidden="true" className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Reading text…</span></>
                : <><span aria-hidden="true">📷</span><span>{previewUrl ? 'Choose a different photo' : 'Open camera / gallery'}</span></>}
            </button>

            {/* Image preview */}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Selected ingredient label"
                className="w-full rounded-xl object-contain max-h-48 bg-slate-800"
              />
            )}

            {/* OCR progress bar */}
            {ocrStatus === 'loading' && (
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Recognising text…</span>
                  <span>{ocrProgress}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">Loading OCR engine on first use (~3 MB) — subsequent scans are instant.</p>
              </div>
            )}

            {/* OCR error */}
            {ocrStatus === 'error' && (
              <div role="alert" className="card p-3 border border-red-500/30 bg-red-500/10">
                <p className="text-xs text-red-400">{ocrError}</p>
              </div>
            )}
          </div>

          {/* OCR result — editable before submitting */}
          {ocrStatus === 'done' && (
            <div className="card p-5">
              <form onSubmit={handleOcrSubmit} className="flex flex-col gap-3" noValidate>
                <label htmlFor="ocr-result" className="text-sm text-slate-400">
                  Review and correct the extracted text before analysing.
                </label>
                <textarea
                  id="ocr-result"
                  rows={7}
                  value={ocrText}
                  onChange={e => setOcrText(e.target.value)}
                  aria-label="Extracted ingredient text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/50 transition text-sm resize-none leading-relaxed"
                />
                <button
                  type="submit"
                  disabled={ocrText.trim().length < 5}
                  aria-disabled={ocrText.trim().length < 5}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Analyse ingredients
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-slate-600 text-center px-4">
        Analysis runs entirely on your device — no text is ever uploaded.
      </p>
    </div>
  )
}
