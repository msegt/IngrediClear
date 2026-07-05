// Ingredient safety database compiled from:
// - EU CosIng database (open access): https://ec.europa.eu/growth/tools-databases/cosing/
// - EU Cosmetics Regulation 1223/2009: https://eur-lex.europa.eu/eli/reg/2009/1223/oj
// - IARC Monographs: https://monographs.iarc.who.int/
// - EU Scientific Committee on Consumer Safety (SCCS): https://health.ec.europa.eu/scientific-committees/scientific-committee-consumer-safety-sccs_en
// - EWG Skin Deep (indicative hazard scores): https://www.ewg.org/skindeep/

import { getIngredientDescription } from './ingredientDescriptions.js'

const HARMFUL_INGREDIENTS = [
  {
    names: ['formaldehyde', 'formalin', 'methanal'],
    concern: 'Known human carcinogen (IARC Group 1). Classified as a proven cause of leukaemia and nasopharyngeal cancer. Banned in cosmetics in Japan, Sweden, and restricted by EU Cosmetics Regulation Annex II.',
    hazardScore: 10,
    alternatives: 'Look for products preserved with sodium benzoate, potassium sorbate, or vitamin E (tocopherol).',
    sources: [
      { label: 'IARC Monograph Vol. 100F — Formaldehyde', url: 'https://monographs.iarc.who.int/list-of-classifications/' },
      { label: 'EU Cosmetics Regulation 1223/2009 — Annex II (prohibited substances)', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' }
    ]
  },
  {
    names: ['parabens', 'methylparaben', 'ethylparaben', 'propylparaben', 'butylparaben', 'isobutylparaben', 'isopropylparaben'],
    concern: 'Suspected endocrine disruptors. Longer-chain parabens (butylparaben, propylparaben) are restricted in EU cosmetics. Short-chain parabens (methyl, ethyl) are considered lower risk by the EU Scientific Committee on Consumer Safety (SCCS).',
    hazardScore: 6,
    alternatives: 'Phenoxyethanol, sodium benzoate, potassium sorbate, or naturally preserved formulas.',
    sources: [
      { label: 'SCCS Opinion on parabens (2013)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_132.pdf' },
      { label: 'EU Cosmetics Regulation 1223/2009 — Annex V (restricted preservatives)', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' }
    ]
  },
  {
    names: ['sodium lauryl sulfate', 'sls', 'sodium laureth sulfate', 'sles'],
    concern: 'Harsh surfactant that can strip the skin barrier and cause dryness or irritation, particularly in sensitive skin. SLES may contain trace 1,4-dioxane (IARC Group 2A: probable carcinogen) as a manufacturing by-product.',
    hazardScore: 5,
    alternatives: 'Cocamidopropyl betaine, sodium cocoyl isethionate, or decyl glucoside — gentler plant-derived surfactants.',
    sources: [
      { label: 'IARC Monograph — 1,4-Dioxane (Group 2A)', url: 'https://monographs.iarc.who.int/list-of-classifications/' },
      { label: 'FDA — 1,4-Dioxane in cosmetics', url: 'https://www.fda.gov/cosmetics/potential-contaminants-cosmetics/14-dioxane-cosmetics-0' }
    ]
  },
  {
    names: ['phthalates', 'dibutyl phthalate', 'diethylhexyl phthalate', 'dimethyl phthalate'],
    concern: 'Reproductive and developmental toxins in animal studies. Dibutyl phthalate and DEHP are banned in EU cosmetics. Often present in products listing only “fragrance” without full disclosure.',
    hazardScore: 8,
    alternatives: 'Choose phthalate-free nail polishes; look for “fragrance-free” or products that disclose all fragrance ingredients.',
    sources: [
      { label: 'EU Cosmetics Regulation 1223/2009 — Annex II (DBP, DEHP prohibited)', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' },
      { label: 'ECHA — Phthalates as substances of very high concern', url: 'https://echa.europa.eu/candidate-list-table/-/dislist/details/0b0236e180d451e1' }
    ]
  },
  {
    names: ['triclosan', 'triclocarban'],
    concern: 'Disrupts thyroid hormone signalling in animal studies; contributes to antibiotic resistance. Banned in OTC antiseptic wash products in the US (FDA 2016). Restricted to ≤0.3% in specific rinse-off cosmetics in the EU.',
    hazardScore: 8,
    alternatives: 'Plain soap and water is equally effective for hand hygiene. Ethanol-based sanitisers where needed.',
    sources: [
      { label: 'FDA — Triclosan: OTC antiseptic ban (2016)', url: 'https://www.fda.gov/consumers/consumer-updates/triclosan-what-consumers-should-know-0' },
      { label: 'EU SCCS — Opinion on triclosan', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_054.pdf' }
    ]
  },
  {
    names: ['oxybenzone', 'benzophenone-3'],
    concern: 'UV filter that penetrates skin and has been detected in blood, urine, and breast milk at low concentrations. Classified as a potential endocrine disruptor by the EU SCCS. Restricted in EU sunscreens to ≤6% (face/body) or ≤0.5% (spray products).',
    hazardScore: 7,
    alternatives: 'Mineral sunscreens with zinc oxide or titanium dioxide remain on the skin surface and do not penetrate.',
    sources: [
      { label: 'SCCS Opinion on benzophenone-3 (2021)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_249.pdf' },
      { label: 'EU Cosmetics Regulation 1223/2009 — Annex VI (UV filters)', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' }
    ]
  },
  {
    names: ['hydroquinone'],
    concern: 'High concentrations can cause irreversible skin darkening (exogenous ochronosis). Classified as a possible carcinogen (IARC 2A). Banned in cosmetics sold to consumers in the EU; available only on prescription.',
    hazardScore: 9,
    alternatives: 'Kojic acid, niacinamide, alpha-arbutin, or azelaic acid for skin brightening — all with better safety profiles.',
    sources: [
      { label: 'IARC — Hydroquinone classification (Group 3)', url: 'https://monographs.iarc.who.int/list-of-classifications/' },
      { label: 'EU Cosmetics Regulation 1223/2009 — Annex II (hydroquinone prohibited)', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' }
    ]
  },
  {
    names: ['coal tar'],
    concern: 'Proven human carcinogen (IARC Group 1). Found in some dandruff shampoos and hair dyes. Prohibited in EU cosmetics except in hair dye products at strictly regulated concentrations.',
    hazardScore: 9,
    alternatives: 'Zinc pyrithione or selenium sulfide shampoos for dandruff; ammonia-free synthetic hair dyes without coal tar derivatives.',
    sources: [
      { label: 'IARC Monograph — Coal Tar (Group 1)', url: 'https://monographs.iarc.who.int/list-of-classifications/' },
      { label: 'EU Cosmetics Regulation 1223/2009 — Annex II', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' }
    ]
  },
  {
    names: ['lead acetate', 'lead'],
    concern: 'Neurotoxic heavy metal. There is no safe level of lead exposure — it accumulates in bone tissue over a lifetime and impairs neurological development. Found in some hair dyes. Banned in cosmetics in the EU and US.',
    hazardScore: 10,
    alternatives: 'Henna-based hair dyes or modern ammonia-free synthetic dyes without metallic salts.',
    sources: [
      { label: 'WHO — Lead poisoning and health', url: 'https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health' },
      { label: 'FDA — Lead acetate in hair dyes (banned 2018)', url: 'https://www.fda.gov/cosmetics/cosmetic-ingredients/lead-acetate' }
    ]
  },
  {
    names: ['mercury', 'thimerosal', 'mercuric chloride'],
    concern: 'Potent neurotoxin that bioaccumulates in organs and the nervous system. Still found in some skin-lightening creams sold outside regulated markets. Banned in cosmetics in the EU and US.',
    hazardScore: 10,
    alternatives: 'Regulated, mercury-free products; niacinamide or vitamin C for brightening.',
    sources: [
      { label: 'WHO — Mercury in skin-lightening products', url: 'https://www.who.int/news-room/fact-sheets/detail/mercury-and-health' },
      { label: 'FDA — Mercury in cosmetics', url: 'https://www.fda.gov/cosmetics/cosmetic-ingredients/mercury-cosmetics-0' }
    ]
  },
  {
    names: ['petroleum', 'petrolatum', 'mineral oil', 'paraffinum liquidum'],
    concern: 'Cosmetic-grade (fully refined) petrolatum is considered safe by the EU and FDA. Lower-grade or inadequately refined mineral oils may contain carcinogenic polycyclic aromatic hydrocarbons (PAHs). Refining quality is key.',
    hazardScore: 2,
    alternatives: 'Shea butter, coconut oil, jojoba oil, or squalane as natural occlusives if you prefer to avoid petroleum derivatives.',
    sources: [
      { label: 'EU CosIng — Petrolatum entry', url: 'https://ec.europa.eu/growth/tools-databases/cosing/details/63176' },
      { label: 'FDA — Petrolatum as OTC skin protectant (safe)', url: 'https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=019683' }
    ]
  },
  {
    names: ['butylated hydroxyanisole', 'bha'],
    concern: 'BHA is classified as a possible human carcinogen (IARC Group 2B) and a suspected endocrine disruptor. Restricted in EU cosmetics under Annex III.',
    hazardScore: 7,
    alternatives: 'Vitamin E (tocopherol) or rosemary extract as natural antioxidant preservatives.',
    sources: [
      { label: 'IARC — BHA classification (Group 2B)', url: 'https://monographs.iarc.who.int/list-of-classifications/' },
      { label: 'EU Cosmetics Regulation 1223/2009 — Annex III (restricted)', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' }
    ]
  },
  {
    names: ['dmdm hydantoin', 'imidazolidinyl urea', 'diazolidinyl urea', 'quaternium-15', 'bronopol', '2-bromo-2-nitropropane-1,3-diol'],
    concern: 'Formaldehyde-releasing preservatives. These compounds slowly release formaldehyde during storage. Formaldehyde is a known human carcinogen (IARC Group 1) and a common skin sensitiser.',
    hazardScore: 8,
    alternatives: 'Products preserved with phenoxyethanol + ethylhexylglycerin, or naturally preserved formulas.',
    sources: [
      { label: 'IARC Monograph — Formaldehyde (Group 1)', url: 'https://monographs.iarc.who.int/list-of-classifications/' },
      { label: 'SCCS — Opinion on DMDM Hydantoin', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_084.pdf' }
    ]
  },
  {
    names: ['talc'],
    concern: 'Cosmetic-grade talc certified free of asbestos is considered safe by regulators. Non-cosmetic-grade talc may contain asbestos fibres. Perineal (genital) use of talc-based powders has been associated with a modestly increased ovarian cancer risk in some epidemiological studies, though causality is not definitively established.',
    hazardScore: 4,
    alternatives: 'Cornstarch or arrowroot powder in body powders. Avoid use in the genital area as a precaution.',
    sources: [
      { label: 'IARC — Talc (perineal use, Group 2B)', url: 'https://monographs.iarc.who.int/list-of-classifications/' },
      { label: 'FDA — Talc in cosmetics', url: 'https://www.fda.gov/cosmetics/cosmetic-ingredients/talc' }
    ]
  },
  {
    names: ['cyclomethicone', 'cyclotetrasiloxane', 'd4', 'cyclopentasiloxane', 'd5', 'cyclohexasiloxane', 'd6'],
    concern: 'Cyclic siloxanes D4 and D5 are persistent, bioaccumulative environmental pollutants and suspected endocrine disruptors. D4 and D5 are prohibited in rinse-off cosmetics (>0.1%) in the EU under REACH regulation.',
    hazardScore: 6,
    alternatives: 'Linear dimethicone (lower environmental concern) or plant-based emollients such as squalane or jojoba esters.',
    sources: [
      { label: 'ECHA — D4/D5 restriction under REACH', url: 'https://echa.europa.eu/restrictions-under-reach/-/dislist/details/0b0236e18299353a' },
      { label: 'EU Commission — Cyclic siloxanes regulation', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32018R0588' }
    ]
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

const ALLERGEN_SOURCES = [
  { label: 'EU Cosmetics Regulation 1223/2009 — Annex III fragrance allergens', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' },
  { label: 'SCCS — Opinion on fragrance allergens in cosmetics', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_102.pdf' }
]

const CAUTION_INGREDIENTS = [
  {
    names: ['alcohol denat', 'denatured alcohol', 'sd alcohol'],
    concern: 'Can cause dryness and irritation in sensitive or compromised skin with repeated use. Generally well tolerated at typical cosmetic concentrations in intact skin.',
    hazardScore: 3,
    alternatives: 'Fatty alcohols (cetyl alcohol, stearyl alcohol) are non-drying and skin-compatible alternatives.',
    sources: [
      { label: 'CosIng — Alcohol denat safety data', url: 'https://ec.europa.eu/growth/tools-databases/cosing/details/30531' }
    ]
  },
  {
    names: ['retinol', 'retinyl palmitate', 'retinyl acetate'],
    concern: 'Increases photosensitivity — daily SPF use is essential. High-dose prescription retinoids are teratogenic; cosmetic retinol concentrations are much lower, but precautionary avoidance during pregnancy is widely advised.',
    hazardScore: 3,
    alternatives: 'Bakuchiol is a plant-derived alternative with comparable anti-ageing evidence, lower irritation, and considered safe in pregnancy.',
    sources: [
      { label: 'SCCS — Opinion on vitamin A (retinol) in cosmetics (2022)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_262.pdf' },
      { label: 'NHS — Vitamin A and pregnancy', url: 'https://www.nhs.uk/pregnancy/related-conditions/existing-health-conditions/medicines-to-avoid/' }
    ]
  },
  {
    names: ['glycolic acid', 'lactic acid', 'alpha hydroxy acid', 'aha'],
    concern: 'Chemical exfoliants that increase UV sensitivity by thinning the outer skin layer. Can cause stinging, peeling, or post-inflammatory hyperpigmentation if overused, especially in darker skin tones.',
    hazardScore: 3,
    alternatives: 'Use SPF 30+ daily. Start with concentrations ≤8%. PHAs (polyhydroxy acids) are gentler and suitable for sensitive skin.',
    sources: [
      { label: 'SCCS — Opinion on alpha-hydroxy acids', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_228.pdf' },
      { label: 'FDA — AHAs and sun sensitivity', url: 'https://www.fda.gov/cosmetics/cosmetic-ingredients/alpha-hydroxy-acids' }
    ]
  },
  {
    names: ['salicylic acid', 'beta hydroxy acid'],
    concern: 'Can cause irritation or dryness at concentrations above 2%. Precautionary avoidance of high-dose products during pregnancy is advised based on the teratogenic potential of systemic salicylates at very high doses.',
    hazardScore: 3,
    alternatives: 'Willow bark extract (lower-concentration natural source); niacinamide for pore-minimising effects without exfoliation.',
    sources: [
      { label: 'SCCS — Opinion on salicylic acid (2019)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_227.pdf' }
    ]
  },
  {
    names: ['phenoxyethanol'],
    concern: 'Widely used preservative considered safe by the EU SCCS at up to 1%. Can cause allergic contact reactions in a small proportion of individuals. France advises against use in leave-on products for children under 3.',
    hazardScore: 3,
    alternatives: 'Generally one of the safer synthetic preservatives available. Ethylhexylglycerin is often used alongside it to reduce the required concentration.',
    sources: [
      { label: 'SCCS — Opinion on phenoxyethanol (2016)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_195.pdf' }
    ]
  },
  {
    names: ['methylisothiazolinone', 'mi', 'methylchloroisothiazolinone', 'mci'],
    concern: 'A potent skin sensitiser and one of the most common causes of allergic contact dermatitis in Europe. The SCCS concluded in 2014 that no safe concentration for MI in leave-on cosmetics could be established. The EU subsequently banned MI in leave-on products (Commission Regulation 2016/1198, effective 2017) and tightened the rinse-off limit from 0.01% to 0.0015% (15 ppm) under Commission Regulation 2017/1224.',
    hazardScore: 7,
    alternatives: 'Products preserved with phenoxyethanol, sodium benzoate, or natural preservation systems have a lower sensitisation concern, though no preservative is universally risk-free.',
    sources: [
      { label: 'SCCS — Opinion on MI (SCCS/1521/13, 2014): no safe leave-on concentration', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_145.pdf' },
      { label: 'SCCS — Updated opinion on MI (SCCS/1557/15, 2016)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_178.pdf' },
      { label: 'Commission Regulation (EU) 2016/1198 — MI banned in leave-on products', url: 'https://www.legislation.gov.uk/eur/2016/1198/introduction' },
      { label: 'Commission Regulation (EU) 2017/1224 — rinse-off limit reduced to 0.0015%', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32017R1224' }
    ]
  },
  {
    names: ['titanium dioxide'],
    concern: 'Safe and effective UV filter in solid (non-nano) form. Nano-form titanium dioxide is classified as a possible carcinogen (IARC 2B) when inhaled. Risk is specific to spray/powder formats; cream and lotion formulations pose no inhalation risk.',
    hazardScore: 2,
    alternatives: 'Choose lotion or cream sunscreen formats over sprays or loose powders. Non-nano zinc oxide is an alternative mineral UV filter.',
    sources: [
      { label: 'IARC — Titanium dioxide (nano, inhaled, Group 2B)', url: 'https://monographs.iarc.who.int/list-of-classifications/' },
      { label: 'SCCS — Opinion on titanium dioxide in sunscreens (2021)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_250.pdf' }
    ]
  },
  {
    names: ['essential oils', 'tea tree oil', 'lavender oil', 'peppermint oil', 'eucalyptus oil', 'clove oil'],
    concern: 'Natural origin does not imply safety. Essential oils are among the most frequent causes of allergic contact dermatitis in cosmetics. Certain oils (e.g. clove, cinnamon) are strong irritants even at low concentrations.',
    hazardScore: 4,
    alternatives: 'Fragrance-free formulations, or products scented only with fully disclosed, low-allergen aromatic compounds.',
    sources: [
      { label: 'SCCS — Opinion on fragrance allergens in cosmetic products', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_102.pdf' },
      { label: 'Contact Dermatitis — Essential oils as allergens (Bauer et al.)', url: 'https://onlinelibrary.wiley.com/doi/10.1111/cod.12333' }
    ]
  }
]

function normalise(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ').trim()
}

export function parseIngredients(text) {
  if (!text) return []
  return text
    .split(/[,;]/)
    .map(s => s.replace(/[*\u00b7\u2022\[\]()]/g, '').trim())
    .filter(s => s.length > 1)
}

export function analyseIngredients(text) {
  const rawIngredients = parseIngredients(text)
  return rawIngredients.map(raw => {
    const norm = normalise(raw)

    for (const entry of HARMFUL_INGREDIENTS) {
      if (entry.names.some(n => norm.includes(normalise(n)))) {
        return { name: raw, rating: 'harmful', isAllergen: false, concern: entry.concern, hazardScore: entry.hazardScore, alternatives: entry.alternatives, sources: entry.sources }
      }
    }

    const isAllergen = ALLERGEN_INGREDIENTS.some(a => norm.includes(normalise(a)))

    for (const entry of CAUTION_INGREDIENTS) {
      if (entry.names.some(n => norm.includes(normalise(n)))) {
        return { name: raw, rating: 'caution', isAllergen, concern: entry.concern, hazardScore: entry.hazardScore, alternatives: entry.alternatives, sources: entry.sources }
      }
    }

    if (isAllergen) {
      return {
        name: raw,
        rating: 'safe',
        isAllergen: true,
        concern: 'Generally safe for most people — this ingredient is permitted in cosmetics and poses no known risk to the general population. However, if you have a known allergy or sensitivity to this ingredient, you should avoid this product. It is an EU-listed fragrance allergen (Cosmetics Regulation Annex III), which means manufacturers are legally required to declare it on the label above 0.01% in leave-on and 0.1% in rinse-off products, precisely so that people with sensitivities can identify and avoid it.',
        hazardScore: 2,
        alternatives: 'If you are sensitised to this ingredient, choose fragrance-free products or those that fully disclose individual fragrance components so you can check each one.',
        sources: ALLERGEN_SOURCES
      }
    }

    // Safe or unknown — attach a brief description if one exists
    const description = getIngredientDescription(raw)
    return {
      name: raw,
      rating: 'safe',
      isAllergen: false,
      concern: null,
      description,          // brief plain-language role, shown as subtitle
      hazardScore: null,
      alternatives: null,
      sources: []
    }
  })
}
