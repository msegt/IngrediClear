/**
 * UPC Item DB — free barcode lookup, no API key required.
 * https://www.upcitemdb.com/api/explorer#!/lookup/get_trial_lookup
 *
 * Limits: 100 lookups/day on the free tier (resets midnight UTC).
 * Returns product name, brand, description, and sometimes an ingredients field.
 * We normalise the response into the same shape expected by ProductResult.
 */

const BASE = 'https://api.upcitemdb.com/prod/trial/lookup'

const HEADERS = {
  'Accept': 'application/json',
  'User-Agent': 'IngrediClear/1.0 (https://github.com/msegt/IngrediClear)'
}

async function fetchWithTimeout(url, ms = 12000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { signal: controller.signal, headers: HEADERS })
    return res
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('UPC lookup timed out.')
    throw new Error('Network error during UPC lookup.')
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Look up a barcode via UPC Item DB.
 * Returns a normalised product object or throws with err.notFound = true.
 */
export async function fetchUpcProduct(barcode) {
  const url = `${BASE}?upc=${encodeURIComponent(barcode)}`
  const response = await fetchWithTimeout(url)

  // 429 = rate limit hit
  if (response.status === 429) {
    const err = new Error('UPC Item DB daily limit reached. Try again tomorrow or search by name.')
    err.notFound = true
    err.barcode = barcode
    err.dbType = 'upc'
    throw err
  }

  if (!response.ok) {
    const err = new Error(`UPC lookup error (${response.status}).`)
    err.notFound = true
    err.barcode = barcode
    err.dbType = 'upc'
    throw err
  }

  let data
  try { data = await response.json() } catch {
    const err = new Error('Unexpected response from UPC Item DB.')
    err.notFound = true
    err.barcode = barcode
    err.dbType = 'upc'
    throw err
  }

  const items = data.items
  if (!items || items.length === 0) {
    const err = new Error('Product not found in UPC Item DB.')
    err.notFound = true
    err.barcode = barcode
    err.dbType = 'upc'
    throw err
  }

  const item = items[0]

  // Build a product object compatible with ProductResult / FoodResult
  return {
    id:               barcode,
    code:             barcode,
    product_name:     item.title  || item.brand || 'Unknown Product',
    brands:           item.brand  || '',
    categories:       (item.category || ''),
    // UPC Item DB sometimes returns an ingredients string
    ingredients_text: item.ingredients || '',
    image_url:        (item.images && item.images[0]) || '',
    image_front_url:  (item.images && item.images[0]) || '',
    description:      item.description || '',
    _source:          'upcitemdb'
  }
}
