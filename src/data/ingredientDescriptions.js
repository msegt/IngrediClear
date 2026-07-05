/**
 * Brief plain-language descriptions for common cosmetic ingredients that are
 * considered safe / not flagged. Shown as a subtitle in the Safe & unclassified
 * section so the user knows what each ingredient actually does.
 *
 * Keys are lowercase normalised fragments — matched with String.includes().
 * More specific entries should be placed before broader ones.
 */
export const INGREDIENT_DESCRIPTIONS = [
  // ── Water & solvents
  { match: 'aqua',                      description: 'Water — the most common cosmetic base, used as a solvent for other ingredients.' },
  { match: 'water',                     description: 'Water — the most common cosmetic base, used as a solvent for other ingredients.' },
  { match: 'alcohol denat',             description: 'Denatured ethanol — helps products dry quickly and can act as a preservative; may be drying on sensitive skin.' },
  { match: 'ethanol',                   description: 'Alcohol — used as a solvent and preservative; can be drying with frequent use.' },
  { match: 'isopropyl alcohol',         description: 'Isopropyl alcohol — solvent and antiseptic; can be drying on skin.' },
  { match: 'propylene glycol',          description: 'Humectant — draws moisture into the skin and helps other ingredients penetrate.' },
  { match: 'butylene glycol',           description: 'Humectant and solvent — attracts moisture to the skin and improves texture.' },
  { match: 'pentylene glycol',          description: 'Humectant and mild preservative booster — helps keep skin hydrated.' },
  { match: 'hexylene glycol',           description: 'Solvent and humectant — helps dissolve other ingredients and retain moisture.' },
  { match: 'caprylyl glycol',           description: 'Moisturiser and preservative booster — improves skin feel and product stability.' },
  { match: 'dipropylene glycol',        description: 'Solvent and humectant — commonly used in fragrance delivery and skin conditioning.' },

  // ── Emollients & skin conditioners
  { match: 'glycerin',                  description: 'Humectant — draws water to the skin surface, keeping it soft and hydrated.' },
  { match: 'glycerol',                  description: 'Humectant — draws water to the skin surface, keeping it soft and hydrated.' },
  { match: 'squalane',                  description: 'Lightweight emollient — mimics the skin’s own sebum; softens and seals in moisture without greasiness.' },
  { match: 'squalene',                  description: 'Emollient — naturally found in human sebum; softens skin and supports the skin barrier.' },
  { match: 'jojoba',                    description: 'Liquid wax from the jojoba plant — closely resembles skin sebum; moisturises and softens.' },
  { match: 'shea butter',               description: 'Rich plant butter — deeply moisturises and soothes dry or irritated skin.' },
  { match: 'cocoa butter',              description: 'Thick plant butter — occlusive moisturiser that seals water into skin.' },
  { match: 'coconut oil',               description: 'Plant-derived oil — emollient that softens skin; high in saturated fatty acids.' },
  { match: 'argan oil',                 description: 'Plant oil rich in vitamin E and fatty acids — nourishes skin and hair.' },
  { match: 'rosehip',                   description: 'Rosehip oil — rich in essential fatty acids and vitamin A precursors; helps skin feel smoother.' },
  { match: 'marula oil',                description: 'Lightweight plant oil — rich in oleic acid; softens and helps maintain the skin barrier.' },
  { match: 'sunflower seed oil',        description: 'Plant oil high in linoleic acid — helps reinforce the skin barrier and softens skin.' },
  { match: 'sweet almond oil',          description: 'Emollient plant oil — softens and conditions skin; suits most skin types.' },
  { match: 'isopropyl myristate',       description: 'Synthetic emollient — gives a dry, non-greasy skin feel; helps spread products evenly.' },
  { match: 'isopropyl palmitate',       description: 'Emollient ester — softens skin and improves product spreadability.' },
  { match: 'caprylic',                  description: 'Emollient ester (C8/C10 fatty acids) — lightweight skin-feel modifier, often from coconut or palm.' },
  { match: 'cetearyl',                  description: 'Fatty alcohol blend — emollient and emulsifier that thickens creams and conditions skin.' },
  { match: 'cetyl alcohol',             description: 'Fatty alcohol — emollient and thickener; conditions skin and gives creams a smooth texture.' },
  { match: 'stearyl alcohol',           description: 'Fatty alcohol — emollient and emulsifier; helps stabilise formulas and soften skin.' },
  { match: 'behenyl alcohol',           description: 'Long-chain fatty alcohol — emollient and thickener; conditions skin.' },
  { match: 'myristyl alcohol',          description: 'Fatty alcohol — emollient and emulsifier; helps give products a smooth, creamy texture.' },
  { match: 'dimethicone',               description: 'Silicone — forms a protective film over skin; gives a silky feel and reduces water loss.' },
  { match: 'phenyl trimethicone',       description: 'Silicone — adds shine to hair and skin, and provides a lightweight conditioning effect.' },
  { match: 'amodimethicone',            description: 'Amino-functional silicone — used in hair care to smooth the cuticle and reduce frizz.' },
  { match: 'niacinamide',               description: 'Vitamin B3 — brightens skin, supports the barrier, reduces redness and minimises pores.' },
  { match: 'panthenol',                 description: 'Provitamin B5 — deeply moisturises, soothes and helps repair the skin barrier.' },
  { match: 'allantoin',                 description: 'Skin-soothing agent — promotes cell renewal, reduces irritation and softens skin.' },
  { match: 'urea',                      description: 'Humectant and keratolytic — deeply hydrates and gently softens rough or thickened skin.' },
  { match: 'lactic acid',              description: 'Alpha-hydroxy acid (AHA) — gently exfoliates and boosts hydration by attracting water to the skin.' },
  { match: 'hyaluronic acid',           description: 'Humectant — holds up to 1,000× its weight in water; plumps and intensely hydrates skin.' },
  { match: 'sodium hyaluronate',        description: 'Salt form of hyaluronic acid — deeply hydrates skin by drawing in and retaining moisture.' },
  { match: 'ceramide',                  description: 'Lipid naturally found in skin — repairs and reinforces the moisture barrier, reducing dryness.' },
  { match: 'cholesterol',               description: 'Skin-identical lipid — helps restore and maintain the skin’s natural barrier.' },
  { match: 'lecithin',                  description: 'Phospholipid emulsifier — helps oil and water mix, and conditions skin.' },
  { match: 'lanolin',                   description: 'Wool-derived wax — occlusive emollient that deeply softens and seals moisture into skin.' },

  // ── Humectants
  { match: 'sorbitol',                  description: 'Humectant — attracts and retains moisture, leaving skin soft and hydrated.' },
  { match: 'trehalose',                 description: 'Natural sugar humectant — stabilises skin cells under stress and supports hydration.' },
  { match: 'betaine',                   description: 'Humectant derived from sugar beet — moisturises and soothes skin.' },
  { match: 'sodium pca',                description: 'Humectant — a natural skin moisturising factor that helps maintain skin hydration levels.' },
  { match: 'inositol',                  description: 'Sugar alcohol — humectant and skin-conditioning agent.' },

  // ── Emulsifiers & stabilisers
  { match: 'carbomer',                  description: 'Thickener and gelling agent — creates the gel texture in many moisturisers and serums.' },
  { match: 'xanthan gum',               description: 'Natural thickener from fermentation — gives products a smooth, gel-like consistency.' },
  { match: 'hydroxyethylcellulose',     description: 'Plant-derived thickener — stabilises formulas and gives a smooth texture.' },
  { match: 'hydroxypropyl methylcellulose', description: 'Cellulose derivative — thickens and stabilises formulas; film-former.' },
  { match: 'cellulose',                 description: 'Plant-derived polymer — used as a thickener, emulsifier or film-forming agent.' },
  { match: 'polysorbate',               description: 'Emulsifier — helps oil and water mix together smoothly in a formula.' },
  { match: 'peg-',                      description: 'PEG emulsifier/humectant — helps blend ingredients and improve texture.' },
  { match: 'sodium stearoyl lactylate', description: 'Emulsifier derived from stearic acid — helps stabilise oil-in-water formulas.' },
  { match: 'steareth-',                 description: 'Emulsifier — helps mix oil and water phases in creams and lotions.' },
  { match: 'ceteareth-',                description: 'Emulsifier — blends oil and water phases and contributes to cream texture.' },
  { match: 'sodium lauryl sulfoacetate', description: 'Mild surfactant from coconut — creates lather and cleanses without the harshness of SLS.' },
  { match: 'cocamidopropyl betaine',    description: 'Mild amphoteric surfactant — cleanses gently and adds foam; well-tolerated by most skin types.' },
  { match: 'decyl glucoside',           description: 'Gentle plant-derived surfactant — cleanses without stripping the skin barrier.' },
  { match: 'coco glucoside',            description: 'Very mild coconut-derived cleanser — suitable for sensitive skin; biodegradable.' },
  { match: 'lauryl glucoside',          description: 'Mild plant-derived surfactant — gentle cleanser often used in baby and sensitive-skin products.' },
  { match: 'glyceryl stearate',         description: 'Emulsifier and emollient — helps blend oil and water, and leaves skin feeling smooth.' },
  { match: 'stearic acid',              description: 'Fatty acid from plant or animal fats — emollient, thickener and emulsion stabiliser.' },
  { match: 'palmitic acid',             description: 'Saturated fatty acid — emollient and emulsifier; naturally present in skin lipids.' },
  { match: 'oleic acid',                description: 'Monounsaturated fatty acid — penetrates skin well and softens the barrier.' },
  { match: 'linoleic acid',             description: 'Essential fatty acid — supports the skin barrier and reduces transepidermal water loss.' },
  { match: 'capric acid',               description: 'Medium-chain fatty acid — mild antimicrobial and emollient, often from coconut.' },
  { match: 'lauric acid',               description: 'Fatty acid from coconut oil — mild antimicrobial and emollient.' },

  // ── Antioxidants & vitamins
  { match: 'tocopherol',                description: 'Vitamin E — antioxidant that protects skin cells from free-radical damage and moisturises.' },
  { match: 'ascorbic acid',             description: 'Vitamin C — potent antioxidant that brightens skin tone and boosts collagen synthesis.' },
  { match: 'sodium ascorbyl phosphate', description: 'Stable vitamin C derivative — antioxidant that brightens and helps even skin tone.' },
  { match: 'ascorbyl glucoside',        description: 'Stable vitamin C derivative — antioxidant; brightens skin and stimulates collagen.' },
  { match: 'retinyl palmitate',         description: 'Vitamin A ester — mild retinoid that supports cell turnover; weaker than retinol.' },
  { match: 'ubiquinone',                description: 'Coenzyme Q10 — antioxidant found naturally in skin cells; helps reduce oxidative stress.' },
  { match: 'resveratrol',               description: 'Plant-derived antioxidant — protects against environmental stressors and may support collagen.' },
  { match: 'ferulic acid',              description: 'Plant antioxidant — stabilises vitamin C and E in formulas and boosts their effectiveness.' },
  { match: 'green tea',                 description: 'Plant antioxidant (EGCG) — calms inflammation and helps protect against UV-related damage.' },
  { match: 'camellia sinensis',         description: 'Green or white tea extract — rich in polyphenol antioxidants; soothes and protects skin.' },
  { match: 'bisabolol',                 description: 'Calming agent from chamomile — soothes irritated skin and reduces redness.' },
  { match: 'chamomile',                 description: 'Botanical extract — anti-inflammatory; soothes sensitive or irritated skin.' },
  { match: 'aloe',                      description: 'Aloe vera — soothes, cools and lightly hydrates skin; used in after-sun and sensitive-skin products.' },
  { match: 'centella asiatica',         description: 'Cica — calms redness, supports collagen and helps repair the skin barrier.' },
  { match: 'madecassoside',             description: 'Active from centella asiatica — accelerates wound healing and reduces inflammation.' },
  { match: 'asiaticoside',              description: 'Active from centella asiatica — promotes collagen synthesis and calms irritation.' },
  { match: 'niacinamide',               description: 'Vitamin B3 — brightens, tightens pores, reduces redness and strengthens the skin barrier.' },
  { match: 'adenosine',                 description: 'Naturally occurring compound — reduces inflammation and is used for its anti-wrinkle effect.' },
  { match: 'zinc oxide',                description: 'Mineral UV filter — broad-spectrum sun protection; also anti-inflammatory and soothing.' },
  { match: 'titanium dioxide',          description: 'Mineral UV filter — reflects UV rays and protects against sunburn.' },

  // ── Preservatives (safe / low concern)
  { match: 'sodium benzoate',           description: 'Preservative — prevents microbial growth; considered low-risk at the concentrations used in cosmetics.' },
  { match: 'potassium sorbate',         description: 'Mild preservative from sorbic acid — prevents mould and yeast; well tolerated.' },
  { match: 'phenoxyethanol',            description: 'Preservative — widely used alternative to parabens; keeps products stable and safe to use.' },
  { match: 'ethylhexylglycerin',        description: 'Preservative booster and skin conditioner — often paired with phenoxyethanol.' },
  { match: 'benzyl alcohol',            description: 'Mild preservative and solvent — used at low levels; also an EU-listed fragrance allergen.' },
  { match: 'dehydroacetic acid',        description: 'Mild preservative — prevents bacterial and fungal growth; considered low-irritation.' },
  { match: 'sorbic acid',              description: 'Naturally derived preservative — inhibits mould and yeast at the low concentrations used in cosmetics.' },
  { match: 'chlorphenesin',             description: 'Preservative — broad-spectrum antimicrobial used at concentrations up to 0.3% as allowed by EU Reg.' },

  // ── pH adjusters
  { match: 'citric acid',               description: 'pH adjuster from citrus fruits — keeps product acidity at skin-compatible levels.' },
  { match: 'lactic acid',              description: 'Alpha-hydroxy acid — adjusts pH and gently exfoliates; also a natural skin moisturising factor.' },
  { match: 'sodium hydroxide',          description: 'pH adjuster (alkali) — used in tiny amounts to neutralise acids and reach the target formula pH.' },
  { match: 'potassium hydroxide',       description: 'pH adjuster (alkali) — used at trace levels to balance formula acidity.' },
  { match: 'triethanolamine',           description: 'pH adjuster and emulsifier — used at low levels to achieve the target formula pH.' },
  { match: 'sodium lactate',            description: 'pH buffer and humectant — helps keep skin’s natural acid mantle intact.' },
  { match: 'sodium gluconate',          description: 'Chelating agent and pH buffer — binds metal ions to keep formulas stable.' },

  // ── Chelating agents
  { match: 'edta',                      description: 'Chelating agent — binds metal ions in water, preventing them from degrading other ingredients.' },
  { match: 'disodium edta',             description: 'Chelating agent — stabilises formulas by inactivating trace metals in the water phase.' },
  { match: 'tetrasodium edta',          description: 'Chelating agent — improves preservative efficacy by binding metal ions.' },
  { match: 'phytic acid',               description: 'Natural chelating agent from grains — binds metals, brightens skin and stabilises formulas.' },

  // ── Film-formers & polymers
  { match: 'pvp',                       description: 'Polyvinylpyrrolidone — film-former and binder used in hairsprays, gels and mascaras.' },
  { match: 'acrylates',                 description: 'Synthetic polymer — film-former that helps products adhere and improves longevity.' },
  { match: 'hydroxyethyl acrylate',     description: 'Synthetic polymer — used as a thickener and film-forming agent.' },
  { match: 'polyquaternium',            description: 'Conditioning polymer — reduces static, detangles hair and improves skin smoothness.' },
  { match: 'guar',                      description: 'Natural seed gum — thickener and conditioning agent; helps detangle hair.' },

  // ── Colourants (approved)
  { match: 'iron oxide',                description: 'Mineral pigment — used for colour in foundations, blushes and eye products; considered safe.' },
  { match: 'mica',                      description: 'Natural mineral — provides shimmer and glow; widely used in makeup.' },
  { match: 'ultramarines',              description: 'Mineral pigment — provides blue/violet/pink tones in cosmetics; considered safe.' },
  { match: 'chromium oxide',            description: 'Mineral pigment — provides green shades; approved for cosmetic use.' },
  { match: 'manganese violet',          description: 'Inorganic pigment — approved violet colour for cosmetics.' },

  // ── Fragrance & essential oil components
  { match: 'parfum',                    description: 'Fragrance blend — provides scent; full composition is not required to be disclosed.' },
  { match: 'fragrance',                 description: 'Fragrance blend — provides scent; can contain many undisclosed ingredients.' },
  { match: 'aroma',                     description: 'Natural fragrance blend — provides scent from plant-derived materials.' },

  // ── Miscellaneous actives
  { match: 'caffeine',                  description: 'Stimulant and antioxidant — may temporarily reduce puffiness and is used in eye and cellulite treatments.' },
  { match: 'collagen',                  description: 'Structural protein — used as a humectant and film-former; topical collagen cannot penetrate to the dermis.' },
  { match: 'elastin',                   description: 'Protein humectant — conditions and moisturises; topical elastin does not integrate into skin structure.' },
  { match: 'keratin',                   description: 'Structural protein — smooths and strengthens hair by filling gaps in the cuticle.' },
  { match: 'biotin',                    description: 'Vitamin B7 — supports keratin structure; used in hair products, though topical efficacy is limited.' },
  { match: 'peptide',                   description: 'Short chain of amino acids — signals skin to produce collagen or relax muscles; used in anti-ageing serums.' },
  { match: 'arginine',                  description: 'Amino acid — skin conditioner and antioxidant; supports the skin barrier.' },
  { match: 'proline',                   description: 'Amino acid — building block of collagen; used as a skin conditioner.' },
  { match: 'serine',                    description: 'Amino acid — natural skin moisturising factor; helps maintain skin hydration.' },
  { match: 'lysine',                    description: 'Essential amino acid — supports collagen production and skin structure.' },
  { match: 'salicylic acid',            description: 'Beta-hydroxy acid (BHA) — exfoliates inside pores, reducing blackheads and breakouts.' },
  { match: 'azelaic acid',              description: 'Naturally occurring dicarboxylic acid — reduces blemishes, redness and uneven skin tone.' },
  { match: 'kojic acid',                description: 'Fungal-derived brightening agent — inhibits melanin production to reduce dark spots.' },
  { match: 'arbutin',                   description: 'Brightening agent from bearberry — inhibits melanin synthesis; helps fade dark spots.' },
  { match: 'tranexamic acid',           description: 'Brightening active — reduces hyperpigmentation by interrupting melanin transfer.' },
  { match: 'bakuchiol',                 description: 'Plant-derived retinol alternative — stimulates collagen, reduces fine lines; gentler than retinol.' },
  { match: 'zinc',                      description: 'Mineral with sebum-regulating and mild antimicrobial properties; used for oily and acne-prone skin.' },
  { match: 'sulfur',                    description: 'Mineral — antibacterial and keratolytic; used to treat acne and seborrheic conditions.' },
  { match: 'kaolin',                    description: 'White clay — absorbs excess oil and gently cleanses; used in masks and powders.' },
  { match: 'bentonite',                 description: 'Clay mineral — draws out impurities and absorbs oil; used in purifying masks.' },
  { match: 'charcoal',                  description: 'Activated carbon — adsorbs excess oil and impurities; used in detoxifying masks and cleansers.' },
  { match: 'niacinamide',               description: 'Vitamin B3 — targets pores, redness, uneven tone and the skin barrier.' },

  // ── Sunscreen actives (chemical filters)
  { match: 'avobenzone',                description: 'Chemical UV-A filter — absorbs UV-A rays that cause premature skin ageing.' },
  { match: 'octinoxate',                description: 'Chemical UV-B filter — absorbs UV-B rays that cause sunburn.' },
  { match: 'octisalate',                description: 'Chemical UV-B filter — absorbs UV-B rays and also helps stabilise avobenzone.' },
  { match: 'octocrylene',               description: 'Chemical UV-B filter — absorbs UV-B rays and helps stabilise other sunscreen actives.' },
  { match: 'homosalate',                description: 'Chemical UV-B filter — absorbs UV-B radiation; under ongoing SCCS safety review.' },
  { match: 'tinosorb',                  description: 'Broad-spectrum EU-approved UV filter — protects against both UV-A and UV-B rays.' },
  { match: 'mexoryl',                   description: 'UV-A filter — offers strong protection against the UV-A rays that cause skin ageing.' },
  { match: 'ecamsule',                  description: 'UV-A filter — provides targeted protection against UV-A radiation.' },

  // ── Hair-specific
  { match: 'dimethyl ether',            description: 'Propellant and solvent — used to deliver aerosol formulas like dry shampoo.' },
  { match: 'isobutane',                 description: 'Propellant gas — helps dispense aerosol hair and body products.' },
  { match: 'propane',                   description: 'Propellant gas — used in aerosol dispensing of hair products.' },
  { match: 'behentrimonium chloride',   description: 'Conditioning quaternary ammonium — detangles and softens hair; anti-static.' },
  { match: 'cetrimonium chloride',      description: 'Conditioning quaternary ammonium — detangles hair and reduces static.' },
  { match: 'stearamidopropyl dimethylamine', description: 'Hair conditioner — smooths the cuticle, reduces frizz and improves combability.' },
  { match: 'hydrolyzed',                description: 'Hydrolysed protein — partially broken-down proteins that coat and strengthen hair or skin.' },
]

/**
 * Given a raw ingredient name, return a brief description string or null.
 */
export function getIngredientDescription(rawName) {
  if (!rawName) return null
  const norm = rawName.toLowerCase()
  for (const entry of INGREDIENT_DESCRIPTIONS) {
    if (norm.includes(entry.match)) return entry.description
  }
  return null
}
