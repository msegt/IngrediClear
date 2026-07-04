// Ingredient safety database compiled from EWG Skin Deep public summaries,
// EU CosIng database (open access), IARC classifications, and EU Cosmetics Regulation 1223/2009.
// hazardScore approximates EWG 1-10 scale.

const HARMFUL_INGREDIENTS = [
  {
    names: ['formaldehyde', 'formalin', 'methanal'],
    concern: 'Known human carcinogen (IARC Group 1). Classified as a proven cause of leukaemia and nasopharyngeal cancer. Banned in cosmetics in Japan, Sweden, and restricted by EU Cosmetics Regulation.',
    hazardScore: 10,
    alternatives: 'Look for products preserved with sodium benzoate, potassium sorbate, or vitamin E (tocopherol).'
  },
  {
    names: ['parabens', 'methylparaben', 'ethylparaben', 'propylparaben', 'butylparaben', 'isobutylparaben', 'isopropylparaben'],
    concern: 'Suspected endocrine disruptors. Longer-chain parabens (butylparaben, propylparaben) are restricted in EU cosmetics. Short-chain parabens (methyl, ethyl) are considered lower risk by the EU Scientific Committee on Consumer Safety (SCCS).',
    hazardScore: 6,
    alternatives: 'Phenoxyethanol, sodium benzoate, potassium sorbate, or naturally preserved formulas.'
  },
  {
    names: ['sodium lauryl sulfate', 'sls', 'sodium laureth sulfate', 'sles'],
    concern: 'Harsh surfactant that can strip the skin barrier and cause dryness or irritation, particularly in sensitive skin. SLES may contain trace 1,4-dioxane (IARC Group 2A: probable carcinogen) as a manufacturing by-product.',
    hazardScore: 5,
    alternatives: 'Cocamidopropyl betaine, sodium cocoyl isethionate, or decyl glucoside — gentler plant-derived surfactants.'
  },
  {
    names: ['phthalates', 'dibutyl phthalate', 'diethylhexyl phthalate', 'dimethyl phthalate'],
    concern: 'Reproductive and developmental toxins in animal studies. Dibutyl phthalate and DEHP are banned in EU cosmetics. Often present in products listing only "fragrance" without full disclosure.',
    hazardScore: 8,
    alternatives: 'Choose phthalate-free nail polishes; look for "fragrance-free" or products that disclose all fragrance ingredients.'
  },
  {
    names: ['triclosan', 'triclocarban'],
    concern: 'Disrupts thyroid hormone signalling in animal studies; contributes to antibiotic resistance. Banned in OTC antiseptic wash products in the US (FDA 2016). Restricted to ≤0.3% in specific rinse-off cosmetics in the EU.',
    hazardScore: 8,
    alternatives: 'Plain soap and water is equally effective for hand hygiene. Ethanol-based sanitisers where needed.'
  },
  {
    names: ['oxybenzone', 'benzophenone-3'],
    concern: 'UV filter that penetrates skin and has been detected in blood, urine, and breast milk at low concentrations. Classified as a potential endocrine disruptor by the EU SCCS. Restricted in EU sunscreens to ≤6% (face/body) or ≤0.5% (spray products).',
    hazardScore: 7,
    alternatives: 'Mineral sunscreens with zinc oxide or titanium dioxide remain on the skin surface and do not penetrate.'
  },
  {
    names: ['hydroquinone'],
    concern: 'High concentrations can cause irreversible skin darkening (exogenous ochronosis). Classified as a possible carcinogen (IARC 2A). Banned in cosmetics sold to consumers in the EU; available only on prescription.',
    hazardScore: 9,
    alternatives: 'Kojic acid, niacinamide, alpha-arbutin, or azelaic acid for skin brightening — all with better safety profiles.'
  },
  {
    names: ['coal tar'],
    concern: 'Proven human carcinogen (IARC Group 1). Found in some dandruff shampoos and hair dyes. Prohibited in EU cosmetics except in hair dye products at strictly regulated concentrations.',
    hazardScore: 9,
    alternatives: 'Zinc pyrithione or selenium sulfide shampoos for dandruff; ammonia-free synthetic hair dyes without coal tar derivatives.'
  },
  {
    names: ['lead acetate', 'lead'],
    concern: 'Neurotoxic heavy metal. There is no safe level of lead exposure — it accumulates in bone tissue over a lifetime and impairs neurological development. Found in some hair dyes. Banned in cosmetics in the EU and US.',
    hazardScore: 10,
    alternatives: 'Henna-based hair dyes or modern ammonia-free synthetic dyes without metallic salts.'
  },
  {
    names: ['mercury', 'thimerosal', 'mercuric chloride'],
    concern: 'Potent neurotoxin that bioaccumulates in organs and the nervous system. Still found in some skin-lightening creams sold outside regulated markets. Banned in cosmetics in the EU and US.',
    hazardScore: 10,
    alternatives: 'Regulated, mercury-free products; niacinamide or vitamin C for brightening.'
  },
  {
    names: ['petroleum', 'petrolatum', 'mineral oil', 'paraffinum liquidum'],
    concern: 'Cosmetic-grade (fully refined) petrolatum is considered safe by the EU and FDA. Lower-grade or inadequately refined mineral oils may contain carcinogenic polycyclic aromatic hydrocarbons (PAHs). Refining quality is key.',
    hazardScore: 2,
    alternatives: 'Shea butter, coconut oil, jojoba oil, or squalane as natural occlusives if you prefer to avoid petroleum derivatives.'
  },
  {
    names: ['butylated hydroxyanisole', 'bha'],
    concern: 'BHA is classified as a possible human carcinogen (IARC Group 2B) and a suspected endocrine disruptor. Restricted in EU cosmetics under Annex III.',
    hazardScore: 7,
    alternatives: 'Vitamin E (tocopherol) or rosemary extract as natural antioxidant preservatives.'
  },
  {
    names: ['dmdm hydantoin', 'imidazolidinyl urea', 'diazolidinyl urea', 'quaternium-15', 'bronopol', '2-bromo-2-nitropropane-1,3-diol'],
    concern: 'Formaldehyde-releasing preservatives. These compounds slowly release formaldehyde during storage. Formaldehyde is a known human carcinogen (IARC Group 1) and a common skin sensitiser.',
    hazardScore: 8,
    alternatives: 'Products preserved with phenoxyethanol + ethylhexylglycerin, or naturally preserved formulas.'
  },
  {
    names: ['talc'],
    concern: 'Cosmetic-grade talc certified free of asbestos is considered safe by regulators. Non-cosmetic-grade talc may contain asbestos fibres. Perineal (genital) use of talc-based powders has been associated with a modestly increased ovarian cancer risk in some epidemiological studies, though causality is not definitively established.',
    hazardScore: 4,
    alternatives: 'Cornstarch or arrowroot powder in body powders. Avoid use in the genital area as a precaution.'
  },
  {
    names: ['cyclomethicone', 'cyclotetrasiloxane', 'd4', 'cyclopentasiloxane', 'd5', 'cyclohexasiloxane', 'd6'],
    concern: 'Cyclic siloxanes D4 and D5 are persistent, bioaccumulative environmental pollutants and suspected endocrine disruptors. D4 and D5 are prohibited in rinse-off cosmetics (>0.1%) in the EU under REACH regulation.',
    hazardScore: 6,
    alternatives: 'Linear dimethicone (lower environmental concern) or plant-based emollients such as squalane or jojoba esters.'
  }
]

