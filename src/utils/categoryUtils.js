/**
 * Pick the most specific category tag from an OFF/OBF categories_tags array.
 *
 * OFF encodes category hierarchy by specificity: more specific categories
 * tend to have longer slugs (more hyphens / words). For example, Nutella's
 * tags might be:
 *   ['en:spreads', 'en:sweet-spreads', 'en:nut-and-seed-spreads', 'en:hazelnut-spreads']
 *
 * Selecting the longest tag (by character length) reliably picks the most
 * specific leaf category, giving alternatives that are actually comparable
 * products rather than anything vaguely in the same broad family.
 *
 * Falls back gracefully:
 *   - If the most specific tag returns no results the caller already returns []
 *     (no further fallback needed — unrelated results are worse than none)
 */
export function mostSpecificCategoryTag(categoriesTags) {
  if (!Array.isArray(categoriesTags) || categoriesTags.length === 0) return null

  // Filter to language-prefixed tags only (e.g. 'en:...') to avoid numeric or
  // non-descriptive internal tags that occasionally appear in the array.
  const langTags = categoriesTags.filter(t => /^[a-z]{2}:/.test(t))
  const pool = langTags.length > 0 ? langTags : categoriesTags

  // Longest slug = most specific leaf category
  return pool.reduce((best, tag) => tag.length > best.length ? tag : best, pool[0])
}
