// Food safety analysis based on:
// - UK FSA traffic-light nutrition thresholds: https://www.food.gov.uk/safety-hygiene/colours-on-food-labels
// - EU Regulation 1924/2006 (nutrition claims): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006R1924
// - EFSA opinions: https://www.efsa.europa.eu/
// - IARC Monographs: https://monographs.iarc.who.int/
// - WHO dietary guidelines: https://www.who.int/news-room/fact-sheets/detail/healthy-diet

import { detectSeedOils } from './seedOils.js'
import { detectPesticideRisk } from './pesticideRisk.js'
import { detectHeavyMetalRisks } from './heavyMetalsFood.js'

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

const ADDITIVE_CHECKS = [
  {
    match: 'palm oil',
    label: 'Palm oil',
    detail: 'A saturated fat. High intake of saturated fat is associated with raised LDL cholesterol and increased cardiovascular risk (WHO, 2020). Also linked to significant deforestation and biodiversity loss.',
    sources: [
      { label: 'WHO — Saturated fatty acids and health (2020)', url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet' },
      { label: 'EFSA — Dietary fats and cardiovascular disease', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2010.1461' }
    ]
  },
  {
    match: 'glucose-fructose syrup',
    label: 'Glucose-fructose syrup (HFCS)',
    detail: 'High fructose intake is associated with raised triglycerides and non-alcoholic fatty liver disease when consumed in excess. Approved EU food additive; concerns relate to quantity consumed.',
    sources: [
      { label: 'EFSA — Scientific opinion on dietary sugars (2022)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2022.7074' },
      { label: 'WHO — Guideline: Sugars intake for adults and children', url: 'https://www.who.int/publications/i/item/9789241549028' }
    ]
  },
  {
    match: 'high fructose corn syrup',
    label: 'High fructose corn syrup (HFCS)',
    detail: 'High fructose intake is associated with raised triglycerides and non-alcoholic fatty liver disease when consumed in excess. Concerns relate to quantity consumed rather than the ingredient itself.',
    sources: [
      { label: 'EFSA — Scientific opinion on dietary sugars (2022)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2022.7074' },
      { label: 'WHO — Guideline: Sugars intake for adults and children', url: 'https://www.who.int/publications/i/item/9789241549028' }
    ]
  },
  {
    match: 'aspartame',
    label: 'Aspartame (E951)',
    detail: 'Approved by EFSA and FDA within established ADI limits (40mg/kg/day). In 2023, IARC classified aspartame as "possibly carcinogenic" (Group 2B) at very high intakes, but EFSA and WHO concluded current ADI remains safe for the general population.',
    sources: [
      { label: 'IARC/WHO/FAO — Aspartame hazard and risk assessment (2023)', url: 'https://www.iarc.who.int/news-events/iarc-monographs-evaluation-of-the-carcinogenicity-of-aspartame/' },
      { label: 'EFSA — Re-evaluation of aspartame (2013)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2013.3496' }
    ]
  },
  {
    match: 'sucralose',
    label: 'Sucralose (E955)',
    detail: 'Approved by EFSA and FDA. Generally considered safe at typical dietary intakes. Some studies suggest possible effects on gut microbiota at high doses; evidence is not conclusive at normal consumption levels.',
    sources: [
      { label: 'EFSA — Re-evaluation of sucralose (E955) as a food additive (2017)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2017.4765' },
      { label: 'FDA — Additional information on high-intensity sweeteners', url: 'https://www.fda.gov/food/food-additives-petitions/additional-information-about-high-intensity-sweeteners-permitted-use-food-united-states' }
    ]
  },
  {
    match: 'monosodium glutamate',
    label: 'MSG (E621)',
    detail: 'Approved flavour enhancer considered safe by EFSA and FDA. Rigorous double-blind studies have not confirmed "MSG sensitivity" as a reproducible syndrome. Naturally present in tomatoes, parmesan, and soy sauce.',
    sources: [
      { label: 'EFSA — Re-evaluation of glutamic acid and glutamates (2017)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2017.4910' },
      { label: 'Geha et al. — Multicenter double-blind trial on MSG sensitivity (2000)', url: 'https://doi.org/10.1093/jn/130.4.1058S' }
    ]
  },
  {
    match: 'sodium nitrite',
    label: 'Sodium nitrite (E250)',
    detail: 'Approved preservative used in processed meats. Can form N-nitrosamines (IARC Group 2A: probable carcinogens) during digestion or high-heat cooking. WHO classifies processed meat as a Group 1 carcinogen partly due to nitrite content.',
    sources: [
      { label: 'IARC — Processed meat (Group 1 carcinogen)', url: 'https://monographs.iarc.who.int/list-of-classifications/' },
      { label: 'EFSA — Re-evaluation of nitrites and nitrates (2017)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2017.4786' }
    ]
  },
  {
    match: 'sodium nitrate',
    label: 'Sodium nitrate (E251)',
    detail: 'Approved preservative used in cured meats. Converted to nitrite in the body, which can form N-nitrosamines. WHO recommends limiting processed and cured meat consumption for this reason.',
    sources: [
      { label: 'EFSA — Re-evaluation of nitrites and nitrates (2017)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2017.4786' },
      { label: 'WHO — Cancer: Carcinogenicity of processed meat', url: 'https://www.who.int/news-room/questions-and-answers/item/cancer-carcinogenicity-of-the-consumption-of-red-meat-and-processed-meat' }
    ]
  },
  {
    match: 'carrageenan',
    label: 'Carrageenan (E407)',
    detail: 'Approved thickener derived from red seaweed. Some animal studies raised concerns about gut inflammation at high doses. EFSA (2018) re-evaluated food-grade carrageenan and concluded it is safe at typical dietary intakes.',
    sources: [
      { label: 'EFSA — Re-evaluation of carrageenan (2018)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2018.5238' }
    ]
  },
  {
    match: 'titanium dioxide',
    label: 'Titanium dioxide (E171)',
    detail: 'Banned as a food additive in the EU since 2022 following an EFSA safety re-evaluation that could not exclude genotoxicity of nano-particles. Still permitted in some other jurisdictions.',
    sources: [
      { label: 'EFSA — Re-evaluation of titanium dioxide (E171) as food additive (2021)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2021.6585' },
      { label: 'EU Commission — Regulation banning E171 in food (2022)', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2063' }
    ]
  },
  {
    match: 'red 40',
    label: 'Red 40 / Allura Red (E129)',
    detail: 'Approved synthetic food dye. One of the "Southampton Six" — a combination of artificial colours linked to increased hyperactivity in children (McCann et al., Lancet 2007). EU requires the warning: "may have an adverse effect on activity and attention in children".',
    sources: [
      { label: 'McCann et al. — Food additives and hyperactivity (Lancet, 2007)', url: 'https://doi.org/10.1016/S0140-6736(07)61306-3' },
      { label: 'EFSA — Opinion on Southampton colours (2008)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2008.660' }
    ]
  },
  {
    match: 'tartrazine',
    label: 'Tartrazine (E102)',
    detail: 'Approved yellow food dye. One of the "Southampton Six" — linked to increased hyperactivity in children (McCann et al., Lancet 2007). EU requires the warning: "may have an adverse effect on activity and attention in children".',
    sources: [
      { label: 'McCann et al. — Food additives and hyperactivity (Lancet, 2007)', url: 'https://doi.org/10.1016/S0140-6736(07)61306-3' },
      { label: 'EFSA — Opinion on Southampton colours (2008)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2008.660' }
    ]
  }
]

const NUTRIENT_SOURCES = [
  { label: 'UK FSA — Traffic light food labelling', url: 'https://www.food.gov.uk/safety-hygiene/colours-on-food-labels' },
  { label: 'EU Regulation 1924/2006 — Nutrition and health claims', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006R1924' }
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
  const totalFat      = round(nutriments['fat_100g'])
  const carbohydrates = round(nutriments['carbohydrates_100g'])

  const availableNutrients = [salt, sugar, protein, saturatedFat, fiber].filter(v => v !== null)
  const dataQuality = availableNutrients.length === 0 ? 'none'
    : availableNutrients.length <= 2 ? 'partial'
    : 'full'

  const allergens = (product.allergens_tags || [])
    .map(tag => COMMON_ALLERGENS.find(a => a.tag === tag))
    .filter(Boolean)

  const flags = []
  if (salt !== null && salt >= 1.5)
    flags.push({ level: 'high',     label: 'High salt',              detail: `${salt}g per 100g — above the UK FSA "high" threshold of 1.5g/100g.`, sources: NUTRIENT_SOURCES })
  else if (salt !== null && salt >= 0.3)
    flags.push({ level: 'moderate', label: 'Moderate salt',          detail: `${salt}g per 100g (UK FSA "medium" band: 0.3–1.5g/100g).`, sources: NUTRIENT_SOURCES })

  if (sugar !== null && sugar >= 22.5)
    flags.push({ level: 'high',     label: 'High sugar',             detail: `${sugar}g per 100g — above the UK FSA "high" threshold of 22.5g/100g.`, sources: NUTRIENT_SOURCES })
  else if (sugar !== null && sugar >= 5)
    flags.push({ level: 'moderate', label: 'Moderate sugar',         detail: `${sugar}g per 100g (UK FSA "medium" band: 5–22.5g/100g).`, sources: NUTRIENT_SOURCES })

  if (saturatedFat !== null && saturatedFat >= 5)
    flags.push({ level: 'high',     label: 'High saturated fat',     detail: `${saturatedFat}g per 100g — above the UK FSA "high" threshold of 5g/100g.`, sources: NUTRIENT_SOURCES })
  else if (saturatedFat !== null && saturatedFat >= 1.5)
    flags.push({ level: 'moderate', label: 'Moderate saturated fat', detail: `${saturatedFat}g per 100g (UK FSA "medium" band: 1.5–5g/100g).`, sources: NUTRIENT_SOURCES })

  if (protein !== null && protein >= 10)
    flags.push({ level: 'good', label: 'Good source of protein', detail: `${protein}g protein per 100g.`, sources: NUTRIENT_SOURCES })
  if (fiber !== null && fiber >= 3)
    flags.push({ level: 'good', label: 'Source of fibre', detail: `${fiber}g fibre per 100g — meets the EU "source of fibre" criterion (≥3g/100g, EU Reg. 1924/2006).`, sources: NUTRIENT_SOURCES })

  const ingredientsText = (product.ingredients_text || '').toLowerCase()
  const additiveFlags = []
  ADDITIVE_CHECKS.forEach(item => {
    if (ingredientsText.includes(item.match)) additiveFlags.push(item)
  })

  // ── New Ivy-inspired checks ─────────────────────────────────────────────
  const seedOilFlag    = detectSeedOils(ingredientsText, product.ingredients_tags || [])
  const pesticideFlag  = detectPesticideRisk(product.categories_tags || [])
  const heavyMetalFlags = detectHeavyMetalRisks(product.categories_tags || [], ingredientsText)
  // Eco-Score (ecoscore_grade) and packaging_tags are passed directly from
  // the product object to EcoScoreBadge and PackagingFlags in FoodResult.jsx
  // ────────────────────────────────────────────────────────────────────────

  const nutriscore = (product.nutriscore_grade || '').toUpperCase()
  const scoreReasons = []
  let healthScore = null

  if (nutriscore && { A: 1, B: 1, C: 1, D: 1, E: 1 }[nutriscore]) {
    healthScore = { A: 92, B: 75, C: 55, D: 35, E: 15 }[nutriscore]
    scoreReasons.push({
      impact: 'neutral',
      text: `Nutri-Score ${nutriscore} — a science-based front-of-pack rating developed by Santé publique France, widely adopted across the EU. This is the primary basis for the score.`,
      delta: null,
    })
  } else if (dataQuality === 'none') {
    healthScore = null
    scoreReasons.push({
      impact: 'neutral',
      text: 'No nutritional data found in Open Food Facts for this product. A health score cannot be calculated without at least some nutrient values.',
      delta: null,
    })
  } else {
    healthScore = 55
    const missingNutrients = []
    if (salt === null)         missingNutrients.push('salt')
    if (sugar === null)        missingNutrients.push('sugar')
    if (saturatedFat === null) missingNutrients.push('saturated fat')
    if (protein === null)      missingNutrients.push('protein')
    if (fiber === null)        missingNutrients.push('fibre')

    scoreReasons.push({
      impact: 'neutral',
      text: `No Nutri-Score available — score estimated from ${availableNutrients.length} of 5 tracked nutrients using UK FSA traffic-light thresholds. Starting point: 55/100.`,
      delta: null,
    })

    if (missingNutrients.length > 0) {
      scoreReasons.push({
        impact: 'neutral',
        text: `Missing data for: ${missingNutrients.join(', ')}. These could not be factored into the score.`,
        delta: null,
      })
    }

    if (flags.some(f => f.level === 'high' && f.label.includes('sugar'))) {
      healthScore -= 20
      scoreReasons.push({ impact: 'negative', text: `High sugar (${sugar}g/100g) — above UK FSA "high" threshold of 22.5g/100g.`, delta: -20 })
    } else if (flags.some(f => f.level === 'moderate' && f.label.includes('sugar'))) {
      healthScore -= 5
      scoreReasons.push({ impact: 'negative', text: `Moderate sugar (${sugar}g/100g) — UK FSA medium band (5–22.5g/100g).`, delta: -5 })
    } else if (sugar !== null) {
      scoreReasons.push({ impact: 'positive', text: `Low sugar (${sugar}g/100g) — below UK FSA "low" threshold of 5g/100g.`, delta: null })
    }

    if (flags.some(f => f.level === 'high' && f.label.includes('salt'))) {
      healthScore -= 20
      scoreReasons.push({ impact: 'negative', text: `High salt (${salt}g/100g) — above UK FSA "high" threshold of 1.5g/100g.`, delta: -20 })
    } else if (flags.some(f => f.level === 'moderate' && f.label.includes('salt'))) {
      healthScore -= 5
      scoreReasons.push({ impact: 'negative', text: `Moderate salt (${salt}g/100g) — UK FSA medium band (0.3–1.5g/100g).`, delta: -5 })
    } else if (salt !== null) {
      scoreReasons.push({ impact: 'positive', text: `Low salt (${salt}g/100g) — below UK FSA "low" threshold of 0.3g/100g.`, delta: null })
    }

    if (flags.some(f => f.level === 'high' && f.label.includes('saturated'))) {
      healthScore -= 20
      scoreReasons.push({ impact: 'negative', text: `High saturated fat (${saturatedFat}g/100g) — above UK FSA "high" threshold of 5g/100g.`, delta: -20 })
    } else if (flags.some(f => f.level === 'moderate' && f.label.includes('saturated'))) {
      healthScore -= 5
      scoreReasons.push({ impact: 'negative', text: `Moderate saturated fat (${saturatedFat}g/100g) — UK FSA medium band (1.5–5g/100g).`, delta: -5 })
    } else if (saturatedFat !== null) {
      scoreReasons.push({ impact: 'positive', text: `Low saturated fat (${saturatedFat}g/100g) — below UK FSA "low" threshold of 1.5g/100g.`, delta: null })
    }

    if (flags.some(f => f.level === 'good' && f.label.includes('protein'))) {
      healthScore += 10
      scoreReasons.push({ impact: 'positive', text: `High protein (${protein}g/100g) — above "good source" threshold of 10g/100g (EU Reg. 1924/2006).`, delta: +10 })
    } else if (protein !== null) {
      scoreReasons.push({ impact: 'neutral', text: `Protein: ${protein}g/100g — below "good source" threshold (10g/100g). No adjustment.`, delta: null })
    }

    if (flags.some(f => f.level === 'good' && f.label.includes('fibre'))) {
      healthScore += 10
      scoreReasons.push({ impact: 'positive', text: `Good fibre content (${fiber}g/100g) — meets EU "source of fibre" criterion (≥3g/100g).`, delta: +10 })
    } else if (fiber !== null) {
      scoreReasons.push({ impact: 'neutral', text: `Fibre: ${fiber}g/100g — below EU "source of fibre" threshold (3g/100g). No adjustment.`, delta: null })
    }

    healthScore = Math.max(5, Math.min(95, healthScore))
  }

  return {
    allergens,
    flags,
    additiveFlags,
    seedOilFlag,
    pesticideFlag,
    heavyMetalFlags,
    nutrients: { salt, sugar, protein, saturatedFat, fiber, energyKcal, totalFat, carbohydrates },
    healthScore,
    scoreReasons,
    nutriscore,
    novaGroup: product.nova_group || null,
    dataQuality,
  }
}
