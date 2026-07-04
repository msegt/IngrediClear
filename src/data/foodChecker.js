// Food safety analysis based on:
// - EU traffic-light nutrition thresholds (FSA/NHS guidelines)
// - EU Regulation 1924/2006 (nutrition and health claims)
// - EFSA opinions on food additives
// - WHO/FAO ADI values where applicable

const COMMON_ALLERGENS = [
  { tag: 'en:gluten',                          label: 'Gluten' },
  { tag: 'en:milk',                            label: 'Milk' },
  { tag: 'en:eggs',                            label: 'Eggs' },
  { tag: 'en:soybeans',                        label: 'Soy' },
  { tag: 'en:peanuts',                         label: 'Peanuts' },
  { tag: 'en:nuts',                            label: 'Tree nuts' },
  { tag: 'en:sesame-seeds',                    label: 'Sesame' },
  { tag: 'en:fish',                            label: 'Fish' },
  { tag: 'en:crustaceans',                     label: 'Crustaceans' },
  { tag: 'en:molluscs',                        label: 'Molluscs' },
  { tag: 'en:celery',                          label: 'Celery' },
  { tag: 'en:mustard',                         label: 'Mustard' },
  { tag: 'en:lupin',                           label: 'Lupin' },
  { tag: 'en:sulphur-dioxide-and-sulphites',   label: 'Sulphites' }
]

// Additives with a factual, evidence-based note — all are approved by EFSA/FDA
// Descriptions reflect regulatory status and current scientific consensus
const ADDITIVE_CHECKS = [
  {
    match: 'palm oil',
    label: 'Palm oil',
    detail: 'A saturated fat. High intake of saturated fat is linked to raised LDL cholesterol (European Heart Journal, 2020). Also associated with significant deforestation and biodiversity loss.'
  },
  {
    match: 'glucose-fructose syrup',
    label: 'Glucose-fructose syrup (HFCS)',
    detail: 'A refined sweetener. High fructose intake is associated with raised triglycerides and non-alcoholic fatty liver disease when consumed in excess (EFSA, 2022). Approved food additive.'
  },
  {
    match: 'high fructose corn syrup',
    label: 'High fructose corn syrup (HFCS)',
    detail: 'A refined sweetener. High fructose intake is associated with raised triglycerides and non-alcoholic fatty liver disease when consumed in excess (EFSA, 2022). Approved food additive.'
  },
  {
    match: 'aspartame',
    label: 'Aspartame (E951)',
    detail: 'Approved by EFSA and FDA within established ADI limits. In 2023, IARC classified aspartame as “possibly carcinogenic” (Group 2B) at very high intakes, but EFSA and WHO concluded the ADI (40mg/kg/day) remains safe for the general population.'
  },
  {
    match: 'sucralose',
    label: 'Sucralose (E955)',
    detail: 'Approved by EFSA and FDA. Generally considered safe at typical dietary intakes. Some research suggests possible effects on gut microbiota at high doses; evidence is not conclusive at normal consumption levels.'
  },
  {
    match: 'monosodium glutamate',
    label: 'MSG (E621)',
    detail: 'Approved flavour enhancer considered safe by EFSA and FDA. Rigorous controlled studies have not confirmed “MSG sensitivity” as a reproducible syndrome. Naturally present in tomatoes, parmesan, and soy sauce.'
  },
  {
    match: 'sodium nitrite',
    label: 'Sodium nitrite (E250)',
    detail: 'Approved preservative used in processed meats. Can form N-nitrosamines (IARC Group 2A: probable carcinogens) during digestion or high-heat cooking. WHO recommends limiting processed meat consumption for this reason.'
  },
  {
    match: 'sodium nitrate',
    label: 'Sodium nitrate (E251)',
    detail: 'Approved preservative used in cured meats. Converted to nitrite in the body, which can form N-nitrosamines. WHO recommends limiting processed and cured meat consumption.'
  },
  {
    match: 'carrageenan',
    label: 'Carrageenan (E407)',
    detail: 'Approved thickener derived from red seaweed. Some animal studies raised concerns about gut inflammation at high doses; EFSA (2018) concluded current food-grade carrageenan is safe at typical dietary intakes.'
  },
  {
    match: 'titanium dioxide',
    label: 'Titanium dioxide (E171)',
    detail: 'Banned as a food additive in the EU since 2022 following an EFSA safety reassessment that could not exclude genotoxicity. Still permitted in some other countries. Check local regulations.'
  },
  {
    match: 'red 40',
    label: 'Red 40 (Allura Red, E129)',
    detail: 'Approved synthetic food dye. Part of the “Southampton Six” — a combination of artificial colours linked to increased hyperactivity in children in a 2007 UK study (McCann et al., Lancet). EU requires a warning label when used.'
  },
  {
    match: 'tartrazine',
    label: 'Tartrazine (E102)',
    detail: 'Approved yellow food dye. One of the “Southampton Six” dyes linked to increased hyperactivity in children. EU requires warning: “may have an adverse effect on activity and attention in children”.'
  }
]

function round(value, digits = 1) {
  const n = Number(value)
  return Number.isFinite(n) ? Number(n.toFixed(digits)) : null
}

