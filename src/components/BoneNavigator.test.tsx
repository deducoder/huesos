import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { catalog } from '../data/catalog'
import { BoneNavigator } from './BoneNavigator'

describe('el navegador de huesos', () => {
  it('anuncia cada hueso por su nombre y su lado, no como «botón» a secas', () => {
    render(<BoneNavigator bones={catalog} selected={null} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: /fémur.*derecho/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fémur.*izquierdo/i })).toBeInTheDocument()
  })

  it('no pone lado a un hueso impar', () => {
    render(<BoneNavigator bones={catalog} selected={null} onSelect={() => {}} />)
    const esfenoides = screen.getByRole('button', { name: /^esfenoides$/i })
    expect(esfenoides).toBeInTheDocument()
  })

  it('agrupa los huesos en una lista por región, con su nombre accesible', () => {
    render(<BoneNavigator bones={catalog} selected={null} onSelect={() => {}} />)
    const grupos = screen.getAllByRole('list')
    expect(grupos.length).toBe(10)
    const columna = screen.getByRole('list', { name: /columna vertebral/i })
    expect(within(columna).getAllByRole('button')).toHaveLength(26)
  })

  it('deja activar un hueso solo con el teclado', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<BoneNavigator bones={catalog} selected={null} onSelect={onSelect} />)

    await user.tab()
    expect(document.activeElement).toHaveAttribute('type', 'button')
    await user.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0]?.[0]).toBe(catalog[0]?.id)
  })

  it('expone la selección por atributo, no solo por color', () => {
    render(<BoneNavigator bones={catalog} selected="femur-right" onSelect={() => {}} />)
    const elegido = screen.getByRole('button', { name: /fémur.*derecho/i })
    expect(elegido).toHaveAttribute('aria-pressed', 'true')
    const otro = screen.getByRole('button', { name: /fémur.*izquierdo/i })
    expect(otro).toHaveAttribute('aria-pressed', 'false')
  })

  it('avisa de que un hueso sin geometría no se puede mostrar, y por qué', () => {
    render(<BoneNavigator bones={catalog} selected={null} onSelect={() => {}} />)
    const martillo = screen.getByRole('button', { name: /martillo.*izquierdo/i })
    expect(martillo).toHaveAccessibleDescription(/no.*visible|timpánica|temporal/i)
  })
})
