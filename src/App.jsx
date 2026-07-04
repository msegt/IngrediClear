import React, { useState } from 'react'
import Header from './components/Header.jsx'
import Scanner from './components/Scanner.jsx'
import ManualEntry from './components/ManualEntry.jsx'
import ProductResult from './components/ProductResult.jsx'
import FoodResult from './components/FoodResult.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import ErrorCard from './components/ErrorCard.jsx'
import ScanHistory from './components/ScanHistory.jsx'
import { fetchProduct } from './api/openBeautyFacts.js'
import { fetchFoodProduct } from './api/openFoodFacts.js'
import { saveToHistory, getHistory } from './data/history.js'

const PRODUCT_TYPES = [
  { id: 'cosmetics', label: '🧴 Cosmetics' },
  { id: 'food', label: '🍽️ Food' }
]

const TABS = [
  { id: 'scan', label: '📷 Scan' },
  { id: 'manual', label: '⌨️ Enter' },
  { id: 'history', label: '🕒 History' }
]

export default function App() {
  const [productType, setProductType] = useState('cosmetics')
  const [activeTab, setActiveTab] = useState('scan')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState(getHistory())

  const handleBarcode = async (barcode) => {
    if (!barcode || loading) return
    setLoading(true)
    setError(null)
    setProduct(null)

    try {
      const data = productType === 'food'
        ? await fetchFoodProduct(barcode)
        : await fetchProduct(barcode)

      setProduct({ ...data, _type: productType })
      const updated = saveToHistory({
        barcode,
        name: data.product_name,
        brand: data.brands,
        image: data.image_front_url || data.image_url,
        type: productType
      })
      setHistory(updated)
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
          <div className="flex gap-1 mx-4 mt-4 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {PRODUCT_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => { setProductType(type.id); setError(null) }}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  productType === type.id
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1 mx-4 mt-3 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="px-4 py-4">
            {activeTab === 'scan' && <Scanner onDetected={handleBarcode} />}
            {activeTab === 'manual' && <ManualEntry onSubmit={handleBarcode} productType={productType} />}
            {activeTab === 'history' && <ScanHistory history={history.filter(h => h.type === productType)} onSelect={handleBarcode} />}
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
          {product._type === 'food'
            ? <FoodResult product={product} onBack={handleReset} />
            : <ProductResult product={product} onBack={handleReset} />}
        </div>
      )}

      <div className="h-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
    </div>
  )
}
