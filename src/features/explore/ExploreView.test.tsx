import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ExploreView } from './ExploreView'

describe('la vista de exploración', () => {
  it('al elegir un hueso en la lista, el panel muestra su nombre latino', async () => {
    const user = userEvent.setup()
    render(<ExploreView />)

    expect(screen.getByText(/elegí un hueso/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))

    expect(screen.getByRole('heading', { name: /^fémur$/i })).toBeInTheDocument()
    expect(screen.getByText('os femoris')).toBeInTheDocument()
  })

  it('mantiene sincronizados la lista y el panel al cambiar de hueso', async () => {
    const user = userEvent.setup()
    render(<ExploreView />)

    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))
    expect(screen.getByRole('button', { name: /^fémur derecho$/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await user.click(screen.getByRole('button', { name: /^tibia izquierda$|^tibia izquierdo$/i }))
    expect(screen.getByRole('button', { name: /^fémur derecho$/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    // `tibia` se escribe igual en español y en Terminologia Anatomica, así que
    // aparece dos veces en el panel: se busca el encabezado, que es el nombre.
    expect(screen.getByRole('heading', { name: /^tibia$/i })).toBeInTheDocument()
  })

  it('se puede usar entera con el teclado', async () => {
    const user = userEvent.setup()
    render(<ExploreView />)
    await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('status')).not.toBeEmptyDOMElement()
  })
})
