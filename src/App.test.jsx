import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { jsonResponse, lawnmower, morty, pilot, rick } from './test/fixtures'

function mockApi(routes) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
    const match = Object.keys(routes).find((k) => url.includes(k))
    if (!match) return jsonResponse({ error: 'There is nothing here' }, 404)
    const r = routes[match]
    return typeof r === 'function' ? r(url) : jsonResponse(r)
  })
}

const page = (results, pages = 42) => ({
  info: { count: pages * 20, pages, next: null, prev: null },
  results,
})

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('Home', () => {
  it('lista personajes y pagina', async () => {
    const spy = mockApi({ '/character/?': page([rick, morty]) })
    renderAt('/')
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Morty Smith')).toBeInTheDocument()
    expect(screen.getByText(/página 1 de 42/)).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Página siguiente'))
    await waitFor(() => expect(spy.mock.calls.at(-1)[0]).toContain('page=2'))
    expect(await screen.findByText(/página 2 de 42/)).toBeInTheDocument()
  })

  it('no vuelve a pedir datos en bucle', async () => {
    const spy = mockApi({ '/character/?': page([rick]) })
    renderAt('/')
    await screen.findByText('Rick Sanchez')
    await new Promise((r) => setTimeout(r, 50))
    // StrictMode puede montar dos veces; nunca más que eso
    expect(spy.mock.calls.length).toBeLessThanOrEqual(2)
  })

  it('busca por nombre con debounce y muestra estado vacío', async () => {
    const spy = mockApi({
      '/character/?': (url) => (url.includes('name=zzz') ? jsonResponse({ error: 'x' }, 404) : jsonResponse(page([rick]))),
    })
    renderAt('/')
    await screen.findByText('Rick Sanchez')
    await userEvent.type(screen.getByRole('searchbox'), 'zzz')
    expect(await screen.findByText('Ningún personaje en esta dimensión')).toBeInTheDocument()
    expect(spy.mock.calls.filter(([u]) => u.includes('name=')).length).toBe(1)
  })

  it('filtra por estado', async () => {
    const spy = mockApi({ '/character/?': page([rick]) })
    renderAt('/?page=5')
    await screen.findByText('Rick Sanchez')
    await userEvent.click(screen.getByRole('radio', { name: 'Muertos' }))
    await waitFor(() => expect(spy.mock.calls.at(-1)[0]).toMatch(/page=1&status=dead$/))
    expect(screen.getByRole('radio', { name: 'Muertos' })).toHaveAttribute('aria-checked', 'true')
  })

  it('muestra error con opción de reintentar', async () => {
    let fail = true
    mockApi({ '/character/?': () => (fail ? Promise.reject(new TypeError('offline')) : jsonResponse(page([rick]))) })
    renderAt('/')
    expect(await screen.findByText('No pudimos abrir el portal')).toBeInTheDocument()
    fail = false
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument()
  })
})

describe('Detalle', () => {
  it('muestra datos y episodios, y vuelve al listado con sus filtros', async () => {
    mockApi({
      '/character/?': page([rick]),
      '/character/1': rick,
      '/episode/1,2': [pilot, lawnmower],
    })
    renderAt('/?page=3&status=alive')
    await userEvent.click(await screen.findByText('Rick Sanchez'))

    expect(await screen.findByRole('heading', { level: 1, name: 'Rick Sanchez' })).toBeInTheDocument()
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument()
    expect(screen.getByText('2 episodios')).toBeInTheDocument()
    expect(await screen.findByText('Lawnmower Dog')).toBeInTheDocument()

    await userEvent.click(screen.getByText(/Volver al listado/))
    expect(await screen.findByRole('radio', { name: 'Vivos' })).toHaveAttribute('aria-checked', 'true')
    expect(await screen.findByText(/página 3 de 42/)).toBeInTheDocument()
  })

  it('maneja personajes inexistentes', async () => {
    mockApi({})
    renderAt('/character/99999')
    expect(await screen.findByText(/no existe/)).toBeInTheDocument()
  })

  it('rechaza ids inválidos sin llamar a la API', async () => {
    const spy = mockApi({})
    renderAt('/character/abc')
    expect(await screen.findByText(/no existe/)).toBeInTheDocument()
    expect(spy).not.toHaveBeenCalled()
  })
})

it('muestra 404 en rutas desconocidas', () => {
  mockApi({})
  renderAt('/esto/no/existe')
  expect(screen.getByText('Página no encontrada')).toBeInTheDocument()
})
