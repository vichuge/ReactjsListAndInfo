import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const { pathname, search } = useLocation()

  // Al navegar a otra vista o página, volver arriba
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, search])

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <Header />
      <main id="main" className="container" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
