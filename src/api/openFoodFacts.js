const BASE_URL = 'https://world.openfoodfacts.org/api/v2/product'

export async function fetchFoodProduct(barcode) {
  const url = `${BASE_URL}/${barcode}.json?fields=code,id,product_name,brands,categories,ingredients_text,image_url,image_front_url,allergens,allergens_tags,nutriments,nutriscore_grade,nova_group,labels,quantity`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Network error: ${response.status}`)

  const data = await response.json()
  if (data.status === 0 || !data.product) {
    throw new Error('Food product not found in Open Food Facts database.')
  }

  return data.product
}
