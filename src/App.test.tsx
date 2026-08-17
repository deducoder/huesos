import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'

/**
 * Las dos escenas 3D se sustituyen por dobles: WebGL no existe en jsdom,
 * mismo criterio que `ExploreView.test.tsx` ya aplica.
 */
vi.mock('./components/SkeletonScene', () => ({
  SkeletonScene: ({ onPick }: { onPick: (id: string) => void }) => (
    <div data-testid="escena-sustituida">
      <button type="button" onClick={() => onPick('femur-right')}>
        simular clic en la escena
      </button>
    </div>
  ),
}))
vi.mock('./components/IsolatedBoneScene', () => ({
  IsolatedBoneScene: ({ boneId }: { boneId: string }) => (
    <div data-testid="escena-aislada-sustituida" data-hueso={boneId} />
  ),
}))

describe('la aplicación, de punta a punta', () => {
  it('empieza en la vista de exploración', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /^fémur derecho$/i })).toBeInTheDocument()
  })

  it('lleva a la ficha completa y vuelve conservando la selección', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))
    await user.click(screen.getByRole('button', { name: /ver ficha completa/i }))

    expect(screen.getByTestId('escena-aislada-sustituida')).toHaveAttribute(
      'data-hueso',
      'femur-right',
    )
    expect(screen.getByRole('heading', { name: /^fémur$/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /volver/i }))

    expect(screen.getByRole('button', { name: /^fémur derecho$/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('la pestaña "Fichas" muestra la lista de huesos sin montar la escena 3D', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fichas$/i }))

    expect(screen.getByRole('button', { name: /^fémur derecho$/i })).toBeInTheDocument()
    expect(screen.queryByTestId('escena-sustituida')).not.toBeInTheDocument()
  })

  it('elegir un hueso desde "Fichas" abre su detalle', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fichas$/i }))
    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))

    expect(screen.getByTestId('escena-aislada-sustituida')).toHaveAttribute(
      'data-hueso',
      'femur-right',
    )
  })

  it('"Volver" desde una ficha abierta en "Fichas" regresa a la lista de fichas, no a Explorar', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fichas$/i }))
    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))
    await user.click(screen.getByRole('button', { name: /volver/i }))

    // La lista de fichas está de vuelta, y no la escena 3D de Explorar.
    expect(screen.getByRole('button', { name: /^fémur derecho$/i })).toBeInTheDocument()
    expect(screen.queryByTestId('escena-sustituida')).not.toBeInTheDocument()
  })
})
