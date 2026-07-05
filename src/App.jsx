import React, { useState } from 'react'
import LandingPage from './components/LandingPage.jsx'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
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

export default function App() {
  const [screen, setScreen]           = useState('landing')
  const [productType, setProductType] = useState('cosmetics')
  const [activeTab, setActiveTab]     = useState('scan')
  const [product, setProduct]         = useState(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [history, setHistory]         = useState(getHistory())

  const goHome = () => {
    setScreen('landing')
    setProduct(null)
    setError(null)
  }

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
        name:  data.product_name,
        brand: data.brands,
        image: data.image_front_url || data.image_url,
        type:  productType
      })
      setHistory(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setProduct(null); setError(null) }

  const filteredHistory = history.filter(h => h.type === productType)

  // ── Landing page
  if (screen === 'landing') {
    return <LandingPage onGetStarted={() => setScreen('main')} />
  }

  // ── Result view
  if (product && !loading) {
    return (
      <div className="min-h-screen flex flex-col max-w-lg mx-auto">
        <Header productType={productType} onProductTypeChange={setProductType} onGoHome={goHome} />
        <div className="flex-1 px-4 py-4 animate-slide-up overflow-y-auto">
          {product._type === 'food'
            ? <FoodResult    product={product} onBack={handleReset} />
            : <ProductResult product={product} onBack={handleReset} />}
        </div>
      </div>
    )
  }

  // ── Loading view
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col max-w-lg mx-auto">
        <Header productType={productType} onProductTypeChange={setProductType} onGoHome={goHome} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <LoadingSpinner />
          <p className="text-sm text-slate-400">Looking up product…</p>
        </div>
      </div>
    )
  }

  // ── Main scanner / entry / history view
  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto">
      <Header productType={productType} onProductTypeChange={setProductType} onGoHome={goHome} />

      <div className="flex-1 px-4 pt-4 pb-2 overflow-y-auto">
        {error && (
          <div className="mb-4">
            <ErrorCard message={error} onRetry={handleReset} />
          </div>
        )}

        {activeTab === 'scan'    && <Scanner     onDetected={handleBarcode} productType={productType} />}
        {activeTab === 'manual'  && <ManualEntry  onSubmit={handleBarcode}   productType={productType} />}
        {activeTab === 'history' && <ScanHistory  history={filteredHistory}  onSelect={handleBarcode} productType={productType} />}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => { setError(null); setActiveTab(tab) }} />
    </div>
  )
}
