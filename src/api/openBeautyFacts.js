const BASE_URL = 'https://world.openbeautyfacts.org/api/v2/product'

export async function fetchProduct(barcode) {
  const url = `${BASE_URL}/${barcode}.json?fields=product_name,brands,categories,ingredients_text,image_url,image_front_url,labels`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`)
  }

  const data = await response.json()

  if (data.status === 0 || !data.product) {
    throw new Error(
      'Product not found in Open Beauty Facts database. Try searching on openbeautyfacts.org to add it!'
    )
  }

  return data.product
}
