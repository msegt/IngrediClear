const BASE_URL = 'https://world.openbeautyfacts.org/api/v2/product'
const SEARCH_URL = 'https://world.openbeautyfacts.org/cgi/search.pl'

export async function fetchProduct(barcode) {
  const url = `${BASE_URL}/${barcode}.json?fields=id,product_name,brands,categories,ingredients_text,image_url,image_front_url,labels`

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Network error: ${response.status}`)

  const data = await response.json()
  if (data.status === 0 || !data.product) {
    throw new Error('Product not found in Open Beauty Facts database.')
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
    fields: 'id,code,product_name,brands,categories,ingredients_text,image_front_url,image_url,labels'
  })

  const response = await fetch(`${SEARCH_URL}?${params}`)
  if (!response.ok) throw new Error(`Network error: ${response.status}`)

  const data = await response.json()
  const products = (data.products || []).filter(p => p.product_name && p.product_name.trim())
  if (!products.length) throw new Error(`No products found for "${query}". Try a different name or use the barcode.`)
  return products
}
