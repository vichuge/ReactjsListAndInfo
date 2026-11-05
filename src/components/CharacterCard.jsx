import { Link, useLocation } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import Avatar from './Avatar'

const place = (name, fallback) => (!name || name === 'unknown' ? fallback : name)

export default function CharacterCard({ character }) {
  const location = useLocation()
  const { id, name, image, species, status, location: lastLocation, origin } = character

  return (
    <li className="card">
      <Link to={`/character/${id}`} state={{ from: location }} className="card__link">
        <div className="card__media">
          <Avatar src={image} loading="lazy" width="300" height="300" />
          <StatusBadge status={status} className="card__status" />
        </div>
        <div className="card__body">
          <h3 className="card__title">{name}</h3>
          <p className="card__species">{species}</p>
          <dl className="card__meta">
            <div>
              <dt>Última ubicación</dt>
              <dd>{place(lastLocation?.name, 'Desconocida')}</dd>
            </div>
            <div>
              <dt>Origen</dt>
              <dd>{place(origin?.name, 'Desconocido')}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </li>
  )
}

export function CharacterCardSkeleton() {
  return (
    <li className="card card--skeleton" aria-hidden="true">
      <div className="card__media skeleton" />
      <div className="card__body">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text short" />
      </div>
    </li>
  )
}
