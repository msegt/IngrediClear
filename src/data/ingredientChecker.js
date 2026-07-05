// Ingredient safety database compiled from:
// - EU CosIng database (open access): https://ec.europa.eu/growth/tools-databases/cosing/
// - EU Cosmetics Regulation 1223/2009: https://eur-lex.europa.eu/eli/reg/2009/1223/oj
// - IARC Monographs: https://monographs.iarc.who.int/
// - EU Scientific Committee on Consumer Safety (SCCS): https://health.ec.europa.eu/scientific-committees/scientific-committee-consumer-safety-sccs_en
// - EWG Skin Deep (indicative hazard scores): https://www.ewg.org/skindeep/

import { getIngredientDescription } from './ingredientDescriptions.js'
import { getCosIngData } from './cosingData.js'

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
    concern: 'Reproductive and developmental toxins in animal studies. Dibutyl phthalate and DEHP are banned in EU cosmetics. Often present in products listing only "fragrance" without full disclosure.',
    hazardScore: 8,
    alternatives: 'Choose phthalate-free nail polishes; look for "fragrance-free" or products that disclose all fragrance ingredients.',
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
    concern: 'Chemical exfoliants that increase UV sensitivity by thinning the outer skin layer. Can cause stinging, peeling, or post-inflammatory hyperpigmentation if overused, especially in darker skin tones. The EU SCCS recommends a maximum of 10% in rinse-off products and 4% in leave-on products.',
    hazardScore: 3,
    alternatives: 'Start with lower concentrations (1–2%), use at night, and always follow with broad-spectrum SPF during the day.',
    sources: [
      { label: 'SCCS — Opinion on alpha-hydroxy acids in cosmetics (2015)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_174.pdf' }
    ]
  },
  {
    names: ['salicylic acid'],
    concern: 'Beta-hydroxy acid exfoliant. Increases photosensitivity. EU Cosmetics Regulation restricts salicylic acid: max 0.5% as a preservative; max 2% in rinse-off hair products; max 2% in other products. Not permitted in products for children under 3 (except shampoos). The NHS advises avoidance during pregnancy.',
    hazardScore: 3,
    alternatives: 'Niacinamide or azelaic acid for pore-clearing without the same restrictions.',
    sources: [
      { label: 'EU Cosmetics Regulation 1223/2009 — Annex III, entry 1 (salicylic acid)', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' },
      { label: 'NHS — Salicylic acid and pregnancy', url: 'https://www.nhs.uk/medicines/salicylic-acid/' }
    ]
  },
  {
    names: ['phenoxyethanol'],
    concern: 'Widely used preservative, considered safe by the EU SCCS at up to 1%. The French medicines agency (ANSM) issued a precautionary advisory in 2012 recommending against its use in products for infants under 3 years (especially nappy area), as it can penetrate immature skin.',
    hazardScore: 2,
    alternatives: 'For baby products: look for sodium benzoate, potassium sorbate, or naturally preserved formulas. For adults, phenoxyethanol at ≤1% is well-established as safe.',
    sources: [
      { label: 'SCCS — Opinion on phenoxyethanol (2016)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_195.pdf' },
      { label: 'ANSM — Phenoxyethanol advisory (France)', url: 'https://www.ansm.sante.fr/actualites/phenoxyethanol' }
    ]
  },
  {
    names: ['methylisothiazolinone', 'mi', 'mit'],
    concern: 'Potent skin and contact allergen. The EU Scientific Committee on Consumer Safety found it unsafe at any concentration in leave-on cosmetics in 2014. Restricted to 0.0015% in rinse-off products only (EU Regulation 2017/1224).',
    hazardScore: 7,
    alternatives: 'Products preserved with phenoxyethanol, sodium benzoate, or potassium sorbate.',
    sources: [
      { label: 'SCCS — Opinion on methylisothiazolinone (2014)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_166.pdf' },
      { label: 'EU Commission Regulation 2017/1224 (MI restriction)', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32017R1224' }
    ]
  },
  {
    names: ['fragrance', 'parfum', 'aroma'],
    concern: 'Generic ‘fragrance’/‘parfum’ declarations can legally conceal dozens of undisclosed individual compounds, some of which are known allergens, sensitisers, or suspected endocrine disruptors. Without full disclosure you cannot assess what you are being exposed to.',
    hazardScore: 4,
    alternatives: 'Fragrance-free products or those that list individual fragrance components. Products certified fragrance-free by IFRA or meeting ISO 16128 botanical standards.',
    sources: [
      { label: 'SCCS — Opinion on fragrance allergens in cosmetics (2012)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_102.pdf' },
      { label: 'EU Cosmetics Regulation 1223/2009 — Annex III fragrance allergens', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' }
    ]
  },
  {
    names: ['titanium dioxide'],
    concern: 'Cosmetic-grade titanium dioxide used in sunscreens and make-up is considered safe when applied to intact skin. However, the IARC classifies inhaled TiO₂ as a possible carcinogen (Group 2B) — a risk relevant specifically to spray/aerosol products. The EU prohibits nano titanium dioxide in spray products as a precaution.',
    hazardScore: 3,
    alternatives: 'Avoid spray sunscreens with titanium dioxide; opt for lotion or cream formats.',
    sources: [
      { label: 'SCCS — Opinion on titanium dioxide (nano) in cosmetics (2021)', url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_250.pdf' },
      { label: 'IARC — Titanium dioxide (Group 2B, inhalation)', url: 'https://monographs.iarc.who.int/list-of-classifications/' }
    ]
  }
]

function normalise(str) {
  return str.toLowerCase().replace(/[\u00ad\u200b]/g, '').replace(/\s+/g, ' ').trim()
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
        const cosing = getCosIngData(norm)
        return { name: raw, rating: 'harmful', isAllergen: false, concern: entry.concern, hazardScore: entry.hazardScore, alternatives: entry.alternatives, cosing, sources: entry.sources }
      }
    }

    const isAllergen = ALLERGEN_INGREDIENTS.some(a => norm.includes(normalise(a)))

    for (const entry of CAUTION_INGREDIENTS) {
      if (entry.names.some(n => norm.includes(normalise(n)))) {
        const cosing2 = getCosIngData(norm)
        return { name: raw, rating: 'caution', isAllergen, concern: entry.concern, hazardScore: entry.hazardScore, alternatives: entry.alternatives, cosing: cosing2, sources: entry.sources }
      }
    }

    if (isAllergen) {
      const cosing = getCosIngData(norm)
      return {
        name: raw,
        rating: 'safe',
        isAllergen: true,
        concern: 'Generally safe for most people — this ingredient is permitted in cosmetics and poses no known risk to the general population. However, if you have a known allergy or sensitivity to this ingredient, you should avoid this product. It is an EU-listed fragrance allergen (Cosmetics Regulation Annex III), which means manufacturers are legally required to declare it on the label above 0.01% in leave-on and 0.1% in rinse-off products, precisely so that people with sensitivities can identify and avoid it.',
        hazardScore: 2,
        alternatives: 'If you are sensitised to this ingredient, choose fragrance-free products or those that fully disclose individual fragrance components so you can check each one.',
        cosing,
        sources: ALLERGEN_SOURCES
      }
    }

    const description = getIngredientDescription(raw)
    const cosing = getCosIngData(norm)

    if (cosing && (cosing.eu === 'restricted' || cosing.eu === 'prohibited') && cosing.restriction) {
      return {
        name: raw,
        rating: cosing.eu === 'prohibited' ? 'harmful' : 'caution',
        isAllergen,
        concern: cosing.restriction,
        hazardScore: cosing.eu === 'prohibited' ? 9 : 5,
        alternatives: null,
        description,
        cosing,
        sources: [
          { label: 'EU CosIng — Cosmetics Ingredients Database', url: 'https://ec.europa.eu/growth/tools-databases/cosing/' },
          { label: 'EU Cosmetics Regulation 1223/2009 (Annexes)', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' }
        ]
      }
    }

    return {
      name: raw,
      rating: 'safe',
      isAllergen: false,
      concern: null,
      description,
      hazardScore: null,
      alternatives: null,
      cosing,
      sources: []
    }
  })
}
