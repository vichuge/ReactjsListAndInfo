import { getPageItems } from '../utils/pagination'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const items = getPageItems(page, totalPages)

  return (
    <nav className="pagination" aria-label="Paginación">
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        ‹ <span className="pagination__label">Anterior</span>
      </button>
      <ol className="pagination__pages">
        {items.map((item) =>
          typeof item === 'string' ? (
            <li key={item} className="pagination__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={`pagination__btn ${item === page ? 'is-active' : ''}`}
                onClick={() => onChange(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Página ${item}`}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ol>
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
      >
        <span className="pagination__label">Siguiente</span> ›
      </button>
    </nav>
  )
}
