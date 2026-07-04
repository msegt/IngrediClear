import React, { useEffect, useRef, useState, useCallback } from 'react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/browser'

export default function Scanner({ onDetected }) {
  const videoRef = useRef(null)
  const readerRef = useRef(null)
  const controlsRef = useRef(null)
  const [status, setStatus] = useState('initializing') // initializing | active | error
  const [errorMsg, setErrorMsg] = useState('')
  const detectedRef = useRef(false)

  const startScanner = useCallback(async () => {
    try {
      readerRef.current = new BrowserMultiFormatReader()
      const devices = await BrowserMultiFormatReader.listVideoInputDevices()
      if (!devices.length) {
        setStatus('error')
        setErrorMsg('No camera found. Use manual entry below.')
        return
      }
      // Prefer back camera
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
      setErrorMsg('Camera access denied. Please allow camera permissions or use manual entry.')
    }
  }, [onDetected])

  useEffect(() => {
    startScanner()
    return () => {
      controlsRef.current?.stop()
    }
  }, [startScanner])

  return (
    <div className="flex flex-col gap-4">
      {/* Scanner viewport */}
      <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 scanner-container">
        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />

        {status === 'active' && (
          <>
            {/* Corner guides */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-48 h-48">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-400 rounded-tl-md" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-400 rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-400 rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-400 rounded-br-md" />
                <div className="scan-line" />
              </div>
            </div>
            {/* Overlay overlay */}
            <div className="absolute inset-0 bg-slate-950/30" style={{
              maskImage: 'radial-gradient(ellipse 55% 45% at 50% 50%, transparent 60%, black 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 55% 45% at 50% 50%, transparent 60%, black 100%)'
            }} />
          </>
        )}

        {status === 'initializing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/80">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Starting camera…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="text-4xl">📷</span>
            <p className="text-sm text-slate-400">{errorMsg}</p>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-500">
        Point camera at a barcode on your cosmetic product
      </p>
    </div>
  )
}
