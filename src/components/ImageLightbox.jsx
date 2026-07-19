import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function ImageLightbox({ src, alt, onClose }) {
  const dialogRef   = useRef(null)
  const closeBtnRef = useRef(null)
  // Remember what had focus before the lightbox opened so we can restore it
  const previousFocusRef = useRef(null)

  useEffect(() => {
    previousFocusRef.current = document.activeElement

    // Move focus into the dialog on mount
    closeBtnRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // Focus trap — keep Tab / Shift+Tab inside the dialog
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.closest('[aria-hidden="true"]'))
        if (!focusable.length) { e.preventDefault(); return }
        const first = focusable[0]
        const last  = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }
    }

    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      // Restore focus to whatever triggered the lightbox
      previousFocusRef.current?.focus()
    }
  }, [onClose])

  const descId = 'lightbox-desc'

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Full-size image: ${alt}`}
      aria-describedby={descId}
      className="fixed inset-0 z-[200] flex flex-col animate-fade-in"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/92 backdrop-blur-lg"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <div className="relative z-10 flex justify-end px-4 pt-3 pb-2">
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close image"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white text-2xl leading-none active:scale-90 transition"
        >
          &times;
        </button>
      </div>

      {/* Image */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 gap-3 min-h-0">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-2xl"
          style={{ maxHeight: 'calc(100vh - 140px)' }}
        />
        {alt && (
          <p id={descId} className="text-sm text-white/60 text-center leading-snug px-2">{alt}</p>
        )}
        <p className="text-xs text-white/30">Tap outside or press Escape to close</p>
      </div>
    </div>,
    document.body
  )
}
