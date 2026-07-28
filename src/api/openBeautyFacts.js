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

  try {
    const product = await fetchUpcProduct(barcode)
    return { ...product, _fallback: true }
  } catch (eanErr) {
    if (!eanErr.notFound) throw eanErr
  }

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
 *
 * Uses the same /cgi/search.pl + tagtype_0/tag_0 pattern as fetchFoodAlternatives
 * for reliable category filtering.
 *
 * Ranking:
 *   1. Products with strictly fewer allergens_tags than the scanned item
 *   2. Within that, sorted by ecoscore_grade ascending (a = best)
 *   3. Falls back to all in-category products if fewer than 3 pass the allergen filter
 *
 * Returns [] if no category tag is available.
 */
export async function fetchCosmeticAlternatives(categoryTag, currentAllergenCount) {
  if (!categoryTag) return []

  const params = new URLSearchParams({
    action:           'process',
    json:             1,
    tagtype_0:        'categories',
    tag_contains_0:   'contains',
    tag_0:            categoryTag,
    sort_by:          'popularity',
    page_size:        50,
    fields:           'code,product_name,brands,image_front_small_url,allergens_tags,ecoscore_grade,labels',
  })

  try {
    const response = await fetchWithTimeout(`${SEARCH_URL}?${params}`, 10000)
    if (!response.ok) return []
    const data = await response.json()
    const all = (data.products || []).filter(p => p.product_name?.trim())

    const allergenCount = (p) => Array.isArray(p.allergens_tags) ? p.allergens_tags.length : 0

    // Prefer strictly fewer allergens
    const better = all.filter(p => allergenCount(p) < currentAllergenCount)
    const candidates = better.length >= 3 ? better : all

    const GRADES = ['a', 'b', 'c', 'd', 'e']
    candidates.sort((x, y) => {
      const gi = GRADES.indexOf((x.ecoscore_grade || 'e').toLowerCase())
      const gj = GRADES.indexOf((y.ecoscore_grade || 'e').toLowerCase())
      if (gi !== gj) return gi - gj
      return allergenCount(x) - allergenCount(y)
    })

    return candidates.slice(0, 5)
  } catch {
    return []
  }
}
