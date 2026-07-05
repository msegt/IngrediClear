// USDA FoodData Central – free enrichment fallback
// Docs: https://fdc.nal.usda.gov/api-guide/
// API key: free, sign up at https://fdc.nal.usda.gov/api-key-signup/
// Set VITE_USDA_API_KEY in your .env file.
// Without a key the helper returns null and the app works normally.

const FDC_BASE = 'https://api.nal.usda.gov/fdc/v1'

const HEADERS = {
  'Accept': 'application/json',
  'User-Agent': 'IngrediClear/1.0 (https://github.com/msegt/IngrediClear)'
}

async function fetchWithTimeout(url, options = {}, ms = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal, headers: { ...HEADERS, ...(options.headers || {}) } })
    return res
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('USDA request timed out.')
    throw new Error('Network error reaching USDA FoodData Central.')
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Map a USDA FDC nutrient array into the OFF-compatible nutriments shape.
 * Only maps the fields the app currently uses.
 */
function mapNutrients(fdcNutrients = []) {
  const find = (name) => fdcNutrients.find(n => n.nutrientName?.toLowerCase().includes(name))

  const energy   = find('energy')
  const fat      = find('total lipid')
  const satFat   = find('fatty acids, total saturated')
  const carbs    = find('carbohydrate, by difference')
  const sugars   = find('sugars, total')
  const fiber    = find('fiber, total dietary')
  const proteins = find('protein')
  const salt     = find('sodium')

  const n = {}
  if (energy)   n['energy-kcal_100g']      = energy.value
  if (fat)      n['fat_100g']              = fat.value
  if (satFat)   n['saturated-fat_100g']    = satFat.value
  if (carbs)    n['carbohydrates_100g']    = carbs.value
  if (sugars)   n['sugars_100g']           = sugars.value
  if (fiber)    n['fiber_100g']            = fiber.value
  if (proteins) n['proteins_100g']         = proteins.value
  // USDA reports sodium in mg/100g; OFF uses salt in g/100g (salt ≈ sodium × 2.5)
  if (salt)     n['salt_100g']             = parseFloat((salt.value * 2.5 / 1000).toFixed(4))
  return n
}

/**
 * Search USDA FDC for a product by name (+ optional brand) and return
 * an OFF-compatible nutriments object, or null on any failure.
 *
 * @param {string} productName  e.g. "Nutella"
 * @param {string} [brand]      e.g. "Ferrero"
 * @returns {Promise<object|null>}
 */
export async function fetchUsdaEnrichment(productName, brand = '') {
  const apiKey = import.meta.env.VITE_USDA_API_KEY
  if (!apiKey) {
    console.warn('[USDA] VITE_USDA_API_KEY not set — skipping USDA enrichment.')
    return null
  }

  const query = [productName, brand].filter(Boolean).join(' ')
  const searchUrl = `${FDC_BASE}/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query)}&dataType=Branded&pageSize=1`

  let data
  try {
    const res = await fetchWithTimeout(searchUrl)
    if (!res.ok) return null
    data = await res.json()
  } catch {
    return null
  }

  const hit = data?.foods?.[0]
  if (!hit) return null

  return mapNutrients(hit.foodNutrients || [])
}
