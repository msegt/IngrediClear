const BASE_URL = 'https://world.openbeautyfacts.org/api/v2/product'
const SEARCH_URL = 'https://world.openbeautyfacts.org/cgi/search.pl'

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

export async function fetchProduct(barcode) {
  const url = `${BASE_URL}/${barcode}.json?fields=id,code,product_name,brands,categories,ingredients_text,image_url,image_front_url,labels`
  const response = await fetchWithTimeout(url)

  if (!response.ok) throw new Error(`Server error (${response.status}). Try again later.`)

  let data
  try { data = await response.json() } catch { throw new Error('Unexpected response from server. Try again.') }

  if (data.status === 0 || !data.product || !data.product.product_name) {
    throw new Error('Product not found. Make sure you are in Cosmetics mode, or try searching by name instead.')
  }
  return data.product
}

export async function searchProductsByName(query) {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: 1,
    action: 'process',
    json: 1,
    page_size: 10,
    fields: 'id,code,product_name,brands,categories,image_front_url,image_url,labels'
  })

  const response = await fetchWithTimeout(`${SEARCH_URL}?${params}`)
  if (!response.ok) throw new Error(`Server error (${response.status}). Try again later.`)

  let data
  try { data = await response.json() } catch { throw new Error('Unexpected response from server. Try again.') }

  const products = (data.products || []).filter(p => p.product_name && p.product_name.trim())
  if (!products.length) throw new Error(`No cosmetics found for “${query}”. Try a shorter or different name.`)
  return products
}
