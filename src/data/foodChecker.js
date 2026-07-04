const COMMON_ALLERGENS = [
  { tag: 'en:gluten', label: 'Gluten' },
  { tag: 'en:milk', label: 'Milk' },
  { tag: 'en:eggs', label: 'Eggs' },
  { tag: 'en:soybeans', label: 'Soy' },
  { tag: 'en:peanuts', label: 'Peanuts' },
  { tag: 'en:nuts', label: 'Tree nuts' },
  { tag: 'en:sesame-seeds', label: 'Sesame' },
  { tag: 'en:fish', label: 'Fish' },
  { tag: 'en:crustaceans', label: 'Crustaceans' },
  { tag: 'en:molluscs', label: 'Molluscs' },
  { tag: 'en:celery', label: 'Celery' },
  { tag: 'en:mustard', label: 'Mustard' },
  { tag: 'en:lupin', label: 'Lupin' },
  { tag: 'en:sulphur-dioxide-and-sulphites', label: 'Sulphites' }
]

function round(value, digits = 1) {
  const n = Number(value)
  return Number.isFinite(n) ? Number(n.toFixed(digits)) : null
}

export function analyseFoodProduct(product) {
  const nutriments = product.nutriments || {}
  const salt = round(nutriments.salt_100g)
  const sugar = round(nutriments.sugars_100g)
  const protein = round(nutriments.proteins_100g)
  const saturatedFat = round(nutriments['saturated-fat_100g'])
  const fiber = round(nutriments.fiber_100g)
  const energyKcal = round(nutriments['energy-kcal_100g'])

  const allergens = (product.allergens_tags || [])
    .map(tag => COMMON_ALLERGENS.find(a => a.tag === tag))
    .filter(Boolean)

  const flags = []
  if (salt !== null && salt >= 1.5) flags.push({ level: 'high', label: 'High salt', detail: `${salt}g per 100g — above the common high-salt threshold.` })
  else if (salt !== null && salt >= 0.3) flags.push({ level: 'moderate', label: 'Moderate salt', detail: `${salt}g per 100g.` })

  if (sugar !== null && sugar >= 22.5) flags.push({ level: 'high', label: 'High sugar', detail: `${sugar}g per 100g — above the common high-sugar threshold.` })
  else if (sugar !== null && sugar >= 5) flags.push({ level: 'moderate', label: 'Moderate sugar', detail: `${sugar}g per 100g.` })

  if (saturatedFat !== null && saturatedFat >= 5) flags.push({ level: 'high', label: 'High saturated fat', detail: `${saturatedFat}g per 100g.` })
  else if (saturatedFat !== null && saturatedFat >= 1.5) flags.push({ level: 'moderate', label: 'Moderate saturated fat', detail: `${saturatedFat}g per 100g.` })

  if (protein !== null && protein >= 10) flags.push({ level: 'good', label: 'Good protein', detail: `${protein}g protein per 100g.` })
  if (fiber !== null && fiber >= 3) flags.push({ level: 'good', label: 'Source of fibre', detail: `${fiber}g fibre per 100g.` })

  const ingredientsText = (product.ingredients_text || '').toLowerCase()
  const additiveFlags = []
  ;[
    { match: 'palm oil', label: 'Palm oil', detail: 'Some people choose to avoid palm oil for environmental or dietary reasons.' },
    { match: 'glucose-fructose syrup', label: 'Glucose-fructose syrup', detail: 'A refined sweetener some people prefer to reduce.' },
    { match: 'high fructose corn syrup', label: 'High fructose corn syrup', detail: 'A refined sweetener many people aim to limit.' },
    { match: 'aspartame', label: 'Aspartame', detail: 'Artificial sweetener some consumers prefer to avoid.' },
    { match: 'sucralose', label: 'Sucralose', detail: 'Artificial sweetener some consumers prefer to avoid.' },
    { match: 'monosodium glutamate', label: 'MSG', detail: 'Flavour enhancer that some people are sensitive to.' },
    { match: 'sodium nitrite', label: 'Sodium nitrite', detail: 'Used in processed meats; some consumers prefer to limit nitrites.' },
    { match: 'sodium nitrate', label: 'Sodium nitrate', detail: 'Used in processed meats; some consumers prefer to limit nitrates.' }
  ].forEach(item => {
    if (ingredientsText.includes(item.match)) additiveFlags.push(item)
  })

  const nutriscore = (product.nutriscore_grade || '').toUpperCase()
  let healthScore = 55
  if (nutriscore) {
    healthScore = { A: 92, B: 75, C: 55, D: 35, E: 15 }[nutriscore] ?? 55
  } else {
    if (flags.some(f => f.level === 'high' && (f.label.includes('sugar') || f.label.includes('salt') || f.label.includes('saturated')))) healthScore -= 20
    if (flags.some(f => f.level === 'good' && f.label.includes('protein'))) healthScore += 10
    if (flags.some(f => f.level === 'good' && f.label.includes('fibre'))) healthScore += 10
    healthScore = Math.max(5, Math.min(95, healthScore))
  }

  return {
    allergens,
    flags,
    additiveFlags,
    nutrients: { salt, sugar, protein, saturatedFat, fiber, energyKcal },
    healthScore,
    nutriscore,
    novaGroup: product.nova_group || null
  }
}
