// Heavy metal risk in food — category-level heuristics
// Sources:
// - EFSA: https://www.efsa.europa.eu/en/topics/topic/contaminants-food-chain
// - FDA: https://www.fda.gov/food/environmental-contaminants-food
// - WHO: https://www.who.int/news-room/fact-sheets/detail/chemical-contaminants-in-food

// Each entry: category pattern → metal risk
const HEAVY_METAL_RISKS = [
  {
    pattern: 'rice',
    metal: 'Inorganic arsenic',
    detail:
      'Rice and rice-based products are a significant dietary source of inorganic arsenic, ' +
      'which IARC classifies as a Group 1 carcinogen. EFSA recommends varying starchy food intake ' +
      'and not relying on rice as the sole staple, particularly for infants.',
    sources: [
      { label: 'EFSA — Inorganic arsenic in food (2014)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2014.3597' },
      { label: 'IARC Monograph — Arsenic (Group 1)', url: 'https://monographs.iarc.who.int/list-of-classifications/' },
    ],
  },
  {
    pattern: 'tuna',
    metal: 'Methylmercury',
    detail:
      'Tuna (especially albacore/bluefin) accumulates methylmercury via bioaccumulation. ' +
      'EFSA and FDA advise limiting consumption for pregnant women, nursing mothers, and young children. ' +
      'Canned light tuna generally has lower mercury levels than canned white/albacore tuna.',
    sources: [
      { label: 'EFSA — Mercury in food: risks for human health (2012)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2012.2985' },
      { label: 'FDA — Advice about eating fish (mercury)', url: 'https://www.fda.gov/food/consumers/advice-about-eating-fish' },
    ],
  },
  {
    pattern: 'swordfish',
    metal: 'Methylmercury',
    detail:
      'Swordfish is among the highest-mercury fish. EFSA advises pregnant women and young children to avoid it entirely, ' +
      'and other adults to limit consumption to one portion per week.',
    sources: [
      { label: 'EFSA — Mercury in food (2012)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2012.2985' },
    ],
  },
  {
    pattern: 'shark',
    metal: 'Methylmercury',
    detail:
      'Shark accumulates high levels of methylmercury. EFSA and FDA advise pregnant women and children to avoid consumption entirely.',
    sources: [
      { label: 'FDA — Advice about eating fish (mercury)', url: 'https://www.fda.gov/food/consumers/advice-about-eating-fish' },
    ],
  },
  {
    pattern: 'spinach',
    metal: 'Cadmium & Lead',
    detail:
      'Leafy vegetables such as spinach can accumulate cadmium and lead from soil. ' +
      'EFSA has set tolerable weekly intakes (TWIs) for both metals. ' +
      'EU Maximum Levels apply to commercially sold products (Regulation 2023/915).',
    sources: [
      { label: 'EFSA — Cadmium in food (2012)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2012.2551' },
      { label: 'EU Regulation 2023/915 — Maximum levels of contaminants', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R0915' },
    ],
  },
  {
    pattern: 'cocoa',
    metal: 'Cadmium & Lead',
    detail:
      'Cocoa and dark chocolate are among the major dietary sources of cadmium in Europe (EFSA, 2012). ' +
      'Lead contamination can also occur during processing. ' +
      'EU MRLs apply, but regular heavy consumption of dark chocolate may exceed tolerable intakes for cadmium.',
    sources: [
      { label: 'EFSA — Cadmium in food (2012)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2012.2551' },
      { label: 'Consumer Reports — Lead and cadmium in dark chocolate (2023)', url: 'https://www.consumerreports.org/health/food-safety/a-lot-of-chocolate-is-contaminated-with-lead-and-cadmium/' },
    ],
  },
  {
    pattern: 'chocolate',
    metal: 'Cadmium & Lead',
    detail:
      'Cocoa and dark chocolate are among the major dietary sources of cadmium in Europe (EFSA, 2012). ' +
      'Lead contamination can also occur during processing. ' +
      'EU MRLs apply, but regular heavy consumption of dark chocolate may exceed tolerable intakes for cadmium.',
    sources: [
      { label: 'EFSA — Cadmium in food (2012)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2012.2551' },
      { label: 'Consumer Reports — Lead and cadmium in dark chocolate (2023)', url: 'https://www.consumerreports.org/health/food-safety/a-lot-of-chocolate-is-contaminated-with-lead-and-cadmium/' },
    ],
  },
  {
    pattern: 'seaweed',
    metal: 'Inorganic arsenic & Iodine excess',
    detail:
      'Seaweed can contain very high levels of inorganic arsenic (especially hijiki) and iodine. ' +
      'EFSA advises against consuming hijiki seaweed. Excessive iodine from seaweed may disrupt thyroid function.',
    sources: [
      { label: 'EFSA — Iodine in seaweed (2018)', url: 'https://www.efsa.europa.eu/en/efsajournal/pub/5239' },
      { label: 'FSA UK — Seaweed and arsenic', url: 'https://www.food.gov.uk/safety-hygiene/chemical-contaminants' },
    ],
  },
]

/**
 * Returns heavy metal risk flags for a food product.
 * @param {string[]} categoriesTags  categories_tags from Open Food Facts
 * @param {string}   ingredientsText  lower-cased ingredients string
 * @returns {Array<{metal, detail, sources, label}>}
 */
export function detectHeavyMetalRisks(categoriesTags = [], ingredientsText = '') {
  const tags = categoriesTags.map(t => t.toLowerCase())
  const text = ingredientsText.toLowerCase()

  const matched = []
  const seen = new Set()

  HEAVY_METAL_RISKS.forEach(risk => {
    const key = risk.metal
    if (seen.has(key)) return
    const found =
      tags.some(tag => tag.includes(risk.pattern)) ||
      text.includes(risk.pattern)
    if (found) {
      seen.add(key)
      matched.push({
        label: `⚠️ Heavy metal risk: ${risk.metal}`,
        metal: risk.metal,
        detail: risk.detail,
        sources: risk.sources,
      })
    }
  })

  return matched
}
