// Ingredient safety database compiled from EWG Skin Deep public summaries
// and EU CosIng database (open access). Ratings: harmful | caution | safe

const HARMFUL_INGREDIENTS = [
  { names: ['formaldehyde', 'formalin', 'methanal'], concern: 'Known carcinogen. Linked to leukemia and nasopharyngeal cancer.' },
  { names: ['parabens', 'methylparaben', 'ethylparaben', 'propylparaben', 'butylparaben', 'isobutylparaben', 'isopropylparaben'], concern: 'Endocrine disruptors. May mimic oestrogen and disrupt hormonal function.' },
  { names: ['sodium lauryl sulfate', 'sls', 'sodium laureth sulfate', 'sles'], concern: 'Skin irritant. Can strip natural oils, cause dryness and irritation.' },
  { names: ['phthalates', 'dibutyl phthalate', 'diethylhexyl phthalate', 'dimethyl phthalate', 'deh'], concern: 'Endocrine disruptors linked to reproductive toxicity.' },
  { names: ['triclosan', 'triclocarban'], concern: 'Disrupts thyroid hormones. Environmental pollutant. Banned in some countries.' },
  { names: ['oxybenzone', 'benzophenone-3'], concern: 'Hormone disruptor found in sunscreens. Penetrates skin and detected in blood.' },
  { names: ['hydroquinone'], concern: 'Linked to ochronosis (skin darkening) and classified as a possible carcinogen.' },
  { names: ['resorcinol'], concern: 'Endocrine disruptor. Toxic to aquatic organisms.' },
  { names: ['coal tar'], concern: 'Known human carcinogen used in some hair dyes and dandruff shampoos.' },
  { names: ['lead acetate', 'lead'], concern: 'Neurotoxic heavy metal. Accumulates in the body.' },
  { names: ['mercury', 'thimerosal', 'mercuric chloride'], concern: 'Neurotoxin. Causes kidney and immune system damage.' },
  { names: ['petroleum', 'petrolatum', 'mineral oil', 'paraffinum liquidum'], concern: 'Potentially contaminated with PAHs (polycyclic aromatic hydrocarbons), possible carcinogens.' },
  { names: ['butylated hydroxyanisole', 'bha', 'butylated hydroxytoluene', 'bht'], concern: 'Possible carcinogen. Endocrine disruptor at high doses.' },
  { names: ['polyethylene glycol', 'peg'], concern: 'May be contaminated with 1,4-dioxane, a possible carcinogen.' },
  { names: ['ethoxylated ingredients', '1,4-dioxane'], concern: 'Byproduct of ethoxylation process. Possible carcinogen.' },
  { names: ['toluene'], concern: 'Neurotoxin found in nail polishes. Reproductive and developmental toxin.' },
  { names: ['formaldehyde-releasing preservatives', 'dmdm hydantoin', 'imidazolidinyl urea', 'diazolidinyl urea', 'quaternium-15', 'bronopol', '2-bromo-2-nitropropane-1,3-diol'], concern: 'Releases formaldehyde slowly. Potential carcinogen and skin sensitiser.' },
  { names: ['benzalkonium chloride'], concern: 'Skin and respiratory irritant. Can trigger asthma attacks.' },
  { names: ['styrene', 'polystyrene'], concern: 'Possible carcinogen. Neurotoxin.' },
  { names: ['talc'], concern: 'May contain asbestos fibres. Linked to ovarian cancer in studies.' },
  { names: ['siloxanes', 'cyclomethicone', 'cyclotetrasiloxane', 'd4', 'cyclopentasiloxane', 'd5'], concern: 'Endocrine disruptors. Persistent environmental pollutants.' },
  { names: ['pfas', 'perfluorooctanoic acid', 'ptfe'], concern: 'Forever chemicals. Accumulate in the body and environment.' }
]

