/**
 * Category tag utilities for Open Food Facts / Open Beauty Facts.
 *
 * Provides a 4-tier strategy so alternatives can always be fetched,
 * even when a product has no categories_tags, no recognisable name,
 * and a minimal product record:
 *
 *   Tier 1 – mostSpecificCategoryTag:  use the longest/most-specific tag in
 *             the existing categories_tags array (original behaviour).
 *
 *   Tier 2 – inferCategoryTagFromName: map the product_name / brands string
 *             to a known canonical OFF/OBF category tag via a keyword lookup.
 *
 *   Tier 3 – free-text search using product name (handled by caller).
 *
 *   Tier 4 – ingredient-keyword fallback: scan the first few items in
 *             ingredients_text and map them to a category tag.  This fires
 *             for products with completely missing metadata but a populated
 *             ingredient list — e.g. a freshly-added barcode that has no
 *             categories or a recognisable product name yet.
 *
 * The exported `getAlternativeAnchor` always returns a non-null { tag,
 * strategy } pair (Tier 4 guarantees a last-resort result as long as any
 * text is available on the product record).  Use `hasUsableAnchor` to
 * check whether the anchor is actionable before rendering the section.
 */

// ── Tier 1 ───────────────────────────────────────────────────────────────────

/**
 * Pick the most specific category tag from an OFF/OBF categories_tags array.
 * The longest slug reliably picks the deepest leaf category.
 */
export function mostSpecificCategoryTag(categoriesTags) {
  if (!Array.isArray(categoriesTags) || categoriesTags.length === 0) return null
  const langTags = categoriesTags.filter(t => /^[a-z]{2}:/.test(t))
  const pool = langTags.length > 0 ? langTags : categoriesTags
  return pool.reduce((best, tag) => tag.length > best.length ? tag : best, pool[0])
}

// ── Tier 2 ───────────────────────────────────────────────────────────────────

/**
 * Keyword → canonical OFF category tag mappings.
 * Used when categories_tags is absent or empty.
 *
 * Food entries use Open Food Facts canonical tags.
 * Cosmetic entries use Open Beauty Facts canonical tags.
 * Each entry has { keywords, foodTag, cosmeticTag } — callers pick the right one.
 */
