import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCharacters } from '../api'
import { useAsync } from '../hooks/useAsync'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import CharacterCard, { CharacterCardSkeleton } from '../components/CharacterCard'
import StateMessage from '../components/StateMessage'
import Portal from '../components/Portal'

const PAGE_SIZE = 20

export default function Home() {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1)
  const name = params.get('name') ?? ''
  const status = params.get('status') ?? ''
  const gender = params.get('gender') ?? ''

  const { data, error, loading, retry } = useAsync(
    (signal) => getCharacters({ page, name, status, gender }, signal),
    [page, name, status, gender],
  )

  useEffect(() => {
    document.title = 'Rick and Morty Explorer'
  }, [])

  const updateParams = (changes, options) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, String(v)) : next.delete(k)))
      // Cualquier cambio de filtro regresa a la página 1
      if (!('page' in changes) || changes.page === 1) next.delete('page')
      return next
    }, options)
  }

  const totalPages = data?.info.pages ?? 0
  const total = data?.info.count ?? 0

  // Página fuera de rango (p. ej. ?page=999)
  const outOfRange = !loading && !error && total > 0 && page > totalPages

  return (
    <>
      <section className="hero">
        <Portal className="hero__portal" />
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="drip-title">
              Rick and{" "}
              <br />
              Morty
            </span>
            <span className="hero__kicker">Explorer</span>
          </h1>
        </div>
      </section>

      <Filters name={name} status={status} gender={gender} onChange={updateParams} />

      <div className="results-bar" aria-live="polite">
        {!loading && !error && total > 0 && (
          <p>
            <strong>{total.toLocaleString('es')}</strong> personajes · página {page} de {totalPages}
          </p>
        )}
      </div>

      {error ? (
        <StateMessage
          tone="error"
          title="No pudimos abrir el portal"
          action={
            <button type="button" className="btn" onClick={retry}>
              Reintentar
            </button>
          }
        >
          Hubo un problema al conectar con la API. Revisa tu conexión e inténtalo de nuevo.
        </StateMessage>
      ) : outOfRange ? (
        <StateMessage
          title="Esta página no existe"
          action={
            <button type="button" className="btn" onClick={() => updateParams({ page: 1 })}>
              Ir a la primera página
            </button>
          }
        >
          Solo hay {totalPages} páginas de resultados.
        </StateMessage>
      ) : !loading && data.results.length === 0 ? (
        <StateMessage
          title="Ningún personaje en esta dimensión"
          action={
            <button
              type="button"
              className="btn"
              onClick={() => updateParams({ name: '', status: '', gender: '' })}
            >
              Limpiar filtros
            </button>
          }
        >
          No encontramos personajes que coincidan con tu búsqueda.
        </StateMessage>
      ) : (
        <ul className="grid" aria-busy={loading}>
          {loading
            ? Array.from({ length: PAGE_SIZE }, (_, i) => <CharacterCardSkeleton key={i} />)
            : data.results.map((c) => <CharacterCard key={c.id} character={c} />)}
        </ul>
      )}

      {!error && !outOfRange && (
        <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParams({ page: p })} />
      )}
    </>
  )
}
