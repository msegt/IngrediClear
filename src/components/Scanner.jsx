import React, { useEffect, useRef, useState, useCallback } from 'react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/browser'

export default function Scanner({ onDetected, productType = 'cosmetics' }) {
  const videoRef    = useRef(null)
  const readerRef   = useRef(null)
  const controlsRef = useRef(null)
  const detectedRef = useRef(false)
  const [status, setStatus]     = useState('initializing')
  const [errorMsg, setErrorMsg] = useState('')

  const startScanner = useCallback(async () => {
    detectedRef.current = false
    try {
      readerRef.current = new BrowserMultiFormatReader()
      const devices = await BrowserMultiFormatReader.listVideoInputDevices()
      if (!devices.length) {
        setStatus('error')
        setErrorMsg('No camera found. Use the Enter tab to type a barcode.')
        return
      }
      const device = devices.find(d =>
        d.label.toLowerCase().includes('back') ||
        d.label.toLowerCase().includes('rear') ||
        d.label.toLowerCase().includes('environment')
      ) || devices[devices.length - 1]

      controlsRef.current = await readerRef.current.decodeFromVideoDevice(
        device.deviceId,
        videoRef.current,
        (result, err) => {
          if (result && !detectedRef.current) {
            detectedRef.current = true
            navigator.vibrate?.(50)
            onDetected(result.getText())
          }
        }
      )
      setStatus('active')
    } catch (err) {
      setStatus('error')
      setErrorMsg('Camera access was denied. Please allow camera permissions in your browser settings, or use the Enter tab instead.')
    }
  }, [onDetected])

  useEffect(() => {
    startScanner()
    return () => { controlsRef.current?.stop() }
  }, [startScanner])

  const hintText = productType === 'food'
    ? 'Point your camera at the barcode on the food packaging'
    : 'Point your camera at the barcode on the cosmetic product'

  // Derive a status message for the persistent live region
  const statusMsg =
    status === 'initializing' ? 'Starting camera…' :
    status === 'active'       ? 'Camera active — scanning for barcode' :
    status === 'error'        ? `Camera unavailable: ${errorMsg}` : ''

  return (
    <div className="flex flex-col gap-4">
      {/*
        Persistent live region that exists in the DOM at all times.
        Conditional overlays would mount/unmount and miss announcements.
      */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMsg}
      </div>

      <div
        aria-hidden="true"
        className="relative w-full aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 scanner-container"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          title="Barcode scanner camera feed"
          aria-hidden="true"
        />

        {status === 'active' && (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
              <div className="relative w-52 h-52">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-400 rounded-tl-md" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-400 rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-400 rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-400 rounded-br-md" />
                <div className="scan-line" />
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-slate-950/30"
              style={{
                maskImage: 'radial-gradient(ellipse 55% 45% at 50% 50%, transparent 60%, black 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 55% 45% at 50% 50%, transparent 60%, black 100%)'
              }}
            />
          </>
        )}

        {status === 'initializing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/80" aria-hidden="true">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Starting camera…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center" aria-hidden="true">
            <span className="text-4xl">📷</span>
            <p className="text-sm text-slate-300 font-medium">Camera unavailable</p>
            <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Static hint — not a live region since the text does not change */}
      <p className="text-center text-sm text-slate-400">{hintText}</p>
    </div>
  )
}