// EU 26 listed fragrance allergens (Annex III, Cosmetics Regulation) + extras
const ALLERGEN_INGREDIENTS = [
  'linalool', 'limonene', 'citronellol', 'geraniol', 'eugenol', 'coumarin',
  'cinnamal', 'cinnamyl alcohol', 'isoeugenol', 'benzyl alcohol', 'benzyl salicylate',
  'benzyl benzoate', 'benzyl cinnamate', 'amyl cinnamal', 'amylcinnamyl alcohol',
  'anise alcohol', 'benzaldehyde', 'citral', 'farnesol', 'hexyl cinnamal',
  'hydroxycitronellal', 'hydroxymethylpentylcyclohexenecarboxaldehyde', 'isomethyl ionone',
  'lilial', 'lyral', 'methyl heptin carbonate', 'methyl 2-octynoate',
  'oak moss extract', 'tree moss extract', 'alpha-isomethyl ionone',
  'butylphenyl methylpropional', 'propolis', 'lanolin', 'wool wax',
  'fragrance', 'parfum', 'aroma'
]

const CAUTION_INGREDIENTS = [
  { names: ['alcohol denat', 'denatured alcohol', 'sd alcohol'], concern: 'Can dry and irritate sensitive skin with prolonged use.' },
  { names: ['retinol', 'retinyl palmitate', 'retinyl acetate'], concern: 'Can increase sun sensitivity. Not recommended during pregnancy.' },
  { names: ['alpha hydroxy acid', 'aha', 'glycolic acid', 'lactic acid', 'citric acid'], concern: 'Increases photosensitivity. Use SPF when applying.' },
  { names: ['beta hydroxy acid', 'bha', 'salicylic acid'], concern: 'Can cause irritation. Avoid during pregnancy in high concentrations.' },
  { names: ['niacinamide'], concern: 'Generally safe but may cause flushing at high concentrations (>4%).' },
  { names: ['essential oils', 'tea tree oil', 'lavender oil', 'peppermint oil', 'eucalyptus oil'], concern: 'Can cause allergic contact dermatitis in sensitive individuals.' },
  { names: ['phenoxyethanol'], concern: 'Mild preservative. Can cause allergic reactions; restricted in products for infants in some countries.' },
  { names: ['methylisothiazolinone', 'mi', 'methylchloroisothiazolinone', 'mci'], concern: 'Common allergen. Banned in rinse-off products in EU.' },
  { names: ['cocamidopropyl betaine'], concern: 'Mild surfactant that can cause contact dermatitis in some people.' },
  { names: ['titanium dioxide'], concern: 'Generally safe in solid form; inhalation of nanoparticles may be hazardous.' }
]

function normalise(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseIngredients(text) {
  if (!text) return []
  // Split on commas, semicolons, and common separators
  return text
    .split(/[,;]/)
    .map(s => s.replace(/[*·•\[\]()]/g, '').trim())
    .filter(s => s.length > 1)
}

export function analyseIngredients(text) {
  const rawIngredients = parseIngredients(text)

  return rawIngredients.map(raw => {
    const norm = normalise(raw)

    // Check harmful
    for (const entry of HARMFUL_INGREDIENTS) {
      if (entry.names.some(n => norm.includes(normalise(n)))) {
        return {
          name: raw,
          rating: 'harmful',
          isAllergen: false,
          concern: entry.concern
        }
      }
    }

    // Check allergens
    const isAllergen = ALLERGEN_INGREDIENTS.some(a => norm.includes(normalise(a)))

    // Check caution
    for (const entry of CAUTION_INGREDIENTS) {
      if (entry.names.some(n => norm.includes(normalise(n)))) {
        return {
          name: raw,
          rating: 'caution',
          isAllergen,
          concern: entry.concern
        }
      }
    }

    if (isAllergen) {
      return {
        name: raw,
        rating: 'caution',
        isAllergen: true,
        concern: 'Listed EU fragrance allergen. May cause allergic reactions in sensitive individuals.'
      }
    }

    // Safe / unclassified
    return {
      name: raw,
      rating: 'safe',
      isAllergen: false,
      concern: null
    }
  })
}
