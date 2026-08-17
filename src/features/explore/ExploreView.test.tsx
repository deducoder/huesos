import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ExploreView } from './ExploreView'

/**
 * La escena se sustituye por un doble.
 *
 * No es para esquivar un fallo: **WebGL no existe en jsdom**, así que renderizar
 * el canvas aquí no probaría nada aunque montara. Lo que esta prueba verifica es
 * la sincronía entre la lista y el panel — la vía accesible de ADR-002 —, y para
 * eso la escena es ruido. Que la escena se vea de verdad se comprueba a mano, y
 * el scope de e2.4 lo declara así.
 */
vi.mock('../../components/SkeletonScene', () => ({
  SkeletonScene: ({
    selectedMesh,
    onPick,
  }: {
    selectedMesh: string | null
    onPick: (id: string) => void
  }) => (
    <div data-testid="escena-sustituida" data-malla={selectedMesh ?? ''}>
      <button type="button" onClick={() => onPick('tibia-left')}>
        simular clic en la escena
      </button>
    </div>
  ),
}))

describe('la vista de exploración', () => {
  it('monta la escena junto a la lista y el panel', () => {
    render(<ExploreView />)
    expect(screen.getByTestId('escena-sustituida')).toBeInTheDocument()
  })

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

  it('pasa a la escena la malla del hueso elegido, no su identificador', async () => {
    const user = userEvent.setup()
    render(<ExploreView />)
    await user.click(screen.getByRole('button', { name: /^fémur izquierdo$/i }))
    // `femur-left` y `femur-right` comparten malla: el modelo solo trae el
    // hemicuerpo derecho y el lado lo pone el catálogo.
    expect(screen.getByTestId('escena-sustituida')).toHaveAttribute('data-malla', 'Femur.r')
  })

  it('no pasa ninguna malla cuando el hueso elegido no tiene geometría', async () => {
    const user = userEvent.setup()
    render(<ExploreView />)
    await user.click(screen.getByRole('button', { name: /^martillo izquierdo$/i }))
    expect(screen.getByTestId('escena-sustituida')).toHaveAttribute('data-malla', '')
    expect(screen.getByText(/no se puede señalar/i)).toBeInTheDocument()
  })

  it('refleja en la lista un hueso elegido desde la escena', async () => {
    const user = userEvent.setup()
    render(<ExploreView />)
    await user.click(screen.getByRole('button', { name: /simular clic en la escena/i }))
    expect(screen.getByRole('button', { name: /^tibia izquierdo$/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('nunca marca más de un hueso a la vez', async () => {
    const user = userEvent.setup()
    render(<ExploreView />)
    await user.click(screen.getByRole('button', { name: /^fémur izquierdo$/i }))
    await user.click(screen.getByRole('button', { name: /simular clic en la escena/i }))
    const marcados = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-pressed') === 'true')
    expect(marcados).toHaveLength(1)
  })
})
