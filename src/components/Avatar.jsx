import { useState } from 'react'

// Silueta de respaldo si la imagen no carga (p. ej. por rate-limit de la API)
const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#1a2540"/><circle cx="50" cy="40" r="17" fill="#3b4a6b"/><path d="M18 92c4-20 18-30 32-30s28 10 32 30z" fill="#3b4a6b"/></svg>',
  )

export default function Avatar({ src, alt = '', ...props }) {
  const [failed, setFailed] = useState(false)
  return <img src={failed ? FALLBACK : src} alt={alt} onError={() => setFailed(true)} {...props} />
}
