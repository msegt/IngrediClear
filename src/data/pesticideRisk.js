// Pesticide risk heuristics based on EWG Dirty Dozen / Clean Fifteen
// Source: https://www.ewg.org/foodnews/
// EFSA pesticide MRL database: https://www.efsa.europa.eu/en/topics/topic/pesticides

// Open Food Facts category tags that map to high-pesticide crops
const HIGH_RISK_CATEGORIES = [
  // Dirty Dozen crops (EWG 2024)
  { pattern: 'strawberr', crop: 'Strawberries', rank: 1 },
  { pattern: 'spinach',   crop: 'Spinach',      rank: 2 },
  { pattern: 'kale',      crop: 'Kale / Collard greens', rank: 3 },
  { pattern: 'peach',     crop: 'Peaches',      rank: 4 },
  { pattern: 'pear',      crop: 'Pears',        rank: 5 },
  { pattern: 'nectarine', crop: 'Nectarines',   rank: 6 },
  { pattern: 'apple',     crop: 'Apples',       rank: 7 },
  { pattern: 'grape',     crop: 'Grapes',       rank: 8 },
  { pattern: 'bell-pepper', crop: 'Bell peppers', rank: 9 },
  { pattern: 'sweet-pepper', crop: 'Sweet peppers', rank: 9 },
  { pattern: 'cherry',    crop: 'Cherries',     rank: 10 },
  { pattern: 'blueberr',  crop: 'Blueberries',  rank: 11 },
  { pattern: 'green-bean', crop: 'Green beans', rank: 12 },
]

const LOW_RISK_CATEGORIES = [
  // Clean Fifteen crops
  'avocado', 'sweet-corn', 'pineapple', 'onion', 'papaya',
  'frozen-peas', 'asparagus', 'honeydew', 'kiwi', 'cabbage',
  'mushroom', 'mango', 'sweet-potato', 'watermelon', 'carrot',
]

/**
 * Returns a pesticide risk flag object or null.
 * @param {string[]} categoriesTags  categories_tags from Open Food Facts (array of strings)
 * @returns {{ label, detail, sources, detectedCrops } | null}
 */
export function detectPesticideRisk(categoriesTags = []) {
  const tags = categoriesTags.map(t => t.toLowerCase())

  // Check for low risk first — if clearly clean, skip
  const isClean = LOW_RISK_CATEGORIES.some(crop =>
    tags.some(tag => tag.includes(crop))
  )

  const matched = HIGH_RISK_CATEGORIES.filter(({ pattern }) =>
    tags.some(tag => tag.includes(pattern))
  )

  if (matched.length === 0) return null

  const cropList = matched.map(m => m.crop).join(', ')
  const isOrganic = tags.some(t => t.includes('organic') || t.includes('bio'))

  return {
    label: '🌿 Pesticide residue risk',
    detail:
      `Contains ingredient(s) from high-pesticide-residue crops: ${cropList}. ` +
      (isOrganic
        ? 'This product appears to be organic — pesticide risk may be lower. '
        : '') +
      'Based on EWG Dirty Dozen rankings (conventional produce). ' +
      'All pesticide residues in EU products must comply with maximum residue limits (MRLs) set by EFSA. ' +
      'Washing fresh produce reduces but does not eliminate surface residues.',
    sources: [
      {
        label: 'EWG — Dirty Dozen 2024 (Shopper\'s Guide to Pesticides)',
        url: 'https://www.ewg.org/foodnews/dirty-dozen.php',
      },
      {
        label: 'EFSA — Pesticides in food: monitoring results 2022',
        url: 'https://www.efsa.europa.eu/en/efsajournal/pub/8405',
      },
    ],
    detectedCrops: matched.map(m => m.crop),
    isOrganic,
  }
}
