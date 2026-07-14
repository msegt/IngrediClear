// Progress tracker — aggregates NOVA scores from scan history
// to produce a weekly average and trend.

const HISTORY_KEY = 'ingrediclear_food_history'

/**
 * Reads food scan history and returns weekly aggregated data.
 * Each week bucket: { weekLabel, avgNova, count, scans[] }
 */
export function getWeeklyProgress() {
  let history = []
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }

  // Filter to food scans that have a novaGroup
  const foodScans = history.filter(s => s.novaGroup && s.scannedAt)

  if (foodScans.length === 0) return []

  // Group by ISO week (YYYY-Www)
  const buckets = {}
  foodScans.forEach(scan => {
    const d = new Date(scan.scannedAt)
    const week = getISOWeekLabel(d)
    if (!buckets[week]) buckets[week] = { weekLabel: week, scans: [] }
    buckets[week].scans.push(scan)
  })

  return Object.values(buckets)
    .sort((a, b) => a.weekLabel.localeCompare(b.weekLabel))
    .map(bucket => ({
      weekLabel: bucket.weekLabel,
      count: bucket.scans.length,
      avgNova: parseFloat(
        (bucket.scans.reduce((sum, s) => sum + Number(s.novaGroup), 0) / bucket.scans.length).toFixed(2)
      ),
      scans: bucket.scans,
    }))
}

/**
 * Returns overall stats: average NOVA across all tracked food scans,
 * and a simple trend (improving / worsening / stable).
 */
export function getProgressSummary() {
  const weeks = getWeeklyProgress()
  if (weeks.length === 0) return null

  const allScans = weeks.flatMap(w => w.scans)
  const overallAvg = parseFloat(
    (allScans.reduce((sum, s) => sum + Number(s.novaGroup), 0) / allScans.length).toFixed(2)
  )

  let trend = 'stable'
  if (weeks.length >= 2) {
    const last = weeks[weeks.length - 1].avgNova
    const prev = weeks[weeks.length - 2].avgNova
    if (last < prev - 0.2) trend = 'improving' // lower NOVA = better
    else if (last > prev + 0.2) trend = 'worsening'
  }

  return { overallAvg, trend, weekCount: weeks.length, scanCount: allScans.length }
}

// ISO week label: e.g. "2026-W28"
function getISOWeekLabel(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const year = d.getUTCFullYear()
  const startOfYear = new Date(Date.UTC(year, 0, 1))
  const week = Math.ceil(((d - startOfYear) / 86400000 + 1) / 7)
  return `${year}-W${String(week).padStart(2, '0')}`
}
