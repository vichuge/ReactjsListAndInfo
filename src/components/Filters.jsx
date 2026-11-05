import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'alive', label: 'Vivos' },
  { value: 'dead', label: 'Muertos' },
  { value: 'unknown', label: 'Desconocido' },
]

const GENDER_OPTIONS = [
  { value: '', label: 'Cualquier género' },
  { value: 'female', label: 'Femenino' },
  { value: 'male', label: 'Masculino' },
  { value: 'genderless', label: 'Sin género' },
  { value: 'unknown', label: 'Desconocido' },
]

export default function Filters({ name, status, gender, onChange }) {
  const [query, setQuery] = useState(name)
  const [syncedName, setSyncedName] = useState(name)
  const debouncedQuery = useDebounce(query.trim())

  // Si la URL cambia (atrás/adelante, limpiar filtros), sincroniza el input
  if (name !== syncedName) {
    setSyncedName(name)
    setQuery(name)
  }

  useEffect(() => {
    if (debouncedQuery !== name) onChange({ name: debouncedQuery }, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  const hasFilters = Boolean(name || status || gender)

  return (
    <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="search">
        <svg className="search__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <label htmlFor="search" className="sr-only">
          Buscar personaje por nombre
        </label>
        <input
          id="search"
          type="search"
          placeholder="Buscar por nombre… ej. Rick, Morty, Birdperson"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="filters__row">
        <div className="chips" role="radiogroup" aria-label="Estado">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value || 'all'}
              type="button"
              role="radio"
              aria-checked={status === opt.value}
              className={`chip ${opt.value ? `chip--${opt.value}` : ''} ${status === opt.value ? 'is-active' : ''}`}
              onClick={() => onChange({ status: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="filters__right">
          <label htmlFor="gender" className="sr-only">
            Género
          </label>
          <select
            id="gender"
            className="select"
            value={gender}
            onChange={(e) => onChange({ gender: e.target.value })}
          >
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setQuery('')
                onChange({ name: '', status: '', gender: '' })
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
