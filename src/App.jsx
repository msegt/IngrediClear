import React, { useState } from 'react'
import LandingPage      from './components/LandingPage.jsx'
import Header           from './components/Header.jsx'
import BottomNav        from './components/BottomNav.jsx'
import Scanner          from './components/Scanner.jsx'
import ManualEntry      from './components/ManualEntry.jsx'
import ProductResult    from './components/ProductResult.jsx'
import FoodResult       from './components/FoodResult.jsx'
import LoadingSpinner   from './components/LoadingSpinner.jsx'
import ErrorCard        from './components/ErrorCard.jsx'
import ScanHistory      from './components/ScanHistory.jsx'
import GroceryList      from './components/GroceryList.jsx'
import ProgressTracker  from './components/ProgressTracker.jsx'
import { fetchProduct }      from './api/openBeautyFacts.js'
import { fetchFoodProduct }  from './api/openFoodFacts.js'
import { saveToHistory, getHistory } from './data/history.js'

export default function App() {
  const [screen, setScreen]             = useState('landing')
  const [productType, setProductType]   = useState('cosmetics')
  const [activeTab, setActiveTab]       = useState('scan')
  const [product, setProduct]           = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)
  const [notFoundMeta, setNotFoundMeta] = useState(null)
  const [history, setHistory]           = useState(getHistory())

  const goHome = () => {
    setScreen('landing')
    setProduct(null)
    setError(null)
    setNotFoundMeta(null)
  }

  // ── Barcode / name lookup ─────────────────────────────────────────────────
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
        type:  productType,
        nova_group:    data.nova_group,
        nutriscore_grade: data.nutriscore_grade,
      })
      setHistory(updated)
    } catch (err) {
      if (err.notFound) setNotFoundMeta({ barcode: err.barcode, dbType: err.dbType })
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Raw ingredient text from paste / OCR ─────────────────────────────────
  const handleIngredients = (ingredientsText) => {
    setProduct({
      _type:            'cosmetics',
      _source:          'manual',
      product_name:     'Manual ingredient analysis',
      brands:           '',
      categories:       '',
      ingredients_text: ingredientsText,
      image_url:        '',
      image_front_url:  ''
    })
    setError(null)
    setNotFoundMeta(null)
  }

  const handleReset = () => {
    setProduct(null)
    setError(null)
    setNotFoundMeta(null)
    setActiveTab('manual')
  }

  // Switch mode and retry same barcode
  const handleSwitchMode = () => {
    const barcode = notFoundMeta?.barcode
    const newType = productType === 'food' ? 'cosmetics' : 'food'
    setProductType(newType)
    setError(null)
    setNotFoundMeta(null)
    if (barcode) setTimeout(() => handleBarcodeWithType(barcode, newType), 0)
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
        type,
        nova_group:       data.nova_group,
        nutriscore_grade: data.nutriscore_grade,
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

  // ── Landing screen (no header/nav) ────────────────────────────────────────
  if (screen === 'landing') {
    return (
      <main id="main-content">
        <LandingPage onGetStarted={() => setScreen('main')} />
      </main>
    )
  }

  // ── Product result screen ─────────────────────────────────────────────────
  if (product && !loading) {
    return (
      <div className="min-h-screen flex flex-col max-w-lg mx-auto">
        <Header productType={productType} onProductTypeChange={setProductType} onGoHome={goHome} />
        <main id="main-content" className="flex-1 px-4 py-4 animate-slide-up overflow-y-auto">
          {product._type === 'food'
            ? <FoodResult    product={product} onBack={handleReset} />
            : <ProductResult product={product} onBack={handleReset} />}
        </main>
      </div>
    )
  }

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col max-w-lg mx-auto">
        <Header productType={productType} onProductTypeChange={setProductType} onGoHome={goHome} />
        <main id="main-content" className="flex-1 flex flex-col items-center justify-center gap-4">
          <LoadingSpinner />
          <p className="text-sm text-slate-400">Looking up product…</p>
        </main>
      </div>
    )
  }

  // ── Main tab screen ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto">
      <Header productType={productType} onProductTypeChange={setProductType} onGoHome={goHome} />

      <main id="main-content" className="flex-1 px-4 pt-4 pb-2 overflow-y-auto">
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

        {activeTab === 'scan'     && <Scanner     onDetected={handleBarcode}  productType={productType} />}
        {activeTab === 'manual'   && (
          <ManualEntry
            onSubmit={handleBarcode}
            onIngredients={handleIngredients}
            productType={productType}
          />
        )}
        {activeTab === 'history'  && <ScanHistory  history={filteredHistory}  onSelect={handleBarcode} productType={productType} />}
        {activeTab === 'grocery'  && <GroceryList  onScanBarcode={handleBarcode} />}
        {activeTab === 'progress' && <ProgressTracker history={history} />}
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => { setError(null); setNotFoundMeta(null); setActiveTab(tab) }}
      />
    </div>
  )
}
