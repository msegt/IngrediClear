// Ingredient safety database compiled from EWG Skin Deep public summaries
// and EU CosIng database (open access). hazardScore approximates EWG 1-10 scale.

const HARMFUL_INGREDIENTS = [
  {
    names: ['formaldehyde', 'formalin', 'methanal'],
    concern: 'Known carcinogen (IARC Group 1). Linked to leukaemia and nasopharyngeal cancer. Banned in cosmetics in Japan and Sweden.',
    hazardScore: 10,
    alternatives: 'Look for products preserved with sodium benzoate, potassium sorbate, or vitamin E (tocopherol).'
  },
  {
    names: ['parabens', 'methylparaben', 'ethylparaben', 'propylparaben', 'butylparaben', 'isobutylparaben', 'isopropylparaben'],
    concern: 'Endocrine disruptors. Mimic oestrogen and have been detected in breast tumour tissue. Longer-chain parabens (butyl/propyl) are most concerning.',
    hazardScore: 7,
    alternatives: 'Phenoxyethanol (mild), sodium benzoate, potassium sorbate, or naturally preserved formulas.'
  },
  {
    names: ['sodium lauryl sulfate', 'sls', 'sodium laureth sulfate', 'sles'],
    concern: 'Harsh surfactant that strips the skin barrier, causes dryness and irritation. SLES may be contaminated with 1,4-dioxane (a possible carcinogen).',
    hazardScore: 6,
    alternatives: 'Cocamidopropyl betaine, sodium cocoyl isethionate, or decyl glucoside — gentler plant-derived surfactants.'
  },
  {
    names: ['phthalates', 'dibutyl phthalate', 'diethylhexyl phthalate', 'dimethyl phthalate'],
    concern: 'Reproductive and developmental toxins. Linked to hormone disruption in males. Often hidden under the word "fragrance".',
    hazardScore: 8,
    alternatives: 'Choose phthalate-free nail polishes; look for "fragrance-free" or products that disclose all fragrance ingredients.'
  },
  {
    names: ['triclosan', 'triclocarban'],
    concern: 'Disrupts thyroid hormones; contributes to antibiotic resistance. Banned in OTC antiseptics in the US and restricted in the EU.',
    hazardScore: 8,
    alternatives: 'Plain soap and water is equally effective. Ethanol-based sanitisers for hand hygiene.'
  },
  {
    names: ['oxybenzone', 'benzophenone-3'],
    concern: 'UV filter that penetrates skin and has been detected in blood, urine and breast milk. Potential hormone disruptor. Toxic to coral reefs.',
    hazardScore: 8,
    alternatives: 'Mineral sunscreens with zinc oxide or titanium dioxide — stay on skin surface and do not penetrate.'
  },
  {
    names: ['hydroquinone'],
    concern: 'Can cause permanent skin darkening (ochronosis) with long-term use. Classified as a possible carcinogen. Prescription-only in the EU.',
    hazardScore: 9,
    alternatives: 'Kojic acid, niacinamide, alpha-arbutin, or azelaic acid for skin brightening.'
  },
  {
    names: ['coal tar'],
    concern: 'Known human carcinogen. Used in some dandruff shampoos and hair dyes. Banned in cosmetics in the EU except at very low concentrations.',
    hazardScore: 9,
    alternatives: 'Zinc pyrithione or selenium sulfide shampoos for dandruff; natural hair dyes.'
  },
  {
    names: ['lead acetate', 'lead'],
    concern: 'Neurotoxic heavy metal with no safe level of exposure. Accumulates in bone over a lifetime. Found in some hair dyes.',
    hazardScore: 10,
    alternatives: 'Henna-based hair dyes or modern ammonia-free synthetic dyes without metallic salts.'
  },
  {
    names: ['mercury', 'thimerosal', 'mercuric chloride'],
    concern: 'Potent neurotoxin. Bioaccumulates in organs. Still found in some skin-lightening creams. Banned in cosmetics in the EU and US.',
    hazardScore: 10,
    alternatives: 'Regulated, mercury-free skin tone products; niacinamide or vitamin C for brightening.'
  },
  {
    names: ['petroleum', 'petrolatum', 'mineral oil', 'paraffinum liquidum'],
    concern: 'Cosmetic-grade petrolatum is considered safe, but lower grades may be contaminated with PAHs (polycyclic aromatic hydrocarbons). Source and refining quality matter.',
    hazardScore: 4,
    alternatives: 'Shea butter, coconut oil, jojoba oil, or squalane as natural occlusives.'
  },
  {
    names: ['butylated hydroxyanisole', 'bha'],
    concern: 'BHA is listed as a possible human carcinogen (IARC 2B). Endocrine disruptor. Restricted in EU cosmetics.',
    hazardScore: 7,
    alternatives: 'Vitamin E (tocopherol) or rosemary extract as natural antioxidant preservatives.'
  },
  {
    names: ['dmdm hydantoin', 'imidazolidinyl urea', 'diazolidinyl urea', 'quaternium-15', 'bronopol', '2-bromo-2-nitropropane-1,3-diol'],
    concern: 'Formaldehyde-releasing preservatives. Slowly release formaldehyde in the product, a known carcinogen and skin sensitiser.',
    hazardScore: 8,
    alternatives: 'Products preserved with phenoxyethanol + ethylhexylglycerin, or naturally preserved formulas.'
  },
  {
    names: ['talc'],
    concern: 'Naturally occurring mineral that may contain asbestos fibres if not cosmetic-grade certified. Associated with ovarian cancer risk in perineal use.',
    hazardScore: 5,
    alternatives: 'Cornstarch, arrowroot powder, or certified asbestos-free talc alternatives in body powders.'
  },
  {
    names: ['cyclomethicone', 'cyclotetrasiloxane', 'd4', 'cyclopentasiloxane', 'd5', 'cyclohexasiloxane', 'd6'],
    concern: 'Cyclic siloxanes are persistent environmental pollutants and suspected endocrine disruptors. D4 and D5 restricted in rinse-off cosmetics in the EU.',
    hazardScore: 6,
    alternatives: 'Dimethicone (linear silicone — lower risk) or plant-based silicone alternatives like Silicone-Free Dimethyl.'
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
    concern: 'Can dry and irritate sensitive or compromised skin with prolonged use.',
    hazardScore: 3,
    alternatives: 'Fatty alcohols (cetyl, stearyl) are skin-compatible; look for low alcohol concentrations.'
  },
  {
    names: ['retinol', 'retinyl palmitate', 'retinyl acetate'],
    concern: 'Increases photosensitivity — always use SPF during the day. Avoid during pregnancy at therapeutic doses.',
    hazardScore: 3,
    alternatives: 'Bakuchiol is a plant-derived retinol alternative safe during pregnancy and less irritating.'
  },
  {
    names: ['glycolic acid', 'lactic acid', 'alpha hydroxy acid', 'aha'],
    concern: 'Exfoliating acids increase sun sensitivity. Can cause stinging or peeling if overused.',
    hazardScore: 3,
    alternatives: 'Use SPF daily. Start with low concentrations (5–8%). PHAs (polyhydroxy acids) are gentler for sensitive skin.'
  },
  {
    names: ['salicylic acid', 'beta hydroxy acid', 'bha'],
    concern: 'Can cause irritation at high concentrations. High doses are not recommended during pregnancy.',
    hazardScore: 3,
    alternatives: 'Willow bark extract (lower concentration natural source); niacinamide for pore minimising.'
  },
  {
    names: ['phenoxyethanol'],
    concern: 'Mild preservative, generally well tolerated. Can cause allergic reactions in some individuals. Restricted in leave-on products for infants under 3 in France.',
    hazardScore: 3,
    alternatives: 'Generally considered one of the safer synthetic preservatives; multi-functional alternatives include ethylhexylglycerin.'
  },
  {
    names: ['methylisothiazolinone', 'mi', 'methylchloroisothiazolinone', 'mci'],
    concern: 'Common skin sensitiser and allergen. Banned in EU leave-on cosmetics since 2014; restricted in rinse-off products.',
    hazardScore: 7,
    alternatives: 'Products preserved with phenoxyethanol, sodium benzoate or natural preservative systems.'
  },
  {
    names: ['titanium dioxide'],
    concern: 'Safe in solid form as a UV filter. Concerns arise around nano-sized particles in sprays that may be inhaled.',
    hazardScore: 2,
    alternatives: 'Non-spray sunscreen formats using non-nano titanium dioxide or zinc oxide are safest.'
  },
  {
    names: ['essential oils', 'tea tree oil', 'lavender oil', 'peppermint oil', 'eucalyptus oil', 'clove oil'],
    concern: 'Natural does not mean safe — essential oils are among the most common causes of allergic contact dermatitis.',
    hazardScore: 4,
    alternatives: 'Fragrance-free formulations or products scented only with listed, allergen-free aromatic compounds.'
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
      return { name: raw, rating: 'caution', isAllergen: true, concern: 'Listed EU fragrance allergen (Annex III). May cause allergic reactions in sensitive individuals.', hazardScore: 4, alternatives: 'Choose fragrance-free products or those that fully disclose individual fragrance components.' }
    }

    return { name: raw, rating: 'safe', isAllergen: false, concern: null, hazardScore: null, alternatives: null }
  })
}
