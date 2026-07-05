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
  const [error, setError]             = useState(null)       // string message
  const [notFoundMeta, setNotFoundMeta] = useState(null)     // { barcode, dbType } | null
  const [history, setHistory]         = useState(getHistory())

  const goHome = () => {
    setScreen('landing')
    setProduct(null)
    setError(null)
    setNotFoundMeta(null)
  }

  const handleBarcode = async (barcode) => {
    if (!barcode || loading) return
    setLoading(true)
    setError(null)
    setNotFoundMeta(null)
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
      if (err.notFound) {
        setNotFoundMeta({ barcode: err.barcode, dbType: err.dbType })
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setProduct(null)
    setError(null)
    setNotFoundMeta(null)
    // Go to manual/search tab so user can type a name
    setActiveTab('manual')
  }

  // Switch mode and retry with the same barcode if available
  const handleSwitchMode = () => {
    const barcode = notFoundMeta?.barcode
    const newType = productType === 'food' ? 'cosmetics' : 'food'
    setProductType(newType)
    setError(null)
    setNotFoundMeta(null)
    if (barcode) {
      // Temporarily flip type for this call, then let state settle
      setTimeout(() => handleBarcodeWithType(barcode, newType), 0)
    }
  }

  const handleBarcodeWithType = async (barcode, type) => {
    if (!barcode || loading) return
    setLoading(true)
    setError(null)
    setNotFoundMeta(null)
    setProduct(null)
    try {
      const data = type === 'food'
        ? await fetchFoodProduct(barcode)
        : await fetchProduct(barcode)
      setProduct({ ...data, _type: type })
      const updated = saveToHistory({
        barcode,
        name:  data.product_name,
        brand: data.brands,
        image: data.image_front_url || data.image_url,
        type
      })
      setHistory(updated)
    } catch (err) {
      if (err.notFound) setNotFoundMeta({ barcode: err.barcode, dbType: err.dbType })
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredHistory = history.filter(h => h.type === productType)

  if (screen === 'landing') {
    return <LandingPage onGetStarted={() => setScreen('main')} />
  }

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

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto">
      <Header productType={productType} onProductTypeChange={setProductType} onGoHome={goHome} />

      <div className="flex-1 px-4 pt-4 pb-2 overflow-y-auto">
        {error && (
          <div className="mb-4">
            <ErrorCard
              message={error}
              notFoundMeta={notFoundMeta}
              onRetry={handleReset}
              onSwitchMode={notFoundMeta ? handleSwitchMode : undefined}
            />
          </div>
        )}

        {activeTab === 'scan'    && <Scanner     onDetected={handleBarcode} productType={productType} />}
        {activeTab === 'manual'  && <ManualEntry  onSubmit={handleBarcode}   productType={productType} />}
        {activeTab === 'history' && <ScanHistory  history={filteredHistory}  onSelect={handleBarcode} productType={productType} />}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => { setError(null); setNotFoundMeta(null); setActiveTab(tab) }} />
    </div>
  )
}