const ALLERGEN_INGREDIENTS = [
  'linalool','limonene','citronellol','geraniol','eugenol','coumarin',
  'cinnamal','cinnamyl alcohol','isoeugenol','benzyl alcohol','benzyl salicylate',
  'benzyl benzoate','benzyl cinnamate','amyl cinnamal','amylcinnamyl alcohol',
  'anise alcohol','benzaldehyde','citral','farnesol','hexyl cinnamal',
  'hydroxycitronellal','isomethyl ionone','lilial','lyral','methyl 2-octynoate',
  'oak moss extract','tree moss extract','alpha-isomethyl ionone',
  'butylphenyl methylpropional','propolis','lanolin','wool wax',
  'fragrance','parfum','aroma'
]

const CAUTION_INGREDIENTS = [
  {
    names: ['alcohol denat', 'denatured alcohol', 'sd alcohol'],
    concern: 'Can cause dryness and irritation in sensitive or compromised skin with repeated use. Generally well tolerated at typical cosmetic concentrations in intact skin.',
    hazardScore: 3,
    alternatives: 'Fatty alcohols (cetyl alcohol, stearyl alcohol) are non-drying and skin-compatible alternatives.'
  },
  {
    names: ['retinol', 'retinyl palmitate', 'retinyl acetate'],
    concern: 'Increases photosensitivity — daily SPF use is essential. High-dose prescription retinoids are teratogenic; cosmetic retinol concentrations are much lower, but precautionary avoidance during pregnancy is widely advised.',
    hazardScore: 3,
    alternatives: 'Bakuchiol is a plant-derived alternative with comparable anti-ageing evidence, lower irritation, and considered safe in pregnancy.'
  },
  {
    names: ['glycolic acid', 'lactic acid', 'alpha hydroxy acid', 'aha'],
    concern: 'Chemical exfoliants that increase UV sensitivity by thinning the outer skin layer. Can cause stinging, peeling, or post-inflammatory hyperpigmentation if overused, especially in darker skin tones.',
    hazardScore: 3,
    alternatives: 'Use SPF 30+ daily. Start with concentrations ≤8%. PHAs (polyhydroxy acids) are gentler and suitable for sensitive skin.'
  },
  {
    names: ['salicylic acid', 'beta hydroxy acid'],
    concern: 'Can cause irritation or dryness at concentrations above 2%. Systemic absorption from high-concentration or large-area use is a theoretical concern in pregnancy; precautionary avoidance of high-dose products is advised.',
    hazardScore: 3,
    alternatives: 'Willow bark extract (lower-concentration natural source); niacinamide for pore-minimising effects without exfoliation.'
  },
  {
    names: ['phenoxyethanol'],
    concern: 'Widely used preservative considered safe by the EU SCCS at up to 1%. Can cause allergic contact reactions in a small proportion of individuals. France advises against use in leave-on products for children under 3.',
    hazardScore: 3,
    alternatives: 'Generally one of the safer synthetic preservatives available. Ethylhexylglycerin is often used alongside it to reduce the required concentration.'
  },
  {
    names: ['methylisothiazolinone', 'mi', 'methylchloroisothiazolinone', 'mci'],
    concern: 'A potent skin sensitiser and one of the most common causes of allergic contact dermatitis in Europe. MI is banned in EU leave-on cosmetics (since 2014) and restricted to 0.0015% (15 ppm) in rinse-off products.',
    hazardScore: 7,
    alternatives: 'Products preserved with phenoxyethanol, sodium benzoate, or natural preservation systems.'
  },
  {
    names: ['titanium dioxide'],
    concern: 'Safe and effective UV filter in solid (non-nano) form. Nano-form titanium dioxide is classified as a possible carcinogen (IARC 2B) when inhaled. Risk is specific to spray/powder formats; cream and lotion formulations pose no inhalation risk.',
    hazardScore: 2,
    alternatives: 'Choose lotion or cream sunscreen formats over sprays or loose powders. Non-nano zinc oxide is an alternative mineral UV filter.'
  },
  {
    names: ['essential oils', 'tea tree oil', 'lavender oil', 'peppermint oil', 'eucalyptus oil', 'clove oil'],
    concern: 'Natural origin does not imply safety. Essential oils are among the most frequent causes of allergic contact dermatitis in cosmetics. Certain oils (e.g. clove, cinnamon) are strong irritants even at low concentrations.',
    hazardScore: 4,
    alternatives: 'Fragrance-free formulations, or products scented only with fully disclosed, low-allergen aromatic compounds.'
  }
]

