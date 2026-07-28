/**
 * Open Beauty Facts API wrapper.
 *
 * Fallback chain:
 *   1. Open Beauty Facts + Open Food Facts  — queried in parallel (8 s timeout)
 *   2. Open EAN DB                          — last-resort CORS-open fallback
 *
 * Do NOT set a custom User-Agent header — browsers treat it as a forbidden
 * header on cross-origin requests, silently causing CORS preflight failures.
 */

import { fetchFoodProduct } from './openFoodFacts.js'
import { fetchUpcProduct }  from './upcItemDb.js'

const BASE_URL   = 'https://world.openbeautyfacts.org/api/v2/product'
const SEARCH_URL = 'https://world.openbeautyfacts.org/cgi/search.pl'
const ALT_URL    = 'https://world.openbeautyfacts.org/api/v2/search'

async function fetchWithTimeout(url, ms = 8000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { signal: controller.signal })
    return res
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.')
    throw new Error('Network error. Please try again.')
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchProduct(barcode) {
  // ── 1+2. OBF and OFF in parallel ───────────────────────────────────────
  const [obfResult, offResult] = await Promise.allSettled([
    _fetchFromOBF(barcode),
    fetchFoodProduct(barcode)
  ])

  if (obfResult.status === 'fulfilled') return obfResult.value
  if (offResult.status === 'fulfilled') return { ...offResult.value, _source: 'openfoodfacts', _fallback: true }

  const obfErr = obfResult.reason
  const offErr = offResult.reason
  if (!obfErr.notFound) throw obfErr
  if (!offErr.notFound) throw offErr

  // ── 3. EAN DB fallback ───────────────────────────────────────────────
  try {
    const product = await fetchUpcProduct(barcode)
    return { ...product, _fallback: true }
  } catch (eanErr) {
    if (!eanErr.notFound) throw eanErr
  }

  // ── All three failed ──────────────────────────────────────────────────
  throw Object.assign(
    new Error('Product not found. Try searching by name or paste the ingredient list.'),
    { notFound: true, barcode, dbType: 'beauty' }
  )
}

async function _fetchFromOBF(barcode) {
  const url = `${BASE_URL}/${barcode}.json?fields=id,code,product_name,brands,categories,categories_tags,ingredients_text,image_url,image_front_url,labels,allergens,allergens_tags,periods_after_opening,countries_tags,packaging,ecoscore_grade`
  const response = await fetchWithTimeout(url)

  if (response.status === 404) {
    throw Object.assign(new Error('Not in Open Beauty Facts.'), { notFound: true, barcode, dbType: 'beauty' })
  }
  if (!response.ok) throw new Error(`Open Beauty Facts error (${response.status}).`)

  let data
  try { data = await response.json() } catch { throw new Error('Unexpected response from Open Beauty Facts.') }

  if (data.status === 0 || !data.product || !data.product.product_name) {
    throw Object.assign(new Error('Not in Open Beauty Facts.'), { notFound: true, barcode, dbType: 'beauty' })
  }
  return data.product
}

export async function searchProductsByName(query) {
  const params = new URLSearchParams({
    search_terms:  query,
    search_simple: 1,
    action:        'process',
    json:          1,
    page_size:     10,
    fields:        'id,code,product_name,brands,categories,image_front_url,image_url,labels,allergens_tags,periods_after_opening,ecoscore_grade'
  })

  const response = await fetchWithTimeout(`${SEARCH_URL}?${params}`)
  if (!response.ok) throw new Error(`Search error (${response.status}). Try again.`)

  let data
  try { data = await response.json() } catch { throw new Error('Unexpected response from server.') }

  const products = (data.products || []).filter(p => p.product_name && p.product_name.trim())
  if (!products.length) throw new Error(`No results for "${query}". Try a different name.`)
  return products
}

/**
 * Fetch up to 5 cosmetic alternatives that are safer than the scanned product.
 * Uses the first category tag and looks for products with fewer allergens_tags.
 * Falls back to any in-category results when allergen data is sparse.
 * Returns [] if no category tag is available.
 */
export async function fetchCosmeticAlternatives(categoryTag, currentAllergenCount) {
  if (!categoryTag) return []

  const params = new URLSearchParams({
    categories_tags: categoryTag,
    fields: 'code,product_name,brands,image_front_small_url,allergens_tags,ecoscore_grade,labels',
    sort_by: 'popularity',
    page_size: 20, // fetch more so we can filter client-side
  })

  try {
    const response = await fetchWithTimeout(`${ALT_URL}?${params}`, 10000)
    if (!response.ok) return []
    const data = await response.json()
    const all = (data.products || []).filter(p => p.product_name && p.product_name.trim())

    // Prefer products with strictly fewer allergens than the scanned item
    const better = all.filter(p => {
      const count = Array.isArray(p.allergens_tags) ? p.allergens_tags.length : 0
      return count < currentAllergenCount
    })

    // If too few results, fall back to same-category products sorted by eco score
    const candidates = better.length >= 3 ? better : all

    // Sort: ecoscore a > b > c > d > e > unknown, then fewest allergens
    const GRADES = ['a', 'b', 'c', 'd', 'e']
    candidates.sort((x, y) => {
      const gi = GRADES.indexOf((x.ecoscore_grade || 'e').toLowerCase())
      const gj = GRADES.indexOf((y.ecoscore_grade || 'e').toLowerCase())
      if (gi !== gj) return gi - gj
      const ai = Array.isArray(x.allergens_tags) ? x.allergens_tags.length : 0
      const aj = Array.isArray(y.allergens_tags) ? y.allergens_tags.length : 0
      return ai - aj
    })

    return candidates.slice(0, 5)
  } catch {
    return []
  }
}
