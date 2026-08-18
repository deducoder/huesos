import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { catalog } from '../../data/catalog'
import type { ProgressRecord } from '../../domain/progress'
import { findBone } from '../../domain/selection'
import type { ProgressStore } from '../../storage/progress-store'
import { shortName } from '../../components/bone-name'
import { TestQuestion } from './TestQuestion'

const renderScenaSustituida = (boneId: string) => <div data-testid="escena" data-hueso={boneId} />

/** `onCambiarModo` es requerida (e9.2); ningún test de este archivo la ejercita. */
const cambiarModoNoop = () => {}

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
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        answerFormat="open"
        onCambiarModo={cambiarModoNoop}
      />,
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
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        answerFormat="open"
        onCambiarModo={cambiarModoNoop}
      />,
    )
    expect(screen.getAllByTestId('escena')).toHaveLength(1)
  })

  it('muestra "Correcto" en texto al responder bien', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        answerFormat="open"
        onCambiarModo={cambiarModoNoop}
      />,
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
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        answerFormat="open"
        onCambiarModo={cambiarModoNoop}
      />,
    )

    await user.type(screen.getByRole('textbox'), 'esta respuesta no es ningún hueso real')
    await user.click(screen.getByRole('button', { name: /responder/i }))

    expect(screen.getByText(/^incorrecto$/i)).toBeInTheDocument()
  })

  it('muestra el nombre correcto en ambas nomenclaturas al responder mal', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        answerFormat="open"
        onCambiarModo={cambiarModoNoop}
      />,
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
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        answerFormat="open"
        onCambiarModo={cambiarModoNoop}
      />,
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
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        answerFormat="open"
        onCambiarModo={cambiarModoNoop}
      />,
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
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        answerFormat="open"
        onCambiarModo={cambiarModoNoop}
      />,
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

describe('TestQuestion y el alto reservado de la escena', () => {
  it('pasa a renderScene un segundo argumento numérico, no solo el id', () => {
    const renderScene = vi.fn((boneId: string, _reservedBottom: number) => (
      <div data-testid="escena" data-hueso={boneId} />
    ))
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScene}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    expect(renderScene).toHaveBeenCalled()
    const [, reservedBottom] = renderScene.mock.calls[0] ?? []
    expect(typeof reservedBottom).toBe('number')
  })
})

