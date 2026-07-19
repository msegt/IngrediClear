import React from 'react'

const RISKY_PACKAGING = [
  {
    pattern: 'polystyrene',
    label: 'Polystyrene packaging',
    detail: 'Polystyrene (PS, recycling code 6) is poorly recyclable and may leach styrene into fatty or hot foods. IARC classifies styrene as possibly carcinogenic (Group 2B).',
    source: { label: 'IARC — Styrene (Group 2B)', url: 'https://monographs.iarc.who.int/list-of-classifications/' },
  },
  {
    pattern: 'pvc',
    label: 'PVC packaging',
    detail: 'Polyvinyl chloride (PVC) may contain plasticisers (phthalates) that are endocrine disruptors. Use is restricted in food contact materials in the EU.',
    source: { label: 'EFSA — Plasticisers in food contact materials', url: 'https://www.efsa.europa.eu/en/topics/topic/food-contact-materials' },
  },
  {
    pattern: 'bisphenol',
    label: 'BPA / Bisphenol',
    detail: 'Bisphenol A (BPA) is an endocrine disruptor banned from baby bottles in the EU since 2011. EFSA significantly lowered the TDI for BPA in 2023 due to immune system effects.',
    source: { label: 'EFSA — Re-evaluation of BPA (2023)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2023.6857' },
  },
]

export default function PackagingFlags({ packagingTags = [] }) {
  const tags = packagingTags.map(t => t.toLowerCase())
  const risks = RISKY_PACKAGING.filter(risk =>
    tags.some(tag => tag.includes(risk.pattern))
  )
  if (risks.length === 0) return null

  return (
    <div className="card p-4 border border-yellow-500/30 bg-yellow-500/10">
      <p className="text-sm font-semibold text-yellow-300 mb-2">
        <span aria-hidden="true">📦 </span>Packaging concern
      </p>
      <div className="flex flex-col gap-3">
        {risks.map((risk, i) => (
          <div key={i}>
            <p className="text-sm font-semibold text-white">{risk.label}</p>
            <p className="text-xs text-slate-400 mt-1">{risk.detail}</p>
            <div className="mt-1.5">
              <a
                href={risk.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2"
              >
                <span aria-hidden="true">🔗 </span>{risk.source.label}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
