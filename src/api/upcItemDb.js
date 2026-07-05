/**
 * Open EAN / GTIN Database — free, CORS-open barcode lookup.
 * https://opengtindb.org
 *
 * Returns product title, description, and category for EAN-8/EAN-13 codes.
 * No API key required. Fair-use: one lookup per user scan.
 *
 * NOTE: UPC Item DB (/prod/trial/) was removed because its trial endpoint
 * does not send Access-Control-Allow-Origin headers, causing a network error
 * in every browser fetch call.
 */

const BASE = 'https://opengtindb.org/'

async function fetchWithTimeout(url, ms = 8000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { signal: controller.signal })
    return res
  } catch (err) {
    if (err.name === 'AbortError') throw Object.assign(new Error('EAN lookup timed out.'), { notFound: true })
    throw Object.assign(new Error('Network error during EAN lookup.'), { notFound: true })
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchUpcProduct(barcode) {
  const url = `${BASE}?ean=${encodeURIComponent(barcode)}&cmd=wsgeteaninfo&lang=en&modeJSON=1`

  let response
  try {
    response = await fetchWithTimeout(url)
  } catch (err) {
    err.notFound = true
    err.barcode  = barcode
    err.dbType   = 'ean'
    throw err
  }

  if (!response.ok) {
    throw Object.assign(
      new Error(`EAN DB error (${response.status}).`),
      { notFound: true, barcode, dbType: 'ean' }
    )
  }

  let data
  try { data = await response.json() } catch {
    throw Object.assign(
      new Error('Unexpected response from EAN DB.'),
      { notFound: true, barcode, dbType: 'ean' }
    )
  }

  if (!data || data.error !== 0 || !data.product) {
    throw Object.assign(
      new Error('Product not found in EAN DB.'),
      { notFound: true, barcode, dbType: 'ean' }
    )
  }

  const p = data.product
  return {
    id:               barcode,
    code:             barcode,
    product_name:     p.name         || p.detailedname || 'Unknown Product',
    brands:           p.vendor       || '',
    categories:       p.maincategory || '',
    ingredients_text: p.ingredients  || '',
    image_url:        p.pic          || '',
    image_front_url:  p.pic          || '',
    description:      p.description  || '',
    _source:          'opengtindb'
  }
}
