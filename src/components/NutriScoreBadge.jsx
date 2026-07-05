import React from 'react'

const GRADES = [
  { letter: 'A', bg: '#1d8348', text: '#ffffff' },
  { letter: 'B', bg: '#58b55e', text: '#ffffff' },
  { letter: 'C', bg: '#f9c623', text: '#1a1a1a' },
  { letter: 'D', bg: '#f07e18', text: '#ffffff' },
  { letter: 'E', bg: '#d63a2f', text: '#ffffff' },
]

// Heights for the staircase shape: A is tallest, E shortest when active;
// when a different letter is active the scale reverses so the active one
// is always the tallest tile in its half.
const BASE_H  = [44, 38, 32, 38, 44]  // inactive heights (symmetrical staircase)
const ACTIVE_H = 52                    // active tile is always tallest

export default function NutriScoreBadge({ grade }) {
  if (!grade) return null
  const active = grade.toUpperCase()
  const activeIdx = GRADES.findIndex(g => g.letter === active)
  if (activeIdx === -1) return null

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-slate-400 font-medium">Nutri-Score</p>
      <div className="flex items-end gap-0.5" role="img" aria-label={`Nutri-Score ${active}`}>
        {GRADES.map((g, i) => {
          const isActive = i === activeIdx
          const height = isActive ? ACTIVE_H : BASE_H[i]
          return (
            <div
              key={g.letter}
              style={{
                backgroundColor: isActive ? g.bg : g.bg + '55',
                height: `${height}px`,
                minWidth: isActive ? '36px' : '28px',
                transition: 'all 0.2s ease',
              }}
              className={`flex items-center justify-center rounded-sm ${
                isActive ? 'shadow-lg ring-2 ring-white/30' : ''
              }`}
            >
              <span
                style={{ color: isActive ? g.text : g.text + '99' }}
                className={`font-black select-none ${
                  isActive ? 'text-base' : 'text-xs'
                }`}
              >
                {g.letter}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
