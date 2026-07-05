import React from 'react'

const TABS = [
  { id: 'scan',    label: 'Scan',    emoji: '📷' },
  { id: 'manual',  label: 'Enter',   emoji: '⌨️' },
  { id: 'history', label: 'History', emoji: '🕒' },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav
      className="sticky bottom-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/60"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-150 active:scale-95 ${
              activeTab === tab.id ? 'text-brand-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-xl leading-none">{tab.emoji}</span>
            <span className={`text-[10px] font-semibold leading-none ${
              activeTab === tab.id ? 'text-brand-400' : 'text-slate-500'
            }`}>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-brand-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
