import React from 'react'

const TABS = [
  { id: 'scan',    label: 'Scan',    emoji: '\uD83D\uDCF7' },
  { id: 'manual',  label: 'Enter',   emoji: '\u2328\uFE0F' },
  { id: 'history', label: 'History', emoji: '\uD83D\uDD52' },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky bottom-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/60"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div role="tablist" className="flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-label={tab.label}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex-1 flex flex-col items-center justify-center py-3 gap-1 min-h-[56px] transition-all duration-150 active:scale-95 ${
              activeTab === tab.id ? 'text-brand-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span aria-hidden="true" className="text-xl leading-none">{tab.emoji}</span>
            <span className={`text-[11px] font-semibold leading-none ${
              activeTab === tab.id ? 'text-brand-400' : 'text-slate-500'
            }`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <span aria-hidden="true" className="absolute bottom-1 w-6 h-0.5 bg-brand-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
