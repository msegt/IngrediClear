/**
 * IngredientCapture — lets users analyse ingredients without a barcode.
 *
 * Two modes:
 *  • Paste  — textarea → instant client-side analysis
 *  • Photo  — camera/gallery → Tesseract.js OCR (bundled via npm, not CDN)
 *            → extracted text shown for review → analysis
 */
import React, { useState, useRef } from 'react'

export default function IngredientCapture({ onAnalyse }) {
  const [tab, setTab]                 = useState('paste')
  const [pasteText, setPasteText]     = useState('')
  const [ocrText, setOcrText]         = useState('')
  const [ocrStatus, setOcrStatus]     = useState(null)
  const [ocrError, setOcrError]       = useState('')
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrStage, setOcrStage]       = useState('')
  const [previewUrl, setPreviewUrl]   = useState(null)
  const fileRef = useRef(null)

  const handlePasteSubmit = (e) => {
    e.preventDefault()
    const text = pasteText.trim()
    if (text.length < 5) return
    onAnalyse(text)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreviewUrl(URL.createObjectURL(file))
    setOcrText('')
    setOcrError('')
    setOcrProgress(0)
    setOcrStage('')
    setOcrStatus('loading')

    try {
      const { createWorker } = await import('tesseract.js')

      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'loading tesseract core')       setOcrStage('Loading OCR engine…')
          if (m.status === 'initializing tesseract')       setOcrStage('Initialising…')
          if (m.status === 'loading language traineddata') setOcrStage('Loading language data…')
          if (m.status === 'recognizing text') {
            setOcrStage('Recognising text…')
            setOcrProgress(Math.round(m.progress * 100))
          }
        }
      })

      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      const cleaned = text
        .replace(/\r\n/g, '\n')
        .replace(/[^a-zA-Z0-9\s,;.()\/\-+%\u00C0-\u024F]/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim()

      setOcrText(cleaned)
      setOcrStatus('done')
    } catch (err) {
      console.error('OCR error:', err)
      setOcrError('Could not read the image. Make sure the text is in focus and well-lit, then try again. If the problem persists, use Paste mode instead.')
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

      <div
        role="group"
        aria-label="Ingredient capture method"
        className="flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800"
      >
        {[
          { id: 'paste', label: 'Paste text', emoji: '\uD83D\uDCCB' },
          { id: 'photo', label: 'Scan photo', emoji: '\uD83D\uDCF7' },
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
            <span aria-hidden="true">{m.emoji} </span>{m.label}
          </button>
        ))}
      </div>

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

      {tab === 'photo' && (
        <div className="flex flex-col gap-3">
          <div className="card p-5 flex flex-col gap-3">
            <p className="text-sm text-slate-400">
              Take a photo of the ingredient list. Good lighting and a steady hand help accuracy.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              aria-label="Choose or take a photo of ingredient label"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={ocrStatus === 'loading'}
              aria-disabled={ocrStatus === 'loading'}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {ocrStatus === 'loading'
                ? <><span aria-hidden="true" className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Processing…</span></>
                : <><span aria-hidden="true">�\uDCF7</span><span>{previewUrl ? 'Choose a different photo' : 'Open camera / gallery'}</span></>}
            </button>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Selected ingredient label photo"
                className="w-full rounded-xl object-contain max-h-48 bg-slate-800"
              />
            )}

            {ocrStatus === 'loading' && (
              <div
                className="flex flex-col gap-1.5"
                role="status"
                aria-label={ocrStage ? `${ocrStage}${ocrProgress > 0 ? ` ${ocrProgress}%` : ''}` : 'Processing image…'}
              >
                <div className="flex justify-between text-xs text-slate-400" aria-hidden="true">
                  <span>{ocrStage || 'Preparing…'}</span>
                  <span>{ocrProgress > 0 ? `${ocrProgress}%` : ''}</span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={ocrProgress > 0 ? ocrProgress : undefined}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="OCR processing progress"
                  className="h-1.5 bg-slate-700 rounded-full overflow-hidden"
                >
                  <div
                    aria-hidden="true"
                    className="h-full bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: ocrProgress > 0 ? `${ocrProgress}%` : '100%', opacity: ocrProgress > 0 ? 1 : 0.4 }}
                  />
                </div>
                {ocrProgress === 0 && (
                  <p className="text-xs text-slate-500">First scan loads the OCR engine (~4 MB) — cached after that.</p>
                )}
              </div>
            )}

            {ocrStatus === 'error' && (
              <div role="alert" className="p-3 rounded-xl border border-red-500/30 bg-red-500/10">
                <p className="text-xs text-red-400">{ocrError}</p>
              </div>
            )}
          </div>

          {ocrStatus === 'done' && (
            <div className="card p-5">
              <form onSubmit={handleOcrSubmit} className="flex flex-col gap-3" noValidate>
                <label htmlFor="ocr-result" className="text-sm text-slate-400">
                  Review and correct the extracted text, then tap Analyse.
                </label>
                <textarea
                  id="ocr-result"
                  rows={7}
                  value={ocrText}
                  onChange={e => setOcrText(e.target.value)}
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
        Analysis runs entirely on your device — nothing is ever uploaded.
      </p>
    </div>
  )
}
