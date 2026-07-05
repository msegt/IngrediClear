import React, { useEffect } from 'react'

export default function ImageLightbox({ src, alt, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Full-size image of ${alt}`}
      className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close image"
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition active:scale-90 text-xl"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
      >
        ✕
      </button>

      {/* Image */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 max-w-sm w-full">
        <img
          src={src}
          alt={alt}
          className="w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl shadow-black/60 bg-slate-900"
        />
        {alt && (
          <p className="text-sm text-slate-400 text-center px-2">{alt}</p>
        )}
        <p className="text-xs text-slate-600">Tap outside or press Esc to close</p>
      </div>
    </div>
  )
}