describe('TestQuestion — modo opción múltiple (formato por defecto)', () => {
  it('no hay ningún campo de texto en el formato por defecto', () => {
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('muestra exactamente 3 opciones, ninguna marcada como correcta', () => {
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    const opciones = within(grupo).getAllByRole('button')
    expect(opciones).toHaveLength(3)
    for (const opcion of opciones) {
      expect(opcion).toHaveAttribute('aria-pressed', 'false')
    }
  })

  it('una de las 3 opciones es el hueso preguntado', () => {
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    expect(within(grupo).getByRole('button', { name: shortName(bone.es) })).toBeInTheDocument()
  })

  it('"Responder" está deshabilitado hasta elegir una opción', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    const responderBtn = screen.getByRole('button', { name: /^responder$/i })
    expect(responderBtn).toBeDisabled()

    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    const [primeraOpcion] = within(grupo).getAllByRole('button')
    if (!primeraOpcion) throw new Error('no había ninguna opción para elegir')
    await user.click(primeraOpcion)

    expect(responderBtn).toBeEnabled()
  })

  it('elegir la opción correcta y responder registra un acierto', async () => {
    const user = userEvent.setup()
    const store = almacenFalso()
    render(
      <TestQuestion
        bones={catalog}
        store={store}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )

    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    await user.click(within(grupo).getByRole('button', { name: shortName(bone.es) }))
    await user.click(screen.getByRole('button', { name: /^responder$/i }))

    expect(screen.getByText(/^correcto$/i)).toBeInTheDocument()
    expect(store.read()[bone.id]).toEqual({ correct: 1, incorrect: 0 })
  })

  it('elegir una opción incorrecta y responder registra un fallo, y muestra el nombre correcto', async () => {
    const user = userEvent.setup()
    const store = almacenFalso()
    render(
      <TestQuestion
        bones={catalog}
        store={store}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )

    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    const opciones = within(grupo).getAllByRole('button')
    // Las opciones muestran el nombre corto (e9.5), no `bone.es`: comparar
    // contra el completo no distinguía nada y hacía este test intermitente.
    const incorrecta = opciones.find((o) => o.textContent !== shortName(bone.es))
    if (!incorrecta) throw new Error('las 3 opciones eran todas el hueso correcto')
    await user.click(incorrecta)
    await user.click(screen.getByRole('button', { name: /^responder$/i }))

    // Acotado al aviso de resultado, no al documento entero: desde e9.2 la
    // grilla se queda montada, y la opción correcta también muestra el
    // nombre del hueso (capitalizado). Para los huesos cuyo nombre corto es
    // solo una capitalización del completo (p. ej. «peroné» → «Peroné»),
    // buscar en todo el documento encuentra dos coincidencias y revienta.
    const aviso = screen.getByRole('status')
    expect(within(aviso).getByText(/^incorrecto$/i)).toBeInTheDocument()
    expect(within(aviso).getByText(bone.es, { exact: false })).toBeInTheDocument()
    expect(within(aviso).getByText(bone.la, { exact: false })).toBeInTheDocument()
    expect(store.read()[bone.id]).toEqual({ correct: 0, incorrect: 1 })
  })

  it('tras responder mal, las tres opciones se quedan en pantalla', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    const opciones = within(screen.getByRole('group', { name: /qué hueso es/i })).getAllByRole(
      'button',
    )
    const incorrecta = opciones.find((o) => o.textContent !== shortName(bone.es))
    if (!incorrecta) throw new Error('las 3 opciones eran todas el hueso correcto')
    await user.click(incorrecta)
    await user.click(screen.getByRole('button', { name: /^responder$/i }))

    // Consultado de nuevo tras responder, no reutilizando la referencia de
    // antes: si el grupo entero se hubiera desmontado, `getByRole` fallaría
    // acá en vez de devolver en silencio los hijos de un nodo ya huérfano.
    const grupoTrasResponder = screen.getByRole('group', { name: /qué hueso es/i })
    expect(within(grupoTrasResponder).getAllByRole('button')).toHaveLength(3)
  })

  it('marca la opción correcta como acierto aunque el estudiante haya fallado', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    const opciones = within(grupo).getAllByRole('button')
    const incorrecta = opciones.find((o) => o.textContent !== shortName(bone.es))
    if (!incorrecta) throw new Error('las 3 opciones eran todas el hueso correcto')
    await user.click(incorrecta)
    await user.click(screen.getByRole('button', { name: /^responder$/i }))

    // Se busca de nuevo, no sobre `grupo`: si el grupo se hubiera
    // desmontado, esto fallaría en vez de leer hijos de un nodo huérfano.
    // Nombre exacto, no `new RegExp(shortName(bone.es))`: sin escapar, esa
    // regex hacía substring match, y 5 pares de nombres cortos son
    // substring uno del otro («1.ª vértebra torácica» dentro de «11.ª
    // vértebra torácica», «Escafoides» dentro de «Escafoides del tarso»)
    // — si el distractor sorteado era el par, `getByRole` encontraba dos
    // coincidencias y reventaba. Intermitente, no determinista: dependía
    // de qué distractor tocara. Verificado contra los 120 nombres cortos
    // reales antes de este arreglo.
    const grupoTrasResponder = screen.getByRole('group', { name: /qué hueso es/i })
    const correcta = within(grupoTrasResponder).getByRole('button', {
      name: `✓ ${shortName(bone.es)}`,
    })
    expect(correcta).toHaveTextContent('✓')
  })

  it('marca la opción elegida como error cuando el estudiante falló', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    const opciones = within(grupo).getAllByRole('button')
    const incorrecta = opciones.find((o) => o.textContent !== shortName(bone.es))
    if (!incorrecta) throw new Error('las 3 opciones eran todas el hueso correcto')
    const textoElegido = incorrecta.textContent
    await user.click(incorrecta)
    await user.click(screen.getByRole('button', { name: /^responder$/i }))

    // Igualdad exacta, no `.includes()`: el mismo riesgo que el test
    // anterior — 5 pares de nombres cortos son substring uno del otro, y
    // `.find()` no lanza error ante la ambigüedad, solo elige el primero
    // que encuentra. Con `.includes()`, un distractor «1.ª vértebra
    // torácica» + un tercer botón «11.ª vértebra torácica» podían resolver
    // al botón equivocado en silencio, sin que ningún error lo delatara.
    // `textoElegido` se capturó antes de responder, sin glifo; tras
    // responder, la misma opción lleva «✗ » al frente.
    const grupoTrasResponder = screen.getByRole('group', { name: /qué hueso es/i })
    const elegidaAhora = within(grupoTrasResponder)
      .getAllByRole('button')
      .find((o) => o.textContent === `✗ ${textoElegido}`)
    expect(elegidaAhora).toHaveTextContent('✗')
  })

  it('las opciones dan retroalimentación de prensado', () => {
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    for (const opcion of within(grupo).getAllByRole('button')) {
      expect(opcion).toHaveClass('active:scale-[0.97]', 'duration-rapida')
    }
  })

  it('el panel de resultado entra con transición', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    const [primeraOpcion] = within(grupo).getAllByRole('button')
    if (!primeraOpcion) throw new Error('no había ninguna opción para elegir')
    await user.click(primeraOpcion)
    await user.click(screen.getByRole('button', { name: /^responder$/i }))

    expect(screen.getByRole('status')).toHaveClass('duration-base', 'ease-salida')
  })

  it('nunca hay dos botones de acción a la vez, ni antes ni después de responder', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    expect(
      screen.getAllByRole('button', { name: /^(responder|siguiente pregunta)$/i }),
    ).toHaveLength(1)

    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    const [primeraOpcion] = within(grupo).getAllByRole('button')
    if (!primeraOpcion) throw new Error('no había ninguna opción para elegir')
    await user.click(primeraOpcion)
    await user.click(screen.getByRole('button', { name: /^responder$/i }))

    expect(
      screen.getAllByRole('button', { name: /^(responder|siguiente pregunta)$/i }),
    ).toHaveLength(1)
    expect(screen.getByRole('button', { name: /^siguiente pregunta$/i })).toBeInTheDocument()
  })
})

