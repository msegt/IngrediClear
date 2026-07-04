const KEY = 'ingrediclear_history'
const MAX = 10

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveToHistory(entry) {
  const current = getHistory()
  const filtered = current.filter(h => h.barcode !== entry.barcode)
  const updated = [{ ...entry, scannedAt: new Date().toISOString() }, ...filtered].slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export function clearHistory() {
  localStorage.removeItem(KEY)
  return []
}
