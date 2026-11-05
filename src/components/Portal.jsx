// Portal interdimensional animado, generado con SVG (ilustración original)
const C = 100

function wobblyCircle(r, amp, waves, steps = 72) {
  const pts = Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2
    const rr = r + Math.sin(a * waves) * amp + Math.sin(a * (waves + 3) + 1) * amp * 0.5
    return `${(C + Math.cos(a) * rr).toFixed(1)},${(C + Math.sin(a) * rr).toFixed(1)}`
  })
  return `M${pts.join('L')}Z`
}

function spiral(offset, turns = 1.6, steps = 40) {
  return (
    'M' +
    Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps
      const a = offset + t * turns * Math.PI * 2
      const r = 6 + t * 68
      return `${(C + Math.cos(a) * r).toFixed(1)},${(C + Math.sin(a) * r).toFixed(1)}`
    }).join('L')
  )
}

const OUTER = wobblyCircle(90, 4, 7)
const INNER = wobblyCircle(80, 3, 9)
const ARMS = [0, 1, 2, 3].map((i) => spiral((i * Math.PI) / 2))
const SPARKS = Array.from({ length: 26 }, (_, i) => {
  const a = i * 2.39996 // ángulo áureo
  const r = 14 + ((i * 37) % 62)
  return { x: C + Math.cos(a) * r, y: C + Math.sin(a) * r, s: 1.5 + (i % 4) * 0.9 }
})

export default function Portal({ className = '' }) {
  return (
    <svg className={`portal ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id="portal-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f6ffc2" />
          <stop offset=".3" stopColor="#c6f56a" />
          <stop offset=".7" stopColor="#6fc93a" />
          <stop offset="1" stopColor="#3a9a24" />
        </radialGradient>
      </defs>
      <path d={OUTER} fill="#7fd13b" stroke="#245c16" strokeWidth="3" />
      <path d={INNER} fill="url(#portal-fill)" />
      <g className="portal__swirl">
        {ARMS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#e9ffa6" strokeWidth="5" strokeLinecap="round" opacity=".55" />
        ))}
        {ARMS.map((d, i) => (
          <path key={`d${i}`} d={d} fill="none" stroke="#3f9e22" strokeWidth="2" strokeLinecap="round" opacity=".45" transform="rotate(20 100 100)" />
        ))}
      </g>
      <g className="portal__sparks">
        {SPARKS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.s} fill={i % 3 ? '#ffffff' : '#fff36b'} />
        ))}
      </g>
    </svg>
  )
}
