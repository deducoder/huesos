import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { catalog } from '../../data/catalog'
import type { ProgressRecord } from '../../domain/progress'
import { findBone } from '../../domain/selection'
import type { ProgressStore } from '../../storage/progress-store'
import { TestQuestion } from './TestQuestion'

const renderScenaSustituida = (boneId: string) => <div data-testid="escena" data-hueso={boneId} />

/** Un almacén doble: sin `localStorage`, ni el de jsdom. */
function almacenFalso(inicial: ProgressRecord = {}): ProgressStore & { escrituras: number } {
  let registro = inicial
  return {
    escrituras: 0,
    read: () => registro,
    write(nuevo) {
      registro = nuevo
      this.escrituras += 1
    },
  }
}

describe('TestQuestion', () => {
  it('must-data-003: ningún nombre del catálogo aparece en el DOM antes de responder', () => {
    render(
      <TestQuestion bones={catalog} store={almacenFalso()} renderScene={renderScenaSustituida} />,
    )
    const texto = document.body.textContent ?? ''
    for (const bone of catalog) {
      expect(texto).not.toContain(bone.es)
      expect(texto).not.toContain(bone.la)
      for (const sinonimo of bone.synonyms) {
        expect(texto).not.toContain(sinonimo)
      }
    }
  })

  it('monta exactamente una escena', () => {
    render(
      <TestQuestion bones={catalog} store={almacenFalso()} renderScene={renderScenaSustituida} />,
    )
    expect(screen.getAllByTestId('escena')).toHaveLength(1)
  })

  it('muestra "Correcto" en texto al responder bien', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion bones={catalog} store={almacenFalso()} renderScene={renderScenaSustituida} />,
    )

    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    await user.type(screen.getByRole('textbox'), bone.es)
    await user.click(screen.getByRole('button', { name: /responder/i }))

    expect(screen.getByText(/^correcto$/i)).toBeInTheDocument()
  })

  it('muestra "Incorrecto" en texto al responder mal', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion bones={catalog} store={almacenFalso()} renderScene={renderScenaSustituida} />,
    )

    await user.type(screen.getByRole('textbox'), 'esta respuesta no es ningún hueso real')
    await user.click(screen.getByRole('button', { name: /responder/i }))

    expect(screen.getByText(/^incorrecto$/i)).toBeInTheDocument()
  })

  it('muestra el nombre correcto en ambas nomenclaturas al responder mal', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion bones={catalog} store={almacenFalso()} renderScene={renderScenaSustituida} />,
    )

    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    await user.type(screen.getByRole('textbox'), 'esta respuesta no es ningún hueso real')
    await user.click(screen.getByRole('button', { name: /responder/i }))

    expect(screen.getByText(bone.es, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(bone.la, { exact: false })).toBeInTheDocument()
  })

  it('no muestra ninguna nomenclatura al responder bien — ya se sabía', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion bones={catalog} store={almacenFalso()} renderScene={renderScenaSustituida} />,
    )

    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    await user.type(screen.getByRole('textbox'), bone.es)
    await user.click(screen.getByRole('button', { name: /responder/i }))

    expect(screen.queryByText(bone.la, { exact: false })).not.toBeInTheDocument()
  })

  it('el hueso preguntado sigue resaltado tras responder mal', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion bones={catalog} store={almacenFalso()} renderScene={renderScenaSustituida} />,
    )

    const antes = screen.getByTestId('escena').dataset.hueso
    await user.type(screen.getByRole('textbox'), 'esta respuesta no es ningún hueso real')
    await user.click(screen.getByRole('button', { name: /responder/i }))
    const despues = screen.getByTestId('escena').dataset.hueso

    expect(despues).toBe(antes)
  })

  it('"Siguiente pregunta" nunca repite el hueso inmediatamente anterior', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion bones={catalog} store={almacenFalso()} renderScene={renderScenaSustituida} />,
    )

    for (let i = 0; i < 50; i++) {
      const anterior = screen.getByTestId('escena').dataset.hueso
      await user.click(screen.getByRole('button', { name: /responder/i }))
      await user.click(screen.getByRole('button', { name: /siguiente pregunta/i }))
      const siguiente = screen.getByTestId('escena').dataset.hueso
      expect(siguiente).not.toBe(anterior)
    }
  })
})

describe('TestQuestion y el registro de progreso', () => {
  /** Responde la pregunta montada, bien o mal, y devuelve el hueso preguntado. */
  async function responder(store: ProgressStore, acertando: boolean) {
    const user = userEvent.setup()
    render(<TestQuestion bones={catalog} store={store} renderScene={renderScenaSustituida} />)

    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    await user.type(screen.getByRole('textbox'), acertando ? bone.es : 'una respuesta que no es')
    await user.click(screen.getByRole('button', { name: /responder/i }))
    return bone
  }

  it('anota un acierto al responder bien', async () => {
    const store = almacenFalso()
    const bone = await responder(store, true)

    expect(store.read()[bone.id]).toEqual({ correct: 1, incorrect: 0 })
  })

  it('anota un fallo al responder mal', async () => {
    const store = almacenFalso()
    const bone = await responder(store, false)

    expect(store.read()[bone.id]).toEqual({ correct: 0, incorrect: 1 })
  })

  it('acumula sobre lo que ya había guardado, no reemplaza', async () => {
    const store = almacenFalso({ 'un-hueso-de-antes': { correct: 3, incorrect: 1 } })
    const bone = await responder(store, false)

    expect(store.read()['un-hueso-de-antes']).toEqual({ correct: 3, incorrect: 1 })
    expect(store.read()[bone.id]).toEqual({ correct: 0, incorrect: 1 })
  })

  it('escribe exactamente una vez por respuesta', async () => {
    const store = almacenFalso()
    await responder(store, true)

    expect(store.escrituras).toBe(1)
  })

  it('no muestra nada del progreso en pantalla', async () => {
    const store = almacenFalso({ frontal: { correct: 9, incorrect: 9 } })
    await responder(store, true)

    expect(document.body.textContent ?? '').not.toContain('9')
  })
})
