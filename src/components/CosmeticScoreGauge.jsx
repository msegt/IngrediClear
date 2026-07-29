import React from 'react'

const IMPACT_STYLE = {
  positive: {
    row:   'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
    badge: 'bg-emerald-500/20 text-emerald-300',
    icon:  'text-emerald-400',
  },
  negative: {
    row:   'text-red-300 bg-red-500/10 border-red-500/25',
    badge: 'bg-red-500/20 text-red-300',
    icon:  'text-red-400',
  },
  neutral: {
    row:   'text-slate-300 bg-slate-700/30 border-slate-600/30',
    badge: 'bg-slate-600/40 text-slate-400',
    icon:  'text-slate-400',
  },
}

const IMPACT_ICON  = { positive: '+', negative: '\u2212', neutral: '\u2022' }
const IMPACT_LABEL = { positive: 'Good', negative: 'Concern', neutral: 'Info' }

function DeltaBadge({ delta, style }) {
  if (delta === null || delta === undefined) return null
  const sign = delta > 0 ? '+' : ''
  return (
    <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${style.badge}`}>
      {sign}{delta} pts
    </span>
  )
}

export default function CosmeticScoreGauge({ score, scoreReasons = [] }) {
  const circumference = 2 * Math.PI * 54
  const hasScore = score !== null && score !== undefined
  const clampedScore = hasScore ? Math.max(0, Math.min(100, score)) : 0
  const offset = circumference - (clampedScore / 100) * circumference
  const scoreColor = !hasScore
    ? '#475569'
    : score >= 75 ? '#10b981'
    : score >= 50 ? '#f59e0b'
    : '#ef4444'

  const gaugeLabel = hasScore
    ? `Safety score: ${score} out of 100`
    : 'Safety score: not enough data to calculate'

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Gauge */}
      <div className="flex flex-col items-center justify-center">
        <div
          className="relative w-36 h-36"
          role="img"
          aria-label={gaugeLabel}
        >
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90" aria-hidden="true" focusable="false">
            <circle cx="70" cy="70" r="54" stroke="#1e293b" strokeWidth="12" fill="none" />
            {hasScore && (
              <circle
                cx="70" cy="70" r="54"
                stroke={scoreColor}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
            {hasScore ? (
              <>
                <span className="text-3xl font-bold text-white">{score}</span>
                <span className="text-xs text-slate-400">/100</span>
              </>
            ) : (
              <span className="text-3xl text-slate-500">?</span>
            )}
          </div>
        </div>
        <p className="text-sm font-semibold text-white mt-2" aria-hidden="true">Safety score</p>
        {!hasScore && (
          <p className="text-xs text-slate-400 text-center mt-1 max-w-[140px] leading-snug">
            Not enough data
          </p>
        )}
      </div>

      {/* Score breakdown */}
      {scoreReasons.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Score breakdown</p>
          {scoreReasons.map((reason, i) => {
            const style = IMPACT_STYLE[reason.impact]
            return (
              <div
                key={i}
                className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 border text-xs ${style.row}`}
              >
                <span
                  className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${style.badge}`}
                  aria-label={IMPACT_LABEL[reason.impact]}
                >
                  <span aria-hidden="true">{IMPACT_ICON[reason.impact]}</span>
                </span>
                <span className="flex-1 leading-relaxed">{reason.text}</span>
                <DeltaBadge delta={reason.delta} style={style} />
              </div>
            )
          })}
          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
            Score based on EU CosIng / SCCS hazard data. Higher scores indicate fewer flagged ingredients. Not a substitute for professional dermatological advice.
          </p>
        </div>
      )}
    </div>
  )
}
