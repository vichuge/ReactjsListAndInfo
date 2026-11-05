export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-portal">
      <defs>
        <radialGradient id="portal-g" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e4ff8a" />
          <stop offset=".55" stopColor="#97ce4c" />
          <stop offset="1" stopColor="#2f7a1f" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#portal-g)" />
      <path
        d="M32 12c11 0 20 9 20 20M32 52c-11 0-20-9-20-20M18 20c8-6 20-5 26 3M46 44c-8 6-20 5-26-3"
        stroke="#1d4d12"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  )
}