export function analyseFoodProduct(product) {
  const nutriments = product.nutriments || {}
  const salt         = round(nutriments.salt_100g)
  const sugar        = round(nutriments.sugars_100g)
  const protein      = round(nutriments.proteins_100g)
  const saturatedFat = round(nutriments['saturated-fat_100g'])
  const fiber        = round(nutriments.fiber_100g)
  const energyKcal   = round(nutriments['energy-kcal_100g'])

  const allergens = (product.allergens_tags || [])
    .map(tag => COMMON_ALLERGENS.find(a => a.tag === tag))
    .filter(Boolean)

  // Thresholds from UK FSA traffic-light / EU high-sugar criteria
  const flags = []
  if (salt !== null && salt >= 1.5)             flags.push({ level: 'high',     label: 'High salt',              detail: `${salt}g per 100g — above the UK FSA “high” threshold of 1.5g/100g.` })
  else if (salt !== null && salt >= 0.3)        flags.push({ level: 'moderate', label: 'Moderate salt',          detail: `${salt}g per 100g (UK FSA “medium”: 0.3–1.5g/100g).` })

  if (sugar !== null && sugar >= 22.5)          flags.push({ level: 'high',     label: 'High sugar',             detail: `${sugar}g per 100g — above the UK FSA “high” threshold of 22.5g/100g.` })
  else if (sugar !== null && sugar >= 5)        flags.push({ level: 'moderate', label: 'Moderate sugar',         detail: `${sugar}g per 100g (UK FSA “medium”: 5–22.5g/100g).` })

  if (saturatedFat !== null && saturatedFat >= 5)    flags.push({ level: 'high',     label: 'High saturated fat',     detail: `${saturatedFat}g per 100g — above the UK FSA “high” threshold of 5g/100g.` })
  else if (saturatedFat !== null && saturatedFat >= 1.5) flags.push({ level: 'moderate', label: 'Moderate saturated fat', detail: `${saturatedFat}g per 100g (UK FSA “medium”: 1.5–5g/100g).` })

  // EU Regulation 1924/2006: “source of protein” ≥ 12% energy from protein; “high protein” ≥ 20%
  // Using ≥10g/100g as a practical “good protein” indicator
  if (protein !== null && protein >= 10)        flags.push({ level: 'good', label: 'Good source of protein', detail: `${protein}g protein per 100g.` })
  // EU Regulation 1924/2006: “source of fibre” ≥3g/100g
  if (fiber   !== null && fiber   >= 3)         flags.push({ level: 'good', label: 'Source of fibre',         detail: `${fiber}g fibre per 100g — meets the EU “source of fibre” criterion (≥3g/100g).` })

  const ingredientsText = (product.ingredients_text || '').toLowerCase()
  const additiveFlags = []
  ADDITIVE_CHECKS.forEach(item => {
    if (ingredientsText.includes(item.match)) additiveFlags.push(item)
  })

  // Nutri-Score is a science-based EU front-of-pack rating developed by Santé publique France
  // It is voluntary but widely adopted; not yet mandatory EU-wide
  const nutriscore = (product.nutriscore_grade || '').toUpperCase()
  const scoreReasons = []
  let healthScore = 55

  if (nutriscore && { A: 1, B: 1, C: 1, D: 1, E: 1 }[nutriscore]) {
    healthScore = { A: 92, B: 75, C: 55, D: 35, E: 15 }[nutriscore]
    scoreReasons.push({
      impact: 'neutral',
      text: `Nutri-Score ${nutriscore} — a science-based front-of-pack rating developed by Santé publique France, widely adopted across the EU. This is the primary basis for the score.`
    })
  } else {
    scoreReasons.push({ impact: 'neutral', text: 'No Nutri-Score available — score is estimated from individual nutrient levels using UK FSA traffic-light thresholds.' })

    if (flags.some(f => f.level === 'high' && f.label.includes('sugar'))) {
      healthScore -= 20
      scoreReasons.push({ impact: 'negative', text: `High sugar (${sugar}g/100g, above UK FSA threshold of 22.5g) lowers the score.` })
    } else if (flags.some(f => f.level === 'moderate' && f.label.includes('sugar'))) {
      scoreReasons.push({ impact: 'neutral', text: `Moderate sugar (${sugar}g/100g) — within the UK FSA medium band.` })
    }

    if (flags.some(f => f.level === 'high' && f.label.includes('salt'))) {
      healthScore -= 20
      scoreReasons.push({ impact: 'negative', text: `High salt (${salt}g/100g, above UK FSA threshold of 1.5g) lowers the score.` })
    } else if (flags.some(f => f.level === 'moderate' && f.label.includes('salt'))) {
      scoreReasons.push({ impact: 'neutral', text: `Moderate salt (${salt}g/100g) — within the UK FSA medium band.` })
    }

    if (flags.some(f => f.level === 'high' && f.label.includes('saturated'))) {
      healthScore -= 20
      scoreReasons.push({ impact: 'negative', text: `High saturated fat (${saturatedFat}g/100g, above UK FSA threshold of 5g) lowers the score.` })
    } else if (flags.some(f => f.level === 'moderate' && f.label.includes('saturated'))) {
      scoreReasons.push({ impact: 'neutral', text: `Moderate saturated fat (${saturatedFat}g/100g) — within the UK FSA medium band.` })
    }

    if (flags.some(f => f.level === 'good' && f.label.includes('protein'))) {
      healthScore += 10
      scoreReasons.push({ impact: 'positive', text: `Good protein content (${protein}g/100g) boosts the score.` })
    }
    if (flags.some(f => f.level === 'good' && f.label.includes('fibre'))) {
      healthScore += 10
      scoreReasons.push({ impact: 'positive', text: `Good fibre content (${fiber}g/100g, meets EU “source of fibre” criterion) boosts the score.` })
    }

    healthScore = Math.max(5, Math.min(95, healthScore))
  }

  return {
    allergens,
    flags,
    additiveFlags,
    nutrients: { salt, sugar, protein, saturatedFat, fiber, energyKcal },
    healthScore,
    scoreReasons,
    nutriscore,
    novaGroup: product.nova_group || null
  }
}
