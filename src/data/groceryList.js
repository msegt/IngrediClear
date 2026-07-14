// Grocery list persistence — uses localStorage

const KEY = 'ingrediclear_grocery_list'

export function getGroceryList() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

/**
 * Add a food product to the grocery list.
 * @param {{ barcode, name, brand, image, nutriscore, novaGroup }} item
 */
export function addToGroceryList(item) {
  const list = getGroceryList()
  // Avoid duplicates — replace existing entry for same barcode
  const idx = list.findIndex(i => i.barcode === item.barcode)
  const entry = { ...item, addedAt: new Date().toISOString() }
  if (idx >= 0) {
    list[idx] = entry
  } else {
    list.unshift(entry)
  }
  localStorage.setItem(KEY, JSON.stringify(list))
  return list
}

export function removeFromGroceryList(barcode) {
  const list = getGroceryList().filter(i => i.barcode !== barcode)
  localStorage.setItem(KEY, JSON.stringify(list))
  return list
}

export function clearGroceryList() {
  localStorage.setItem(KEY, '[]')
  return []
}

export function isInGroceryList(barcode) {
  return getGroceryList().some(i => i.barcode === barcode)
}
