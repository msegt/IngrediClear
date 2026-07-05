import { fetchUsdaEnrichment } from './usdaFoodData.js'

const BASE_URL = 'https://world.openfoodfacts.org/api/v2/product'
const SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl'

const HEADERS = {
  'Accept': 'application/json',
  'User-Agent': 'IngrediClear/1.0 (https://github.com/msegt/IngrediClear)'
}

async function fetchWithTimeout(url, options = {}, ms = 12000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal, headers: { ...HEADERS, ...(options.headers || {}) } })
    return res
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out. Check your internet connection and try again.')
    throw new Error('Network error. Check your internet connection and try again.')
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Returns true when key nutriment fields are absent from the OFF product,
 * meaning USDA enrichment would add meaningful data.
 */
function needsEnrichment(nutriments = {}) {
  const key_fields = ['energy-kcal_100g', 'sugars_100g', 'salt_100g', 'proteins_100g', 'saturated-fat_100g', 'fiber_100g']
  return key_fields.filter(f => nutriments[f] == null).length >= 3
}

export async function fetchFoodProduct(barcode) {
  const url = `${BASE_URL}/${barcode}.json?fields=code,id,product_name,brands,categories,ingredients_text,image_url,image_front_url,allergens,allergens_tags,nutriments,nutriscore_grade,nova_group,labels,quantity`
  const response = await fetchWithTimeout(url)

  if (!response.ok) throw new Error(`Server error (${response.status}). Try again later.`)

  let data
  try { data = await response.json() } catch { throw new Error('Unexpected response from server. Try again.') }

  if (data.status === 0 || !data.product || !data.product.product_name) {
    throw new Error('Food product not found. Make sure you are in Food mode, or try searching by name instead.')
  }

  const product = data.product

  // Enrich with USDA data when OFF nutriments are sparse
  if (needsEnrichment(product.nutriments)) {
    const usda = await fetchUsdaEnrichment(product.product_name, product.brands)
    if (usda) {
      product.nutriments = { ...usda, ...product.nutriments }
      product._usdaEnriched = true
    }
  }

  return product
}

export async function searchFoodProductsByName(query) {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: 1,
    action: 'process',
    json: 1,
    page_size: 10,
    fields: 'id,code,product_name,brands,categories,image_front_url,image_url'
  })

  const response = await fetchWithTimeout(`${SEARCH_URL}?${params}`)
  if (!response.ok) throw new Error(`Server error (${response.status}). Try again later.`)

  let data
  try { data = await response.json() } catch { throw new Error('Unexpected response from server. Try again.') }

  const products = (data.products || []).filter(p => p.product_name && p.product_name.trim())
  if (!products.length) throw new Error(`No food products found for "${query}". Try a shorter or different name.`)
  return products
}
