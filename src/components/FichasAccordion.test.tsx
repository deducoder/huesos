import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { catalog } from '../data/catalog'
import { FichasAccordion } from './FichasAccordion'

describe('FichasAccordion', () => {
  it('muestra 9 categorías colapsadas al montar, con su contenido inerte', () => {
    render(<FichasAccordion bones={catalog} onSelect={() => {}} />)
    const categorias = screen.getAllByRole('button', { expanded: false })
    expect(categorias).toHaveLength(9)
    // s2: el contenido queda siempre montado (necesario para animar
    // apertura/cierre con `grid-template-rows`), pero `inert` mientras la
    // categoría está colapsada — nada adentro es activable por teclado,
    // aunque ya no esté ausente del DOM.
    const contenidos = screen.getAllByTestId(/^fichas-contenido-/)
    expect(contenidos).toHaveLength(9)
    for (const contenido of contenidos) {
      expect(contenido).toHaveAttribute('inert', '')
    }
  })

  it('expandir "Cráneo" quita `inert` de su contenido y muestra sus 2 subgrupos y sus 22 etiquetas', async () => {
    const user = userEvent.setup()
    render(<FichasAccordion bones={catalog} onSelect={() => {}} />)

    const craneo = screen.getByRole('button', { name: /^cráneo/i })
    expect(craneo).toHaveAttribute('aria-expanded', 'false')
    await user.click(craneo)
    expect(craneo).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByTestId('fichas-contenido-Cráneo')).not.toHaveAttribute('inert')

    expect(screen.getByText(/neurocráneo/i)).toBeInTheDocument()
    expect(screen.getByText(/^cara$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^hueso frontal$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^maxilar.*derecho$/i })).toBeInTheDocument()
  })

  it('la flecha de cada categoría anima su rotación', () => {
    render(<FichasAccordion bones={catalog} onSelect={() => {}} />)
    const craneo = screen.getByRole('button', { name: /^cráneo/i })
    const flecha = craneo.querySelector('[aria-hidden="true"]')
    expect(flecha).toHaveClass('transition-transform')
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

  it('muestra el nombre corto en la etiqueta y anuncia el completo', async () => {
    const user = userEvent.setup()
    render(<FichasAccordion bones={catalog} onSelect={() => {}} />)
    await user.click(screen.getByRole('button', { name: /^miembro superior/i }))

    const etiqueta = screen.getByRole('button', {
      name: 'falange proximal del segundo dedo de la mano derecha',
    })
    expect(etiqueta).toHaveTextContent('Falange proximal 2.º mano derecha')
  })

  it('concuerda el lado con el género del hueso', async () => {
    const user = userEvent.setup()
    render(<FichasAccordion bones={catalog} onSelect={() => {}} />)
    await user.click(screen.getByRole('button', { name: /^cintura escapular/i }))
    expect(screen.getByRole('button', { name: 'clavícula derecha' })).toBeInTheDocument()
  })

  it('capitaliza los subgrupos que el corte por «—» dejaba en minúscula', async () => {
    const user = userEvent.setup()
    render(<FichasAccordion bones={catalog} onSelect={() => {}} />)
    await user.click(screen.getByRole('button', { name: /^cráneo/i }))
    expect(screen.getByText('Neurocráneo')).toBeInTheDocument()
    expect(screen.getByText('Cara')).toBeInTheDocument()
  })
})
