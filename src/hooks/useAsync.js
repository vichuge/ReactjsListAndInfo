import { useEffect, useState } from 'react'

/**
 * Ejecuta `fn(signal)` cada vez que cambian `deps`, cancelando la petición
 * anterior para evitar condiciones de carrera. Mientras carga conserva el
 * último `data` resuelto.
 */
export function useAsync(fn, deps) {
  const [attempt, setAttempt] = useState(0)
  const key = JSON.stringify([...deps, attempt])
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()
    fn(controller.signal).then(
      (data) => !controller.signal.aborted && setResult({ key, data, error: null }),
      (error) => !controller.signal.aborted && setResult({ key, data: null, error }),
    )
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const loading = result.key !== key
  return {
    data: result.data,
    error: loading ? null : result.error,
    loading,
    retry: () => setAttempt((n) => n + 1),
  }
}