const CATEGORY_INFER_MAP = [
  // ── Food ────────────────────────────────────────────────────────────────
  { keywords: ['chocolate', 'choco'],            foodTag: 'en:chocolates' },
  { keywords: ['biscuit', 'cookie', 'cookies'],  foodTag: 'en:biscuits-and-cakes' },
  { keywords: ['crisp', 'chip', 'snack', 'puff'], foodTag: 'en:salty-snacks' },
  { keywords: ['yogurt', 'yoghurt', 'yaourt'],   foodTag: 'en:dairy-products' },
  { keywords: ['milk', 'milch', 'lait'],         foodTag: 'en:dairy-products' },
  { keywords: ['cheese', 'fromage', 'queso'],    foodTag: 'en:cheeses' },
  { keywords: ['bread', 'brot', 'pain', 'loaf'], foodTag: 'en:breads' },
  { keywords: ['pasta', 'spaghetti', 'penne', 'noodle'], foodTag: 'en:pasta' },
  { keywords: ['rice', 'riz'],                   foodTag: 'en:rices' },
  { keywords: ['cereal', 'granola', 'muesli', 'oat', 'porridge'], foodTag: 'en:breakfast-cereals' },
  { keywords: ['juice', 'jus', 'smoothie'],      foodTag: 'en:fruit-juices' },
  { keywords: ['water', 'eau', 'wasser'],        foodTag: 'en:waters' },
  { keywords: ['soda', 'cola', 'lemonade', 'fizzy', 'sparkling drink'], foodTag: 'en:sodas' },
  { keywords: ['coffee', 'espresso', 'café'],    foodTag: 'en:coffees' },
  { keywords: ['tea', 'herbal tea', 'thé'],      foodTag: 'en:teas' },
  { keywords: ['beer', 'bière', 'bier', 'ale', 'lager'], foodTag: 'en:beers' },
  { keywords: ['wine', 'vin', 'vino'],           foodTag: 'en:wines' },
  { keywords: ['sauce', 'ketchup', 'mayo', 'mayonnaise', 'mustard'], foodTag: 'en:sauces' },
  { keywords: ['soup', 'broth', 'bouillon'],     foodTag: 'en:soups' },
  { keywords: ['ice cream', 'gelato', 'sorbet', 'frozen dessert'], foodTag: 'en:ice-creams' },
  { keywords: ['ham', 'bacon', 'sausage', 'salami', 'chorizo'], foodTag: 'en:charcuterie' },
  { keywords: ['chicken', 'beef', 'pork', 'lamb', 'meat'], foodTag: 'en:meats' },
  { keywords: ['fish', 'salmon', 'tuna', 'cod', 'seafood'], foodTag: 'en:fish-and-seafood' },
  { keywords: ['spread', 'jam', 'marmalade', 'hazelnut spread', 'peanut butter'], foodTag: 'en:spreads' },
  { keywords: ['oil', 'olive oil', 'sunflower oil', 'vegetable oil'], foodTag: 'en:oils' },
  { keywords: ['vinegar', 'vinaigre'],           foodTag: 'en:vinegars' },
  { keywords: ['sugar', 'honey', 'syrup', 'sweetener'], foodTag: 'en:sweeteners' },
  // ── Cosmetics ────────────────────────────────────────────────────────────
  { keywords: ['shampoo', 'hair wash'],          cosmeticTag: 'en:shampoos' },
  { keywords: ['conditioner', 'hair conditioner', 'après-shampoing'], cosmeticTag: 'en:hair-conditioners' },
  { keywords: ['moisturiser', 'moisturizer', 'face cream', 'day cream', 'night cream', 'body lotion', 'body cream', 'hand cream'], cosmeticTag: 'en:moisturisers' },
  { keywords: ['sunscreen', 'sun cream', 'spf', 'sunblock', 'solar cream'], cosmeticTag: 'en:sun-protection-products' },
  { keywords: ['deodorant', 'antiperspirant'],   cosmeticTag: 'en:deodorants' },
  { keywords: ['toothpaste', 'tooth paste', 'dentifrice'], cosmeticTag: 'en:toothpastes' },
  { keywords: ['lip balm', 'chapstick', 'lip care'], cosmeticTag: 'en:lip-balms' },
  { keywords: ['lipstick', 'lip gloss', 'lip colour', 'lip color'], cosmeticTag: 'en:lipsticks' },
  { keywords: ['foundation', 'bb cream', 'cc cream', 'face makeup'], cosmeticTag: 'en:foundations' },
  { keywords: ['mascara'],                       cosmeticTag: 'en:mascaras' },
  { keywords: ['eyeshadow', 'eye shadow'],       cosmeticTag: 'en:eyeshadows' },
  { keywords: ['blush', 'bronzer', 'highlighter'], cosmeticTag: 'en:blushes' },
  { keywords: ['concealer'],                     cosmeticTag: 'en:concealers' },
  { keywords: ['serum', 'face serum', 'vitamin c serum'], cosmeticTag: 'en:serums' },
  { keywords: ['face wash', 'facial wash', 'facial cleanser', 'cleanser'], cosmeticTag: 'en:facial-cleansers' },
  { keywords: ['body wash', 'shower gel', 'bath gel'], cosmeticTag: 'en:shower-gels' },
  { keywords: ['soap', 'savon', 'jabón'],        cosmeticTag: 'en:soaps' },
  { keywords: ['perfume', 'cologne', 'eau de toilette', 'fragrance', 'parfum'], cosmeticTag: 'en:perfumes' },
  { keywords: ['nail polish', 'nail varnish', 'nail lacquer'], cosmeticTag: 'en:nail-polishes' },
  { keywords: ['hair dye', 'hair color', 'hair colour', 'colourant'], cosmeticTag: 'en:hair-dyes' },
  { keywords: ['baby shampoo', 'baby wash', 'baby lotion', 'baby cream'], cosmeticTag: 'en:baby-care-products' },
  { keywords: ['toner', 'face toner', 'skin toner'], cosmeticTag: 'en:toners' },
  { keywords: ['eye cream', 'eye gel', 'under eye'], cosmeticTag: 'en:eye-creams' },
]

/**
 * Infer a canonical category tag from product name / brand text.
 * @param {string} text      – concatenation of product_name + brands + categories
 * @param {'food'|'cosmetic'} type
 * @returns {string|null}    – e.g. 'en:shampoos' or null
 */
export function inferCategoryTagFromName(text, type) {
  if (!text) return null
  const lower = text.toLowerCase()
  const field = type === 'food' ? 'foodTag' : 'cosmeticTag'
  for (const entry of CATEGORY_INFER_MAP) {
    if (!entry[field]) continue
    if (entry.keywords.some(kw => lower.includes(kw))) return entry[field]
  }
  return null
}

// ── Tier 4 ───────────────────────────────────────────────────────────────────

/**
 * Cosmetic ingredient keywords → canonical OBF category tag.
 * Matches against the first ~5 ingredients in the ingredient list.
 * Ingredients at the top are the highest concentration and most
 * diagnostic of product type.
 */
