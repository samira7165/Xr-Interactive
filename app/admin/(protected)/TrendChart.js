'use client'

import { useRef, useState } from 'react'

const WIDTH = 600
const HEIGHT = 200
const PAD_LEFT = 36
const PAD_BOTTOM = 22
const PAD_TOP = 10

export default function TrendChart({ data }) {
  const svgRef = useRef(null)
  const [hoverIndex, setHoverIndex] = useState(null)

  const values = data.map(d => d.count)
  const max = Math.max(1, ...values)
  const plotWidth = WIDTH - PAD_LEFT
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM

  const xFor = i => PAD_LEFT + (i / (data.length - 1)) * plotWidth
  const yFor = v => PAD_TOP + plotHeight - (v / max) * plotHeight

  const linePoints = data.map((d, i) => `${xFor(i)},${yFor(d.count)}`).join(' ')
  const areaPoints = `${PAD_LEFT},${PAD_TOP + plotHeight} ${linePoints} ${xFor(data.length - 1)},${PAD_TOP + plotHeight}`

  const yTicks = [0, 0.5, 1].map(f => Math.round(max * f))
  const tickEvery = Math.ceil(data.length / 6)

  function handleMove(e) {
    const rect = svgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH
    const ratio = (x - PAD_LEFT) / plotWidth
    const i = Math.round(ratio * (data.length - 1))
    setHoverIndex(Math.min(data.length - 1, Math.max(0, i)))
  }

  const hovered = hoverIndex !== null ? data[hoverIndex] : null
  const tooltipLeft = hoverIndex !== null ? (xFor(hoverIndex) / WIDTH) * 100 : 0
  const flipTooltip = tooltipLeft > 70

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {yTicks.map((t, i) => {
          const y = yFor(t)
          return (
            <g key={i}>
              <line x1={PAD_LEFT} x2={WIDTH} y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
              <text x={PAD_LEFT - 8} y={y + 3} fontSize="9" fill="var(--text-muted)" textAnchor="end">
                {t}
              </text>
            </g>
          )
        })}

        {data.map((d, i) => (
          i % tickEvery === 0 && (
            <text key={i} x={xFor(i)} y={HEIGHT - 4} fontSize="9" fill="var(--text-muted)" textAnchor="middle">
              {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
          )
        ))}

        <polygon points={areaPoints} fill="var(--accent)" opacity="0.1" />
        <polyline points={linePoints} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {hoverIndex !== null && (
          <>
            <line
              x1={xFor(hoverIndex)} x2={xFor(hoverIndex)}
              y1={PAD_TOP} y2={PAD_TOP + plotHeight}
              stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="3,3"
            />
            <circle cx={xFor(hoverIndex)} cy={yFor(hovered.count)} r="4" fill="var(--accent)" stroke="var(--bg-card)" strokeWidth="2" />
          </>
        )}
      </svg>

      {hovered && (
        <div
          style={{
            position: 'absolute', top: 0,
            left: flipTooltip ? undefined : `${tooltipLeft}%`,
            right: flipTooltip ? `${100 - tooltipLeft}%` : undefined,
            transform: flipTooltip ? 'translate(8px, 0)' : 'translate(-8px, 0)',
            background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px',
            padding: '0.5rem 0.7rem', fontSize: '0.78rem', pointerEvents: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
          }}
        >
          <div style={{ color: 'var(--text-muted)', marginBottom: '0.15rem' }}>
            {new Date(hovered.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div style={{ fontWeight: 700 }}>{hovered.count} visits</div>
        </div>
      )}
    </div>
  )
}
