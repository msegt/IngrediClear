import React, { useMemo } from 'react'
import { getWeeklyProgress, getProgressSummary } from '../data/progressTracker.js'

const NOVA_COLORS = {
  1: '#1d8348',
  2: '#58b55e',
  3: '#f07e18',
  4: '#d63a2f',
}

function novaColor(avg) {
  if (avg <= 1.5) return NOVA_COLORS[1]
  if (avg <= 2.5) return NOVA_COLORS[2]
  if (avg <= 3.2) return NOVA_COLORS[3]
  return NOVA_COLORS[4]
}

const TREND_LABELS = {
  improving: 'Improving',
  worsening: 'More processed',
  stable:    'Stable',
}

const TREND_EMOJI = {
  improving: '📉',
  worsening: '📈',
  stable:    '➡️',
}

export default function ProgressTracker() {
  const weeks   = useMemo(() => getWeeklyProgress(), [])
  const summary = useMemo(() => getProgressSummary(), [])

  if (!summary) {
    return (
      <div className="card p-8 flex flex-col items-center text-center gap-3" role="status">
        <span aria-hidden="true" className="text-4xl">📊</span>
        <p className="font-semibold text-white">No food scans tracked yet</p>
        <p className="text-sm text-slate-400">
          Scan food products to track your weekly average food processing level over time.
        </p>
      </div>
    )
  }

  const maxNova    = 4
  const BAR_HEIGHT = 80

  // Build a descriptive label for the chart that enumerates each week's data
  const chartAriaLabel = weeks.length
    ? `Weekly NOVA averages: ${
        weeks.map(w => `${w.weekLabel} — NOVA ${w.avgNova} (${w.count} scan${w.count !== 1 ? 's' : ''})`).join(', ')
      }`
    : 'Weekly NOVA bar chart — no data'

  return (
    <section aria-label="Progress tracker" className="flex flex-col gap-4">
      <h2 className="font-semibold text-white">
        <span aria-hidden="true">📊 </span>Food processing tracker
      </h2>

      <div className="card p-4 flex flex-wrap gap-4 justify-between">
        <div className="text-center">
          <p className="text-xs text-slate-400">Avg NOVA (all time)</p>
          <p
            className="text-2xl font-black mt-1"
            aria-label={`Average NOVA score all time: ${summary.overallAvg}`}
            style={{ color: novaColor(summary.overallAvg) }}
          >
            <span aria-hidden="true">{summary.overallAvg}</span>
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Weekly trend</p>
          <p className="text-sm font-semibold mt-1 text-white">
            <span aria-hidden="true">{TREND_EMOJI[summary.trend]} </span>
            {TREND_LABELS[summary.trend]}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Food scans</p>
          <p
            className="text-2xl font-black mt-1 text-white"
            aria-label={`Total food scans: ${summary.scanCount}`}
          >
            <span aria-hidden="true">{summary.scanCount}</span>
          </p>
        </div>
      </div>

      <div className="card p-4">
        <p className="text-xs text-slate-400 mb-3">Average NOVA by week (lower = less processed)</p>
        {weeks.length === 1 ? (
          <p className="text-xs text-slate-500">Scan more products across multiple weeks to see a trend.</p>
        ) : (
          <div
            className="flex items-end gap-2 overflow-x-auto pb-2"
            style={{ minHeight: BAR_HEIGHT + 32 }}
            role="img"
            aria-label={chartAriaLabel}
          >
            {weeks.map(week => {
              const height     = Math.round((week.avgNova / maxNova) * BAR_HEIGHT)
              const color      = novaColor(week.avgNova)
              const shortLabel = week.weekLabel.split('-')[1]
              return (
                <div
                  key={week.weekLabel}
                  className="flex flex-col items-center gap-1 flex-shrink-0"
                  style={{ minWidth: 36 }}
                  aria-hidden="true"
                >
                  <span className="text-xs font-bold" style={{ color }}>{week.avgNova}</span>
                  <div
                    className="w-7 rounded-t-lg transition-all"
                    style={{ height, backgroundColor: color }}
                  />
                  <span className="text-[10px] text-slate-500">{shortLabel}</span>
                </div>
              )
            })}
          </div>
        )}
        <p className="text-xs text-slate-600 mt-2">
          NOVA scale: 1 = unprocessed · 2 = culinary ingredient · 3 = processed · 4 = ultra-processed.
          Based on{' '}
          <a
            href="https://world.openfoodfacts.org/nova"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 underline underline-offset-2"
          >
            Open Food Facts NOVA data
            <span className="sr-only"> (opens in new tab)</span>
          </a>.
        </p>
      </div>
    </section>
  )
}