const INGREDIENT_CATEGORY_MAP = [
  // Food
  { keywords: ['wheat flour', 'flour', 'oat', 'barley', 'rye'],    foodTag: 'en:breads' },
  { keywords: ['sugar', 'glucose', 'fructose', 'corn syrup'],       foodTag: 'en:sweeteners' },
  { keywords: ['cocoa', 'cacao', 'cocoa butter', 'cocoa mass'],      foodTag: 'en:chocolates' },
  { keywords: ['milk', 'skimmed milk', 'whole milk', 'milk powder'], foodTag: 'en:dairy-products' },
  { keywords: ['tomato', 'tomato purée', 'tomato paste'],           foodTag: 'en:sauces' },
  { keywords: ['palm oil', 'sunflower oil', 'rapeseed oil', 'soybean oil', 'vegetable oil'], foodTag: 'en:oils' },
  { keywords: ['water', 'carbonated water', 'sparkling water'],     foodTag: 'en:waters' },
  { keywords: ['rice', 'rice flour'],                               foodTag: 'en:rices' },
  { keywords: ['soya', 'soy', 'tofu', 'edamame'],                   foodTag: 'en:plant-based-foods' },
  // Cosmetics
  { keywords: ['aqua', 'water', 'purified water', 'deionized water'], cosmeticTag: 'en:moisturisers' },
  { keywords: ['sodium lauryl sulfate', 'sodium laureth sulfate', 'sls', 'sles', 'cocamidopropyl betaine'], cosmeticTag: 'en:shampoos' },
  { keywords: ['titanium dioxide', 'zinc oxide', 'avobenzone', 'octocrylene', 'homosalate'], cosmeticTag: 'en:sun-protection-products' },
  { keywords: ['aluminum chlorohydrate', 'aluminium chlorohydrate', 'triclosan'], cosmeticTag: 'en:deodorants' },
  { keywords: ['fluoride', 'sodium fluoride', 'silica', 'sorbitol', 'sodium bicarbonate'], cosmeticTag: 'en:toothpastes' },
  { keywords: ['retinol', 'retinyl palmitate', 'hyaluronic acid', 'niacinamide', 'glycerin', 'ceramide'], cosmeticTag: 'en:serums' },
  { keywords: ['fragrance', 'parfum', 'alcohol denat', 'benzyl alcohol'], cosmeticTag: 'en:perfumes' },
  { keywords: ['pigment', 'mica', 'iron oxide', 'talc', 'ci 77'], cosmeticTag: 'en:foundations' },
  { keywords: ['carnauba wax', 'beeswax', 'candelilla wax'],        cosmeticTag: 'en:lipsticks' },
  { keywords: ['hydrogen peroxide', 'p-phenylenediamine', 'resorcinol'], cosmeticTag: 'en:hair-dyes' },
]

/**
 * Infer a category tag from the first 5 ingredients of an ingredient list.
 * @param {string} ingredientsText
 * @param {'food'|'cosmetic'} type
 * @returns {string|null}
 */
function inferCategoryTagFromIngredients(ingredientsText, type) {
  if (!ingredientsText) return null
  // Take the first ~5 ingredient tokens (comma-separated)
  const firstFive = ingredientsText
    .split(',')
    .slice(0, 5)
    .map(s => s.trim().toLowerCase())
    .join(' ')
  const field = type === 'food' ? 'foodTag' : 'cosmeticTag'
  for (const entry of INGREDIENT_CATEGORY_MAP) {
    if (!entry[field]) continue
    if (entry.keywords.some(kw => firstFive.includes(kw.toLowerCase()))) return entry[field]
  }
  return null
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Derive the best search anchor for alternatives.
 *
 * Returns { tag, strategy } where strategy is one of:
 *   'category'    – use tag as a category filter  (tier 1 or 2)
 *   'name'        – use tag as a search_terms query (tier 3)
 *   'ingredient'  – use tag as a search_terms query derived from top
 *                   ingredient keywords (tier 4)
 *   null          – no usable anchor (product has no data at all)
 *
 * @param {object} product  – raw OFF/OBF product object
 * @param {'food'|'cosmetic'} type
 */
export function getAlternativeAnchor(product, type) {
  // Tier 1: existing category tags
  const catTag = mostSpecificCategoryTag(product.categories_tags)
  if (catTag) return { tag: catTag, strategy: 'category' }

  // Tier 2: infer from product name / categories text
  const text = [product.product_name, product.brands, product.categories].filter(Boolean).join(' ')
  const inferred = inferCategoryTagFromName(text, type)
  if (inferred) return { tag: inferred, strategy: 'category' }

  // Tier 3: free-text search using product name
  const name = (product.product_name || '').trim()
  if (name.length >= 3) return { tag: name, strategy: 'name' }

  // Tier 4: infer from ingredient list keywords
  const ingredientsText = product.ingredients_text || ''
  const ingredientInferred = inferCategoryTagFromIngredients(ingredientsText, type)
  if (ingredientInferred) return { tag: ingredientInferred, strategy: 'category' }

  // Tier 4 fallback: use the first ingredient as a free-text search term
  const firstIngredient = ingredientsText.split(',')[0]?.trim()
  if (firstIngredient && firstIngredient.length >= 3) {
    return { tag: firstIngredient, strategy: 'ingredient' }
  }

  return { tag: null, strategy: null }
}

/**
 * Returns true if the anchor has enough information to attempt fetching
 * alternatives. Use this instead of checking `anchor.tag !== null` directly.
 */
export function hasUsableAnchor(anchor) {
  return anchor.tag !== null && anchor.strategy !== null
}
