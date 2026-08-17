import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../src/App'

/**
 * El segundo ángulo de `must-privacy-006`: que nadie **llame** a la red
 * mientras la aplicación se usa.
 *
 * Complementa la comprobación estática de `privacy.test.ts`, que solo mira el
 * código propio. Esta atrapa lo que aquella no puede: una dependencia que
 * telefonee a casa por su cuenta.
 *
 * Las escenas 3D se sustituyen porque WebGL no existe en jsdom — mismo criterio
 * que `App.test.tsx`. El activo `.glb` se carga dentro de ellas y es un recurso
 * del propio origen, no un tercero; de ese lado vigila la suite de navegador.
 */
vi.mock('../src/components/SkeletonScene', () => ({
  SkeletonScene: () => <div data-testid="escena-sustituida" />,
}))
vi.mock('../src/components/IsolatedBoneScene', () => ({
  IsolatedBoneScene: () => <div data-testid="escena-aislada-sustituida" />,
}))

describe('must-privacy-006: nada sale a la red mientras se usa la aplicación', () => {
  const llamadas: string[] = []

  beforeEach(() => {
    llamadas.length = 0
    vi.stubGlobal('fetch', (...args: unknown[]) => {
      llamadas.push(`fetch ${String(args[0])}`)
      return Promise.reject(new Error('must-privacy-006'))
    })
    vi.stubGlobal(
      'XMLHttpRequest',
      class {
        open(_metodo: string, url: string) {
          llamadas.push(`XMLHttpRequest ${url}`)
        }
        send() {}
        setRequestHeader() {}
        addEventListener() {}
      },
    )
    vi.stubGlobal('navigator', {
      ...navigator,
      sendBeacon: (url: string) => {
        llamadas.push(`sendBeacon ${url}`)
        return false
      },
    })
  })

  afterEach(() => vi.unstubAllGlobals())

  it('no llama a la red al arrancar ni al explorar', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Fichas' }))

    expect(llamadas).toEqual([])
  })

  it('no llama a la red al responder una pregunta del modo test', async () => {
    // El caso que importa para `RF-09`: es exactamente aquí donde el progreso
    // del estudiante se genera y se guarda.
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Test' }))
    await user.click(screen.getByRole('button', { name: 'Hueso aislado' }))
    await user.type(screen.getByRole('textbox'), 'una respuesta cualquiera')
    await user.click(screen.getByRole('button', { name: /responder/i }))

    expect(screen.getByText(/^correcto$|^incorrecto$/i)).toBeInTheDocument()
    expect(llamadas, 'el progreso no sale del navegador').toEqual([])
  })

  it('los espías detectan de verdad una llamada', () => {
    // Sin esto, un espía mal instalado daría lista vacía y las dos pruebas
    // anteriores pasarían por no haber mirado. Verde por no buscar.
    fetch('https://analitica.example/evento').catch(() => {})
    navigator.sendBeacon('https://analitica.example/beacon')

    expect(llamadas).toEqual([
      'fetch https://analitica.example/evento',
      'sendBeacon https://analitica.example/beacon',
    ])
  })
})
