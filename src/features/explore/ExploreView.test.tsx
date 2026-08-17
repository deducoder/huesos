import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { type SelectionId, toggleSelection } from '../../domain/selection'
import { ExploreView } from './ExploreView'

/**
 * `ExploreView` es controlada desde e3.2: quien la monta posee la selección,
 * porque al volver de la ficha completa tiene que sobrevivir. Este arnés
 * hace exactamente lo que `App` hace de verdad, para que las pruebas de
 * interacción existentes sigan probando lo mismo que antes.
 */
function ExploreViewConSuEstado() {
  const [selected, setSelected] = useState<SelectionId>(null)
  return (
    <ExploreView
      selected={selected}
      onSelect={(id) => setSelected((actual) => toggleSelection(actual, id))}
    />
  )
}

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
    selected,
    onPick,
  }: {
    selected: string | null
    onPick: (id: string) => void
  }) => (
    <div data-testid="escena-sustituida" data-hueso={selected ?? ''}>
      <button type="button" onClick={() => onPick('tibia-left')}>
        simular clic en la escena
      </button>
    </div>
  ),
}))

describe('la vista de exploración', () => {
  it('monta la escena junto a la lista y el panel', () => {
    render(<ExploreViewConSuEstado />)
    expect(screen.getByTestId('escena-sustituida')).toBeInTheDocument()
  })

  it('sin selección, no hay tarjeta de identidad flotando', () => {
    // e7.6: antes de elegir, la vista es solo el lienzo — ni siquiera se
    // monta el estado vacío de BoneIdentity, porque no hay nada que flote.
    render(<ExploreViewConSuEstado />)
    expect(screen.queryByText(/elegí un hueso/i)).not.toBeInTheDocument()
  })

  it('al elegir un hueso en la lista, la tarjeta muestra su nombre latino', async () => {
    const user = userEvent.setup()
    render(<ExploreViewConSuEstado />)

    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))

    expect(screen.getByRole('heading', { name: /^fémur$/i })).toBeInTheDocument()
    expect(screen.getByText('os femoris')).toBeInTheDocument()
  })

  it('la tarjeta tiene un botón para cerrarla sin volver a tocar el hueso en la escena', async () => {
    const user = userEvent.setup()
    render(<ExploreViewConSuEstado />)

    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))
    expect(screen.getByRole('heading', { name: /^fémur$/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(screen.queryByRole('heading', { name: /^fémur$/i })).not.toBeInTheDocument()
  })

  it('mantiene sincronizados la lista y el panel al cambiar de hueso', async () => {
    const user = userEvent.setup()
    render(<ExploreViewConSuEstado />)

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
    render(<ExploreViewConSuEstado />)
    await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('status')).not.toBeEmptyDOMElement()
  })

  it('pasa a la escena el hueso elegido, no su malla', async () => {
    const user = userEvent.setup()
    render(<ExploreViewConSuEstado />)
    await user.click(screen.getByRole('button', { name: /^fémur izquierdo$/i }))
    // Corregido en b2.1: la escena recibe el `id`, no el `meshName`.
    // `femur-left` y `femur-right` comparten malla, así que pasarle la malla la
    // obligaría a encender los dos lados. Solo la escena sabe en qué mitad se
    // pulsó, así que es ella quien resuelve malla + mitad → hueso.
    expect(screen.getByTestId('escena-sustituida')).toHaveAttribute('data-hueso', 'femur-left')
  })

  it('avisa cuando el hueso elegido no tiene geometría que resaltar', async () => {
    const user = userEvent.setup()
    render(<ExploreViewConSuEstado />)
    // e7.4: martillo no tiene malla en ningún lado, así que el navegador lo
    // ofrece como una sola fila —elegir lado no distingue nada observable—
    // y selecciona `malleus-right` por convención.
    await user.click(screen.getByRole('button', { name: /^martillo$/i }))
    // La escena recibe el id igual; no encontrará malla para él, que es lo
    // correcto, y el panel lo explica.
    expect(screen.getByTestId('escena-sustituida')).toHaveAttribute('data-hueso', 'malleus-right')
    expect(screen.getByText(/no se puede señalar/i)).toBeInTheDocument()
  })

  it('refleja en la lista un hueso elegido desde la escena', async () => {
    const user = userEvent.setup()
    render(<ExploreViewConSuEstado />)
    await user.click(screen.getByRole('button', { name: /simular clic en la escena/i }))
    expect(screen.getByRole('button', { name: /^tibia izquierdo$/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('nunca marca más de un hueso a la vez', async () => {
    const user = userEvent.setup()
    render(<ExploreViewConSuEstado />)
    await user.click(screen.getByRole('button', { name: /^fémur izquierdo$/i }))
    await user.click(screen.getByRole('button', { name: /simular clic en la escena/i }))
    const marcados = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-pressed') === 'true')
    expect(marcados).toHaveLength(1)
  })
})
