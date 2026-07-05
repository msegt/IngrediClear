import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function ImageLightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Full-size image of ${alt}`}
      className="fixed inset-0 z-[200] flex flex-col animate-fade-in"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Backdrop — tap to close */}
      <div
        className="absolute inset-0 bg-black/92 backdrop-blur-lg"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button — sits in normal flow at the top, no absolute stacking */}
      <div className="relative z-10 flex justify-end px-4 pt-3 pb-2">
        <button
          onClick={onClose}
          aria-label="Close image"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white text-2xl leading-none active:scale-90 transition"
        >
          &times;
        </button>
      </div>

      {/* Image — fills remaining space */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 gap-3 min-h-0">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-2xl"
          style={{ maxHeight: 'calc(100vh - 140px)' }}
        />
        {alt && (
          <p className="text-sm text-white/60 text-center leading-snug px-2">{alt}</p>
        )}
        <p className="text-xs text-white/30">Tap outside the image to close</p>
      </div>
    </div>,
    document.body
  )
}