describe('TestQuestion y el registro de progreso', () => {
  /** Responde la pregunta montada, bien o mal, y devuelve el hueso preguntado. */
  async function responder(store: ProgressStore, acertando: boolean) {
    const user = userEvent.setup()
    render(
      <TestQuestion
        bones={catalog}
        store={store}
        renderScene={renderScenaSustituida}
        answerFormat="open"
        onCambiarModo={cambiarModoNoop}
      />,
    )

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

  it('muestra el nombre corto en las tres opciones, no el del catálogo', () => {
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        onCambiarModo={cambiarModoNoop}
      />,
    )
    // Cualquiera que sea el hueso sorteado: cada opción tiene que ser un
    // nombre corto. Mostrar el `es` del catálogo falla siempre, aunque la
    // derivación no lo acorte, porque el corto va capitalizado y el `es` no.
    const cortos = new Set(catalog.map((b) => shortName(b.es)))
    const opciones = screen.getAllByRole('button', { pressed: false })
    for (const opcion of opciones) {
      expect(cortos, `«${opcion.textContent}» no es un nombre corto`).toContain(opcion.textContent)
    }
  })

  it('revela el nombre completo del catálogo cuando se falla', async () => {
    const user = userEvent.setup()
    render(
      <TestQuestion
        bones={catalog}
        store={almacenFalso()}
        renderScene={renderScenaSustituida}
        answerFormat="open"
        onCambiarModo={cambiarModoNoop}
      />,
    )
    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    await user.type(screen.getByRole('textbox'), 'una respuesta que no es')
    await user.click(screen.getByRole('button', { name: /responder/i }))

    // El revelado no es un botón estrecho: acortarlo aquí sería perder el
    // nombre que el estudiante tenía que aprender.
    expect(screen.getByText(`${bone.es} / ${bone.la}`)).toBeInTheDocument()
  })
})
