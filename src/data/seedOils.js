// Seed oil detection data
// Sources:
// - EWG Food Scores: https://www.ewg.org/foodscores/
// - Harvard T.H. Chan School of Public Health — The Nutrition Source: https://www.hsph.harvard.edu/nutritionsource/what-should-you-eat/fats-and-cholesterol/

export const SEED_OIL_TERMS = [
  'canola oil',
  'rapeseed oil',
  'soybean oil',
  'soya oil',
  'sunflower oil',
  'corn oil',
  'maize oil',
  'cottonseed oil',
  'grapeseed oil',
  'safflower oil',
  'rice bran oil',
  'vegetable oil',  // generic — often seed-based
  'hydrogenated vegetable oil',
  'partially hydrogenated',
]

export const SEED_OIL_FLAG = {
  label: '🫙 Seed oils detected',
  detail:
    'This product contains one or more refined seed oils (e.g. canola, sunflower, soybean). ' +
    'These oils are high in omega-6 polyunsaturated fatty acids. ' +
    'A high dietary omega-6:omega-3 ratio is associated with pro-inflammatory effects in some observational studies, ' +
    'though regulatory bodies (EFSA, WHO) do not currently classify moderate consumption as harmful. ' +
    'Partially hydrogenated versions are banned in the EU due to trans-fat content.',
  sources: [
    {
      label: 'EFSA — Dietary fats and cardiovascular disease (2010)',
      url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2010.1461',
    },
    {
      label: 'Harvard T.H. Chan — Fats and Cholesterol',
      url: 'https://www.hsph.harvard.edu/nutritionsource/what-should-you-eat/fats-and-cholesterol/',
    },
    {
      label: 'EU Regulation 2019/649 — Trans fat limits',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019R0649',
    },
  ],
}

/**
 * Returns the SEED_OIL_FLAG object if any seed oil term is found in the
 * ingredients text, or null otherwise.
 * @param {string} ingredientsText  Lower-cased ingredients string from Open Food Facts
 * @param {string[]} ingredientsTags  ingredients_tags array from Open Food Facts
 * @returns {object|null}
 */
export function detectSeedOils(ingredientsText = '', ingredientsTags = []) {
  const text = ingredientsText.toLowerCase()
  const tags = ingredientsTags.map(t => t.toLowerCase())
  const found = SEED_OIL_TERMS.some(
    term => text.includes(term) || tags.some(tag => tag.includes(term.replace(/ /g, '-')))
  )
  if (!found) return null
  // Detect which specific ones are present for a richer label
  const detected = SEED_OIL_TERMS.filter(term =>
    text.includes(term) || tags.some(tag => tag.includes(term.replace(/ /g, '-')))
  )
  return {
    ...SEED_OIL_FLAG,
    detected,
  }
}
