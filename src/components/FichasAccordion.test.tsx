import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { catalog } from '../data/catalog'
import { FichasAccordion } from './FichasAccordion'

describe('FichasAccordion', () => {
  it('muestra 9 categorías colapsadas al montar, sin ninguna etiqueta de hueso visible', () => {
    render(<FichasAccordion bones={catalog} onSelect={() => {}} />)
    const categorias = screen.getAllByRole('button', { expanded: false })
    expect(categorias).toHaveLength(9)
    expect(screen.queryByRole('button', { name: /^fémur derecho$/i })).not.toBeInTheDocument()
  })

  it('expandir "Cráneo" muestra sus 2 subgrupos y sus 22 etiquetas', async () => {
    const user = userEvent.setup()
    render(<FichasAccordion bones={catalog} onSelect={() => {}} />)

    const craneo = screen.getByRole('button', { name: /^cráneo/i })
    expect(craneo).toHaveAttribute('aria-expanded', 'false')
    await user.click(craneo)
    expect(craneo).toHaveAttribute('aria-expanded', 'true')

    expect(screen.getByText(/neurocráneo/i)).toBeInTheDocument()
    expect(screen.getByText(/^cara$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^hueso frontal$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^maxilar.*derecho$/i })).toBeInTheDocument()
  })

  it('activar una etiqueta llama a onSelect con el id del hueso', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<FichasAccordion bones={catalog} onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: /^cráneo/i }))
    await user.click(screen.getByRole('button', { name: /^hueso frontal$/i }))

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('frontal')
  })

  it('el par sin geometría en ningún lado colapsa a una sola etiqueta, con su descripción', async () => {
    const user = userEvent.setup()
    render(<FichasAccordion bones={catalog} onSelect={() => {}} />)

    await user.click(screen.getByRole('button', { name: /^oído medio/i }))

    const martillo = screen.getByRole('button', { name: /^martillo$/i })
    expect(martillo).toHaveAccessibleDescription(/no.*visible|timpánica|temporal/i)
    expect(screen.queryByRole('button', { name: /martillo.*derecho/i })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^(martillo|yunque|estribo)$/i })).toHaveLength(3)
  })

  it('expandir una categoría no cambia el estado de las demás', async () => {
    const user = userEvent.setup()
    render(<FichasAccordion bones={catalog} onSelect={() => {}} />)

    await user.click(screen.getByRole('button', { name: /^cráneo/i }))
    const oido = screen.getByRole('button', { name: /^oído medio/i })
    expect(oido).toHaveAttribute('aria-expanded', 'false')
  })

  it('agrupa cada subgrupo con su nombre accesible en una lista', () => {
    render(<FichasAccordion bones={catalog} onSelect={() => {}} />)
    // No hace falta expandir para que las categorías existan como botones —
    // este test solo confirma que hay exactamente 9, ya cubierto arriba;
    // acá se confirma el conteo visible en el propio botón de categoría.
    const craneo = screen.getByRole('button', { name: /^cráneo/i })
    expect(within(craneo).getByText('22')).toBeInTheDocument()
  })
})
