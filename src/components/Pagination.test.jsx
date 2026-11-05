import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from './Pagination'
import { getPageItems } from '../utils/pagination'

describe('getPageItems', () => {
  it('muestra todas las páginas cuando son pocas', () => {
    expect(getPageItems(2, 4)).toEqual([1, 2, 3, 4])
  })
  it('agrega saltos en medio', () => {
    expect(getPageItems(10, 42)).toEqual([1, 'gap-9', 9, 10, 11, 'gap-42', 42])
  })
  it('rellena un hueco de una sola página en vez de poner …', () => {
    expect(getPageItems(3, 42)).toEqual([1, 2, 3, 4, 'gap-42', 42])
  })
})

describe('<Pagination>', () => {
  it('navega y deshabilita en los extremos', async () => {
    const onChange = vi.fn()
    render(<Pagination page={1} totalPages={42} onChange={onChange} />)
    expect(screen.getByLabelText('Página anterior')).toBeDisabled()
    expect(screen.getByLabelText('Página 1')).toHaveAttribute('aria-current', 'page')
    await userEvent.click(screen.getByLabelText('Página siguiente'))
    await userEvent.click(screen.getByLabelText('Página 42'))
    expect(onChange.mock.calls).toEqual([[2], [42]])
  })

  it('no se muestra con una sola página', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })
})
