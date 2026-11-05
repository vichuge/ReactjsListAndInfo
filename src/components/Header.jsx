import { Link } from 'react-router-dom'
import Logo from './Logo'
import { useTheme } from '../hooks/useTheme'

export default function Header() {
  const [theme, toggleTheme] = useTheme()
  const nextTheme = theme === 'dark' ? 'claro' : 'oscuro'

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand" aria-label="Rick and Morty Explorer, ir al inicio">
          <Logo />
          <span className="brand__text">
            Rick <span className="brand__amp">&amp;</span> Morty <small>Explorer</small>
          </span>
        </Link>
        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={`Cambiar a tema ${nextTheme}`}
          title={`Tema ${nextTheme}`}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <circle cx="12" cy="12" r="4.5" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}
