import { render, screen, waitFor, within } from '@testing-library/react'
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
    // No `getByRole('banner')`: un `<header>` anidado dentro de `<main>`
    // no expone el landmark `banner` en un navegador real (verificado con
    // Playwright) — jsdom lo deja pasar igual, así que ese query mentiría.
    const cabecera = screen.getByTestId('cabecera')
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

    const cabecera = screen.getByTestId('cabecera')
    expect(within(cabecera).getByRole('heading', { name: 'huesos-mono' })).toBeInTheDocument()
    expect(
      within(cabecera).queryByRole('navigation', { name: /modo de estudio/i }),
    ).not.toBeInTheDocument()
  })

  it('en modo ficha, la cabecera es una caja redondeada como el resto (e9.7)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))
    await user.click(screen.getByRole('button', { name: /ver ficha completa/i }))

    expect(screen.getByTestId('cabecera')).toHaveClass('rounded-suave', 'shadow-dura')
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

  it('las 3 pestañas transicionan el color de fondo, activa o no', () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: /modo de estudio/i })
    for (const pestania of within(nav).getAllByRole('button')) {
      expect(pestania).toHaveClass('transition-colors', 'duration-base', 'ease-salida')
    }
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
  /**
   * El «atrás» del sistema (e9.6, ADR-013).
   *
   * `App` siembra la entrada de arranque con `replaceState`, así que la
   * entrada actual de cada montaje lleva `{ tipo: 'explorar' }` — eso es lo
   * que hace que retroceder desde aquí sea determinista pese a que jsdom
   * comparte `window.history` entre los casos de este archivo.
   */
  it('el «atrás» del sistema vuelve de la ficha a Explorar, con la selección intacta', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))
    await user.click(screen.getByRole('button', { name: /ver ficha completa/i }))
    expect(screen.getByTestId('escena-aislada-sustituida')).toBeInTheDocument()

    window.history.back()

    await waitFor(() => {
      expect(screen.queryByTestId('escena-aislada-sustituida')).not.toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: /^fémur derecho$/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('el «atrás» del sistema vuelve del test de esqueleto a la elección de variante', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^test$/i }))
    await user.click(screen.getByRole('button', { name: /esqueleto completo/i }))
    expect(screen.getByRole('button', { name: /responder/i })).toBeInTheDocument()

    window.history.back()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /esqueleto completo/i })).toBeInTheDocument()
    })
  })

  it('un state que no es un Modo devuelve a Explorar en vez de dejar la vista desincronizada', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fichas$/i }))
    expect(screen.queryByTestId('escena-sustituida')).not.toBeInTheDocument()

    // Una entrada escrita por otra cosa: otra aplicación del mismo origen, o
    // una versión anterior de esta tras un despliegue.
    window.dispatchEvent(new PopStateEvent('popstate', { state: { tipo: 'inventado' } }))

    await waitFor(() => {
      expect(screen.getByTestId('escena-sustituida')).toBeInTheDocument()
    })
  })
  it('tras volver con «← Volver», el «atrás» del sistema no reentra a la ficha', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fichas$/i }))
    await user.click(screen.getByRole('button', { name: /^miembro inferior/i }))
    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))
    expect(screen.getByTestId('escena-aislada-sustituida')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /volver/i }))
    expect(screen.queryByTestId('escena-aislada-sustituida')).not.toBeInTheDocument()

    // «Volver» retrocede en el historial: no deja una entrada nueva detrás
    // a la que el gesto del sistema pueda reentrar.
    window.history.back()

    await waitFor(() => {
      expect(screen.getByTestId('escena-sustituida')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('escena-aislada-sustituida')).not.toBeInTheDocument()
  })
  it('el «atrás» del sistema vuelve de la ficha a Fichas cuando se entró por ahí', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^fichas$/i }))
    await user.click(screen.getByRole('button', { name: /^miembro inferior/i }))
    await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))
    expect(screen.getByTestId('escena-aislada-sustituida')).toBeInTheDocument()

    window.history.back()

    // Fichas, no Explorar: el origen lo decide la entrada anterior del
    // historial, que es lo que sustituyó al campo `origen` del modo.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^miembro inferior/i })).toBeInTheDocument()
    })
    expect(screen.queryByTestId('escena-sustituida')).not.toBeInTheDocument()
  })

  describe('el menú (e9.7)', () => {
    it('el botón de menú abre el panel de privacidad y créditos', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /menú/i }))

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('cerrarlo deja la vista de fondo igual que antes de abrirlo', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /menú/i }))
      await user.click(screen.getByRole('button', { name: /cerrar/i }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^fémur derecho$/i })).toBeInTheDocument()
    })

    it('abrir y cerrar el panel no toca el historial (no es un modo, ADR-013)', async () => {
      const user = userEvent.setup()
      render(<App />)

      const largoAntes = window.history.length
      await user.click(screen.getByRole('button', { name: /menú/i }))
      await user.click(screen.getByRole('button', { name: /cerrar/i }))

      expect(window.history.length).toBe(largoAntes)
    })

    it('en modo ficha, la cabecera no muestra el botón de menú', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /^fémur derecho$/i }))
      await user.click(screen.getByRole('button', { name: /ver ficha completa/i }))

      expect(screen.queryByRole('button', { name: /menú/i })).not.toBeInTheDocument()
    })

    it('el «atrás» del sistema cierra el panel, no solo cambia la vista de fondo', async () => {
      // Hallazgo de la verificación manual (e9.7): el panel es estado
      // local, ajeno al historial por diseño — pero eso significaba que
      // sobrevivía a una navegación real del sistema, quedando montado
      // encima de una vista que ya no era la que estaba cuando se abrió.
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /^fichas$/i }))
      await user.click(screen.getByRole('button', { name: /menú/i }))
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      window.history.back()

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      expect(screen.getByRole('button', { name: /^fémur derecho$/i })).toBeInTheDocument()
    })
  })
})
