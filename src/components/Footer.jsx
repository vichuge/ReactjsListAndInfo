export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          Datos de{' '}
          <a href="https://rickandmortyapi.com/" target="_blank" rel="noreferrer">
            The Rick and Morty API
          </a>
        </p>
        <p>
          Hecho por{' '}
          <a href="https://github.com/vichuge" target="_blank" rel="noreferrer">
            Victor Pacheco
          </a>{' '}
          · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
