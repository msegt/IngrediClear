/**
 * Category tag utilities for Open Food Facts / Open Beauty Facts.
 *
 * Provides a 3-tier strategy so alternatives can always be fetched,
 * even when a product has no categories_tags at all:
 *
 *   Tier 1 – mostSpecificCategoryTag:  use the longest/most-specific tag in
 *             the existing categories_tags array (original behaviour).
 *
 *   Tier 2 – inferCategoryTagFromName: map the product_name / brands string
 *             to a known canonical OFF/OBF category tag via a keyword lookup.
 *             Falls back gracefully to null.
 *
 *   Tier 3 – handled by the caller: do a free-text search_terms query using
 *             the product name instead of a category filter.  See the
 *             fetchFoodAlternatives / fetchCosmeticAlternatives functions.
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

/**
 * Derive the best search anchor for alternatives.
 *
 * Returns { tag, strategy } where strategy is one of:
 *   'category'   – use tag as a category filter  (tier 1 or 2)
 *   'name'       – use tag as a search_terms query (tier 3)
 *   null         – no useful anchor found
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

  return { tag: null, strategy: null }
}
