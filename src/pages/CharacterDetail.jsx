import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ApiError, getCharacter, getEpisodes } from '../api'
import { useAsync } from '../hooks/useAsync'
import StatusBadge from '../components/StatusBadge'
import Avatar from '../components/Avatar'
import StateMessage from '../components/StateMessage'

const GENDER = { Female: 'Femenino', Male: 'Masculino', Genderless: 'Sin género', unknown: 'Desconocido' }

function BackLink() {
  const { state } = useLocation()
  const from = state?.from
  const to = from ? `${from.pathname}${from.search}` : '/'
  return (
    <Link to={to} className="back-link">
      ← Volver al listado
    </Link>
  )
}

export default function CharacterDetail() {
  const { id } = useParams()
  const validId = /^\d+$/.test(id) && Number(id) > 0

  const character = useAsync(
    (signal) => (validId ? getCharacter(id, signal) : Promise.reject(new ApiError('No encontrado', 404))),
    [id],
  )
  const c = character.data

  const episodes = useAsync(
    (signal) => (c ? getEpisodes(c.episode, signal) : Promise.resolve(null)),
    [c?.id],
  )

  useEffect(() => {
    if (c) document.title = `${c.name} · Rick and Morty Explorer`
  }, [c])

  if (character.error) {
    const notFound = character.error.status === 404
    return (
      <>
        <BackLink />
        <StateMessage
          tone={notFound ? 'neutral' : 'error'}
          title={notFound ? 'Este personaje no existe… en esta dimensión' : 'No pudimos cargar al personaje'}
          action={
            notFound ? (
              <Link to="/" className="btn">
                Ver todos los personajes
              </Link>
            ) : (
              <button type="button" className="btn" onClick={character.retry}>
                Reintentar
              </button>
            )
          }
        />
      </>
    )
  }

  if (character.loading || !c) {
    return (
      <>
        <BackLink />
        <div className="detail" aria-busy="true" aria-label="Cargando personaje">
          <div className="detail__image skeleton" />
          <div className="detail__info">
            <div className="skeleton skeleton--title big" />
            <div className="skeleton skeleton--text" />
            <div className="skeleton skeleton--text short" />
          </div>
        </div>
      </>
    )
  }

  const facts = [
    { label: 'Especie', value: c.species },
    { label: 'Tipo', value: c.type || '—' },
    { label: 'Género', value: GENDER[c.gender] ?? c.gender },
    { label: 'Origen', value: c.origin?.name === 'unknown' ? 'Desconocido' : c.origin?.name },
    { label: 'Última ubicación', value: c.location?.name === 'unknown' ? 'Desconocida' : c.location?.name },
    { label: 'Apariciones', value: `${c.episode.length} episodio${c.episode.length === 1 ? '' : 's'}` },
  ]

  return (
    <>
      <BackLink />
      <article className="detail">
        <div className="detail__image">
          <Avatar key={c.id} src={c.image} alt={c.name} width="300" height="300" />
        </div>
        <div className="detail__info">
          <StatusBadge status={c.status} />
          <h1 className="detail__name">{c.name}</h1>
          <dl className="facts">
            {facts.map((f) => (
              <div key={f.label} className="fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>

      <section className="episodes" aria-labelledby="episodes-title">
        <h2 id="episodes-title">Episodios</h2>
        {episodes.error ? (
          <p className="muted">
            No se pudieron cargar los episodios.{' '}
            <button type="button" className="link-btn" onClick={episodes.retry}>
              Reintentar
            </button>
          </p>
        ) : episodes.loading || !episodes.data ? (
          <ul className="episodes__list" aria-busy="true">
            {Array.from({ length: Math.min(c.episode.length, 6) }, (_, i) => (
              <li key={i} className="episode skeleton episode--skeleton" />
            ))}
          </ul>
        ) : (
          <ul className="episodes__list">
            {episodes.data.map((ep) => (
              <li key={ep.id} className="episode">
                <span className="episode__code">{ep.episode}</span>
                <span className="episode__name">{ep.name}</span>
                <span className="episode__date">{ep.air_date}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
