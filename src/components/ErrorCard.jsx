import React from 'react'

export default function ErrorCard({ message, onRetry, onSwitchMode, notFoundMeta }) {
  const isNotFound = !!(notFoundMeta || (message && (message.includes('not found') || message.includes('No '))))
  const isTimeout  = message && message.includes('timed out')
  const isNetwork  = message && message.includes('Network error')

  const icon  = isNotFound ? '🔍' : isTimeout ? '⏱' : isNetwork ? '📡' : '⚠️'
  const title = isNotFound ? 'Product not found'
               : isTimeout  ? 'Request timed out'
               : isNetwork  ? 'Connection problem'
               : 'Something went wrong'

  const { barcode, dbType } = notFoundMeta || {}
  const addUrl = barcode
    ? dbType === 'food'
      ? `https://world.openfoodfacts.org/product/${barcode}`
      : `https://world.openbeautyfacts.org/product/${barcode}`
    : null
  const addSiteName = dbType === 'food' ? 'Open Food Facts' : 'Open Beauty Facts'
  const switchLabel = dbType === 'food' ? 'Try in Cosmetics mode' : 'Try in Food mode'

  return (
    <div role="alert" className="card p-6 flex flex-col items-center text-center gap-4">
      <span aria-hidden="true" className="text-5xl">{icon}</span>

      <div>
        <p className="font-semibold text-white text-base">{title}</p>
        {isNotFound ? (
          <p className="text-sm text-slate-400 mt-1">
            This barcode isn’t in the database yet, or you may be in the wrong mode.
          </p>
        ) : (
          <p className="text-sm text-slate-400 mt-1">{message}</p>
        )}
      </div>

      {isNotFound ? (
        <div className="flex flex-col gap-2 w-full">
          {onSwitchMode && (
            <button
              onClick={onSwitchMode}
              aria-label={switchLabel}
              className="btn-primary w-full"
            >
              {switchLabel}
            </button>
          )}

          <button
            onClick={onRetry}
            aria-label="Search for this product by name"
            className="w-full py-2.5 px-4 rounded-xl border border-slate-600 text-slate-300 text-sm font-medium hover:border-slate-400 hover:text-white transition"
          >
            Search by name instead
          </button>

          {addUrl && (
            <a
              href={addUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl border border-brand-500/40 text-brand-400 text-sm font-medium hover:border-brand-400 hover:text-brand-300 transition text-center"
            >
              Add this product to {addSiteName}
              <span aria-hidden="true"> →</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          )}
        </div>
      ) : (
        <button
          onClick={onRetry}
          aria-label="Try the request again"
          className="btn-primary px-8"
        >
          Try again
        </button>
      )}
    </div>
  )
}