function normalise(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ').trim()
}

export function parseIngredients(text) {
  if (!text) return []
  return text
    .split(/[,;]/)
    .map(s => s.replace(/[*·•\[\]()]/g, '').trim())
    .filter(s => s.length > 1)
}

export function analyseIngredients(text) {
  const rawIngredients = parseIngredients(text)
  return rawIngredients.map(raw => {
    const norm = normalise(raw)

    for (const entry of HARMFUL_INGREDIENTS) {
      if (entry.names.some(n => norm.includes(normalise(n)))) {
        return { name: raw, rating: 'harmful', isAllergen: false, concern: entry.concern, hazardScore: entry.hazardScore, alternatives: entry.alternatives }
      }
    }

    const isAllergen = ALLERGEN_INGREDIENTS.some(a => norm.includes(normalise(a)))

    for (const entry of CAUTION_INGREDIENTS) {
      if (entry.names.some(n => norm.includes(normalise(n)))) {
        return { name: raw, rating: 'caution', isAllergen, concern: entry.concern, hazardScore: entry.hazardScore, alternatives: entry.alternatives }
      }
    }

    if (isAllergen) {
      return { name: raw, rating: 'caution', isAllergen: true, concern: 'Listed EU fragrance allergen (Cosmetics Regulation Annex III). Must be declared on labels above 0.01% in leave-on and 0.1% in rinse-off products. May cause allergic reactions in sensitised individuals.', hazardScore: 4, alternatives: 'Choose fragrance-free products or those that fully disclose individual fragrance components.' }
    }

    return { name: raw, rating: 'safe', isAllergen: false, concern: null, hazardScore: null, alternatives: null }
  })
}
