/**
 * Open Food Facts API wrapper.
 *
 * Do NOT set a custom User-Agent header — browsers treat it as a forbidden
 * header on cross-origin requests, causing CORS preflight failures.
 */

import { fetchUsdaEnrichment } from './usdaFoodData.js'

const BASE_URL   = 'https://world.openfoodfacts.org/api/v2/product'
const SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl'

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

function needsEnrichment(nutriments = {}) {
  const key_fields = ['energy-kcal_100g', 'sugars_100g', 'salt_100g', 'proteins_100g', 'saturated-fat_100g', 'fiber_100g']
  return key_fields.filter(f => nutriments[f] == null).length >= 3
}

export async function fetchFoodProduct(barcode) {
  const url = `${BASE_URL}/${barcode}.json?fields=code,id,product_name,brands,categories,ingredients_text,image_url,image_front_url,allergens,allergens_tags,nutriments,nutriscore_grade,nova_group,labels,quantity`
  const response = await fetchWithTimeout(url)

  if (response.status === 404) {
    throw Object.assign(
      new Error('Product not found in Open Food Facts.'),
      { notFound: true, barcode, dbType: 'food' }
    )
  }
  if (!response.ok) throw new Error(`Open Food Facts error (${response.status}).`)

  let data
  try { data = await response.json() } catch { throw new Error('Unexpected response from Open Food Facts.') }

  if (data.status === 0 || !data.product || !data.product.product_name) {
    throw Object.assign(
      new Error('Product not found in Open Food Facts.'),
      { notFound: true, barcode, dbType: 'food' }
    )
  }

  const product = data.product

  if (needsEnrichment(product.nutriments)) {
    try {
      const usda = await fetchUsdaEnrichment(product.product_name, product.brands)
      if (usda) {
        product.nutriments   = { ...usda, ...product.nutriments }
        product._usdaEnriched = true
      }
    } catch {
      // USDA enrichment is best-effort — never block the main result
    }
  }

  return product
}

export async function searchFoodProductsByName(query) {
  const params = new URLSearchParams({
    search_terms:  query,
    search_simple: 1,
    action:        'process',
    json:          1,
    page_size:     10,
    fields:        'id,code,product_name,brands,categories,image_front_url,image_url'
  })

  const response = await fetchWithTimeout(`${SEARCH_URL}?${params}`)
  if (!response.ok) throw new Error(`Search error (${response.status}). Try again.`)

  let data
  try { data = await response.json() } catch { throw new Error('Unexpected response from server.') }

  const products = (data.products || []).filter(p => p.product_name && p.product_name.trim())
  if (!products.length) throw new Error(`No food products found for “${query}”. Try a different name.`)
  return products
}
