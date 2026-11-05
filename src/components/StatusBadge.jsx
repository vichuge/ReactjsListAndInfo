const LABELS = { alive: 'Vivo', dead: 'Muerto', unknown: 'Desconocido' }

export default function StatusBadge({ status, className = '' }) {
  const key = (status || 'unknown').toLowerCase()
  return (
    <span className={`status status--${key} ${className}`}>
      <span className="status__dot" aria-hidden="true" />
      {LABELS[key] ?? status}
    </span>
  )
}
