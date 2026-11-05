const API_URL = 'https://rickandmortyapi.com/api'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const MAX_RETRIES = 2
// En tests no esperamos entre reintentos
const BASE_DELAY_MS = import.meta.env?.MODE === 'test' ? 0 : 1000
const MAX_DELAY_MS = 5000
const isRetryable = (status) => status === 429 || status >= 500

const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(id)
      reject(signal.reason)
    })
  })

function retryDelay(attempt, res) {
  if (!BASE_DELAY_MS) return 0
  const retryAfter = Number(res?.headers.get('retry-after'))
  const ms = retryAfter > 0 ? retryAfter * 1000 : BASE_DELAY_MS * 2 ** attempt
  return Math.min(ms, MAX_DELAY_MS)
}

// Caché en memoria: evita repetir peticiones (y el rate-limit de la API)
const cache = new Map()
const CACHE_LIMIT = 200

export function clearCache() {
  cache.clear()
}

async function request(path, signal, attempt = 0) {
  if (cache.has(path)) return cache.get(path)

  let res
  try {
    res = await fetch(`${API_URL}${path}`, { signal })
  } catch (err) {
    // La API responde 429 sin cabeceras CORS, así que el navegador lo reporta
    // como error de red: se trata igual que un fallo transitorio.
    if (attempt < MAX_RETRIES && !signal?.aborted) {
      await wait(retryDelay(attempt), signal)
      return request(path, signal, attempt + 1)
    }
    throw err
  }
  if (!res.ok && attempt < MAX_RETRIES && isRetryable(res.status)) {
    await wait(retryDelay(attempt, res), signal)
    return request(path, signal, attempt + 1)
  }
  if (!res.ok) {
    throw new ApiError(
      res.status === 404 ? 'No encontrado' : `Error del servidor (${res.status})`,
      res.status,
    )
  }
  const data = await res.json()
  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value)
  cache.set(path, data)
  return data
}

const EMPTY_PAGE = { info: { count: 0, pages: 0, next: null, prev: null }, results: [] }

/**
 * Lista paginada de personajes. La API responde 404 cuando un filtro no
 * tiene coincidencias; en ese caso devolvemos una página vacía.
 */
export async function getCharacters({ page = 1, name, status, gender } = {}, signal) {
  const params = new URLSearchParams({ page: String(page) })
  if (name) params.set('name', name)
  if (status) params.set('status', status)
  if (gender) params.set('gender', gender)
  try {
    return await request(`/character/?${params}`, signal)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return EMPTY_PAGE
    throw err
  }
}

export function getCharacter(id, signal) {
  return request(`/character/${encodeURIComponent(id)}`, signal)
}

/** Obtiene varios episodios de una sola petición a partir de sus URLs. */
export async function getEpisodes(urls, signal) {
  const ids = urls.map((u) => u.split('/').pop()).filter(Boolean)
  if (ids.length === 0) return []
  const data = await request(`/episode/${ids.join(',')}`, signal)
  // Con un solo id la API devuelve un objeto en lugar de un arreglo
  return Array.isArray(data) ? data : [data]
}
