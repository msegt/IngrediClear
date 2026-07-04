// Detects product category from product name/categories and returns
// category-specific warnings to show users at point of check.

const CATEGORY_MAP = [
  {
    id: 'Sunscreen',
    keywords: ['sun', 'sunscreen', 'spf', 'solar', 'solaire', 'uv', 'sunblock', 'bronzer'],
    warnings: [
      'Check for oxybenzone and octinoxate — hormone disruptors; prefer mineral (zinc oxide) sunscreens.',
      'Spray sunscreens pose inhalation risk from nano-particles — prefer lotions or sticks.',
      'Reef-safe certification means free from oxybenzone & octinoxate, which are toxic to coral.'
    ]
  },
  {
    id: 'Shampoo',
    keywords: ['shampoo', 'hair wash', 'scalp', 'cheveux', 'shampooing'],
    warnings: [
      'SLS/SLES are common in shampoos and strip scalp oils — look for sulfate-free alternatives.',
      'Dimethicone builds up on hair over time — clarifying washes help, or choose silicone-free.',
      'Fragrance (parfum) in hair products sits close to the scalp — worth avoiding if you have sensitivity.'
    ]
  },
  {
    id: 'Moisturiser',
    keywords: ['moisturiser', 'moisturizer', 'lotion', 'cream', 'hydrat', 'body butter', 'day cream', 'night cream', 'face cream'],
    warnings: [
      'Leave-on products have higher exposure than rinse-off — ingredient safety matters more here.',
      'Retinol in leave-on products increases photosensitivity — always pair with SPF in the morning.',
      'Fragrance in leave-on face products is a leading cause of contact dermatitis.'
    ]
  },
  {
    id: 'Deodorant',
    keywords: ['deodorant', 'antiperspirant', 'deo', 'underarm', 'aisselle'],
    warnings: [
      'Aluminium compounds in antiperspirants have been studied for links to breast cancer — evidence is mixed but some choose to avoid.',
      'Applied to broken or freshly-shaved skin, deodorant ingredients absorb more readily — apply to intact skin.',
      'Triclosan is still present in some antibacterial deodorants — check the label.'
    ]
  },
  {
    id: 'Hair Dye',
    keywords: ['hair dye', 'hair color', 'hair colour', 'coloring', 'colouring', 'teinture', 'colorant'],
    warnings: [
      'p-Phenylenediamine (PPD) is a very common allergen in dark hair dyes — always patch test 48h before.',
      'Coal tar dyes (CI numbers) in hair colourants are linked to cancer with occupational exposure.',
      'Henna can be safe but "black henna" often contains PPD — check ingredients carefully.'
    ]
  },
  {
    id: 'Makeup',
    keywords: ['makeup', 'foundation', 'lipstick', 'mascara', 'eyeshadow', 'blush', 'concealer', 'maquillage', 'rouge'],
    warnings: [
      'Lead has been found as a contaminant in some lipsticks — check for transparent brand safety reports.',
      'Eye area products (mascara, liner) carry higher risk — avoid if irritation occurs and check for parabens.',
      'Talc-based face powders — ensure products use certified cosmetic-grade talc tested for asbestos.'
    ]
  },
  {
    id: 'Baby Product',
    keywords: ['baby', 'infant', 'newborn', 'nappy', 'diaper', 'bébé', 'enfant'],
    warnings: [
      "Baby skin is thinner and absorbs ingredients more readily — choose fragrance-free, hypoallergenic formulas.",
      'Avoid talc-based baby powders due to inhalation and asbestos contamination risks.',
      'Phenoxyethanol is restricted in baby products in some countries — check local regulations.'
    ]
  }
]

export function detectCategory(product) {
  const text = [
    product.product_name || '',
    product.categories || '',
    product.labels || ''
  ].join(' ').toLowerCase()

  for (const cat of CATEGORY_MAP) {
    if (cat.keywords.some(k => text.includes(k))) return cat.id
  }
  return null
}

export function getCategoryWarnings(categoryId) {
  if (!categoryId) return []
  return CATEGORY_MAP.find(c => c.id === categoryId)?.warnings || []
}
