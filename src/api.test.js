import { describe, expect, it, vi } from 'vitest'
import { getCharacters, getEpisodes, getCharacter } from './api'
import { jsonResponse, pilot, lawnmower } from './test/fixtures'

describe('api', () => {
  it('construye la URL con filtros', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => jsonResponse({ info: {}, results: [] }))
    await getCharacters({ page: 3, name: 'rick', status: 'alive', gender: '' })
    expect(spy.mock.calls[0][0]).toBe(
      'https://rickandmortyapi.com/api/character/?page=3&name=rick&status=alive',
    )
  })

  it('devuelve una página vacía cuando la API responde 404', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => jsonResponse({ error: 'There is nothing here' }, 404))
    const data = await getCharacters({ name: 'zzzz' })
    expect(data.results).toEqual([])
    expect(data.info.count).toBe(0)
  })

  it('propaga errores del servidor', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => jsonResponse({}, 500))
    await expect(getCharacters()).rejects.toMatchObject({ status: 500 })
    await expect(getCharacter(1)).rejects.toMatchObject({ status: 500 })
  })

  it('reintenta una vez ante errores transitorios (429)', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => jsonResponse({}, 429))
      .mockImplementationOnce(() => jsonResponse({ id: 1 }))
    expect(await getCharacter(1)).toEqual({ id: 1 })
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('se rinde tras agotar los reintentos', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.reject(new TypeError('Failed to fetch')))
    await expect(getCharacter(7)).rejects.toThrow('Failed to fetch')
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('cachea respuestas exitosas', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => jsonResponse({ id: 3 }))
    await getCharacter(3)
    await getCharacter(3)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('normaliza episodios cuando solo hay uno', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => jsonResponse(pilot))
    expect(await getEpisodes(['https://rickandmortyapi.com/api/episode/1'])).toEqual([pilot])
    spy.mockImplementation(() => jsonResponse([pilot, lawnmower]))
    expect(await getEpisodes(['.../episode/1', '.../episode/2'])).toHaveLength(2)
    expect(spy.mock.calls[1][0]).toMatch(/\/episode\/1,2$/)
  })

  it('no hace petición si no hay episodios', async () => {
    const spy = vi.spyOn(globalThis, 'fetch')
    expect(await getEpisodes([])).toEqual([])
    expect(spy).not.toHaveBeenCalled()
  })
})
