import { render, screen, within } from '@testing-library/react'
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

  it('el título y las pestañas viven en la misma cabecera (e8.1)', () => {
    render(<App />)
    const cabecera = screen.getByRole('banner')
    expect(within(cabecera).getByRole('heading', { name: 'huesos-mono' })).toBeInTheDocument()
    expect(
      within(cabecera).getByRole('navigation', { name: /modo de estudio/i }),
    ).toBeInTheDocument()
  })

  it('en modo ficha, la cabecera muestra el título sin las pestañas', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))
    await user.click(screen.getByRole('button', { name: /ver ficha completa/i }))

    const cabecera = screen.getByRole('banner')
    expect(within(cabecera).getByRole('heading', { name: 'huesos-mono' })).toBeInTheDocument()
    expect(
      within(cabecera).queryByRole('navigation', { name: /modo de estudio/i }),
    ).not.toBeInTheDocument()
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

  it('la pestaña "Fichas" muestra el acordeón de categorías sin montar la escena 3D', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fichas$/i }))

    expect(screen.getByRole('button', { name: /^miembro inferior/i })).toBeInTheDocument()
    expect(screen.queryByTestId('escena-sustituida')).not.toBeInTheDocument()
  })

  it('elegir un hueso desde "Fichas" abre su detalle', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fichas$/i }))
    await user.click(screen.getByRole('button', { name: /^miembro inferior/i }))
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
    await user.click(screen.getByRole('button', { name: /^miembro inferior/i }))
    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))
    await user.click(screen.getByRole('button', { name: /volver/i }))

    // La lista de fichas está de vuelta, y no la escena 3D de Explorar.
    expect(screen.getByRole('button', { name: /^miembro inferior/i })).toBeInTheDocument()
    expect(screen.queryByTestId('escena-sustituida')).not.toBeInTheDocument()
  })

  it('la pestaña "Test" ofrece elegir entre esqueleto completo y hueso aislado', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^test$/i }))

    expect(screen.getByRole('button', { name: /esqueleto completo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hueso aislado/i })).toBeInTheDocument()
    expect(screen.queryByTestId('escena-sustituida')).not.toBeInTheDocument()
    expect(screen.queryByTestId('escena-aislada-sustituida')).not.toBeInTheDocument()
  })

  it('elegir "Esqueleto completo" monta el modo test sobre la escena completa', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^test$/i }))
    await user.click(screen.getByRole('button', { name: /esqueleto completo/i }))

    expect(screen.getByTestId('escena-sustituida')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /responder/i })).toBeInTheDocument()
  })

  it('elegir "Hueso aislado" monta el modo test sobre el hueso aislado', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^test$/i }))
    await user.click(screen.getByRole('button', { name: /hueso aislado/i }))

    expect(screen.getByTestId('escena-aislada-sustituida')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /responder/i })).toBeInTheDocument()
  })
})
