import React, { useState } from 'react'
import Header from './components/Header.jsx'
import Scanner from './components/Scanner.jsx'
import ManualEntry from './components/ManualEntry.jsx'
import ProductResult from './components/ProductResult.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import ErrorCard from './components/ErrorCard.jsx'
import { fetchProduct } from './api/openBeautyFacts.js'

const TABS = [
  { id: 'scan', label: '📷 Scan', icon: '📷' },
  { id: 'manual', label: '⌨️ Enter', icon: '⌨️' }
]

export default function App() {
  const [activeTab, setActiveTab] = useState('scan')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleBarcode = async (barcode) => {
    if (!barcode || loading) return
    setLoading(true)
    setError(null)
    setProduct(null)
    try {
      const data = await fetchProduct(barcode)
      setProduct(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setProduct(null)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto">
      <Header />

      {!product && !loading && (
        <>
          {/* Tab switcher */}
          <div className="flex gap-2 mx-4 mt-4 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 px-4 py-4">
            {activeTab === 'scan' ? (
              <Scanner onDetected={handleBarcode} />
            ) : (
              <ManualEntry onSubmit={handleBarcode} />
            )}
          </div>
        </>
      )}

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="flex-1 px-4 py-4">
          <ErrorCard message={error} onRetry={handleReset} />
        </div>
      )}

      {product && !loading && (
        <div className="flex-1 px-4 py-4 animate-slide-up">
          <ProductResult product={product} onBack={handleReset} />
        </div>
      )}

      {/* Bottom safe area spacer */}
      <div className="h-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
    </div>
  )
}
