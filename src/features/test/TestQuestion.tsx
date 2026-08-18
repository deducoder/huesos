import { type ReactNode, useState } from 'react'
import { shortName } from '../../components/bone-name'
import type { Bone } from '../../data/bone'
import { isCorrectAnswer } from '../../domain/answer-check'
import { pickDistractors } from '../../domain/distractors'
import { recordAnswer } from '../../domain/progress'
import { pickTestableBone } from '../../domain/quiz'
import type { ProgressStore } from '../../storage/progress-store'

/** Baraja una copia — nunca la lista que recibió. */
function mezclar<T>(lista: readonly T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copia[i]
    const otro = copia[j]
    if (temp === undefined || otro === undefined) continue
    copia[i] = otro
    copia[j] = temp
  }
  return copia
}

interface Props {
  bones: readonly Bone[]
  /**
   * Dónde se anota el veredicto de cada respuesta (`RF-09`).
   *
   * Llega por prop igual que `bones`, en vez de que este componente busque el
   * almacén compartido por su cuenta: es lo que permite probar el registro con
   * un doble, sin tocar el `localStorage` de jsdom.
   */
  store: ProgressStore
  /**
   * Recibe solo el `id` del hueso, nunca el `Bone` completo: `must-data-003`
   * exige que ningún nombre llegue al DOM antes de responder, y una firma
   * que solo acepta un `id` hace que revelarlo por accidente sea un error de
   * tipos, no un descuido de disciplina.
   */
  renderScene: (boneId: string) => ReactNode
  /**
   * `'choice'` (default, ADR-012): 3 botones, el de la interfaz real. `'open'`
   * es el formato escrito original — ya no alcanzable desde ningún botón,
   * solo pasándolo explícito, que es como lo siguen usando sus propios tests
   * (`must-data-003`).
   */
  answerFormat?: 'open' | 'choice'
  /** Si se pasa, ofrece volver a elegir la variante de test sin salir de la pestaña. */
  onCambiarModo?: () => void
}

type Resultado = 'pendiente' | 'correcto' | 'incorrecto'

type EstadoOpcion = 'neutra' | 'seleccionada' | 'acierto' | 'error'

/** Las clases de cada estado de una opción. Los tokens de acierto/error son de e9.1. */
const CLASE_POR_ESTADO: Record<EstadoOpcion, string> = {
  neutra: 'bg-superficie text-tinta hover:bg-acento-suave',
  seleccionada: 'bg-acento text-panel',
  acierto: 'bg-acierto text-panel',
  error: 'bg-error text-panel',
}

/**
 * El flujo pregunta → respuesta → resultado → siguiente pregunta (`RF-04`,
 * `RF-05`). Qué escena mostrar es responsabilidad de quien lo monta —
 * `SkeletonTestView` (e4.2) e `IsolatedBoneScene`-based views (e4.4)
 * comparten este mismo flujo sin duplicarlo.
 */
export function TestQuestion({
  bones,
  store,
  renderScene,
  answerFormat = 'choice',
  onCambiarModo,
}: Props) {
  const [bone, setBone] = useState<Bone>(() => pickTestableBone(bones, { progress: store.read() }))
  const [respuesta, setRespuesta] = useState('')
  const [opciones, setOpciones] = useState<Bone[]>(() =>
    mezclar([bone, ...pickDistractors(bone, bones)]),
  )
  const [seleccionId, setSeleccionId] = useState<string | null>(null)
  const [resultado, setResultado] = useState<Resultado>('pendiente')

  const anotar = (acerto: boolean) => {
    setResultado(acerto ? 'correcto' : 'incorrecto')
    // Se lee el registro actual antes de anotar: acumular es el punto, y
    // partir de vacío borraría todo lo aprendido en respuestas anteriores.
    store.write(recordAnswer(store.read(), bone.id, acerto))
  }

  const responder = (evento: React.FormEvent) => {
    evento.preventDefault()
    anotar(isCorrectAnswer(respuesta, bone))
  }

  const responderOpcion = () => {
    if (seleccionId === null) return
    anotar(seleccionId === bone.id)
  }

  /**
   * Cómo se ve una opción: neutra o marcada mientras se elige, calificada
   * una vez que hay resultado. La correcta siempre pasa a acierto, la haya
   * tocado o no; la elegida pasa a error solo si no era la correcta.
   */
  const estadoOpcion = (opcion: Bone): EstadoOpcion => {
    if (resultado === 'pendiente') return seleccionId === opcion.id ? 'seleccionada' : 'neutra'
    if (opcion.id === bone.id) return 'acierto'
    if (opcion.id === seleccionId) return 'error'
    return 'neutra'
  }

  const siguiente = () => {
    const siguienteBone = pickTestableBone(bones, { excluirId: bone.id, progress: store.read() })
    setBone(siguienteBone)
    setOpciones(mezclar([siguienteBone, ...pickDistractors(siguienteBone, bones)]))
    setSeleccionId(null)
    setRespuesta('')
    setResultado('pendiente')
  }

  return (
    <div className="relative h-full md:mx-auto md:max-w-3xl">
      <div className="absolute inset-0 bg-lienzo">{renderScene(bone.id)}</div>
      {onCambiarModo && (
        <button
          type="button"
          onClick={onCambiarModo}
          className="absolute top-4 left-4 min-h-tactil rounded-full border-2 border-tinta bg-panel px-4 font-semibold text-sm shadow-dura hover:bg-acento-suave"
        >
          ← cambiar modo
        </button>
      )}
      <div
        className="absolute inset-x-4 bottom-4 rounded-tarjeta border-2 border-tinta bg-panel p-4 shadow-dura"
        data-testid="barra-respuesta"
      >
        {answerFormat === 'open' ? (
          resultado === 'pendiente' ? (
            <form onSubmit={responder} className="flex gap-2">
              <label className="flex-1">
                <span className="sr-only">¿Qué hueso es?</span>
                <input
                  type="text"
                  value={respuesta}
                  onChange={(evento) => setRespuesta(evento.target.value)}
                  placeholder="¿Qué hueso es?"
                  className="min-h-tactil w-full rounded-suave border-2 border-tinta bg-panel px-3 text-sm"
                />
              </label>
              <button
                type="submit"
                className="min-h-tactil rounded-suave border-2 border-tinta bg-acento px-4 text-panel text-sm hover:bg-acento-fuerte"
              >
                Responder
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-4">
              <div role="status">
                <p className="font-semibold text-sm">
                  {resultado === 'correcto' ? 'Correcto' : 'Incorrecto'}
                </p>
                {resultado === 'incorrecto' && (
                  <p className="text-tinta-suave text-sm">
                    {bone.es} / {bone.la}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={siguiente}
                className="min-h-tactil rounded-suave border-2 border-tinta px-4 text-sm hover:bg-acento-suave"
              >
                Siguiente pregunta
              </button>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-3">
            <fieldset className="m-0 grid grid-cols-3 gap-2 border-0 p-0">
              <legend className="sr-only">¿Qué hueso es?</legend>
              {opciones.map((opcion) => {
                const estado = estadoOpcion(opcion)
                return (
                  <button
                    key={opcion.id}
                    type="button"
                    aria-pressed={seleccionId === opcion.id}
                    disabled={resultado !== 'pendiente'}
                    onClick={() => setSeleccionId(opcion.id)}
                    className={`min-h-tactil rounded-full border-2 border-tinta px-2 font-semibold text-sm [hyphens:auto] ${CLASE_POR_ESTADO[estado]}`}
                  >
                    {estado === 'acierto' && '✓ '}
                    {estado === 'error' && '✗ '}
                    {shortName(opcion.es)}
                  </button>
                )
              })}
            </fieldset>
            {resultado !== 'pendiente' && (
              <div role="status">
                <p className="font-semibold text-sm">
                  {resultado === 'correcto' ? 'Correcto' : 'Incorrecto'}
                </p>
                {resultado === 'incorrecto' && (
                  <p className="text-tinta-suave text-sm">
                    {bone.es} / {bone.la}
                  </p>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={resultado === 'pendiente' ? responderOpcion : siguiente}
              disabled={resultado === 'pendiente' && seleccionId === null}
              className="min-h-tactil rounded-full border-2 border-tinta bg-acento px-4 font-semibold text-panel text-sm shadow-dura hover:bg-acento-fuerte disabled:cursor-default disabled:border-tinta-suave disabled:bg-panel disabled:text-tinta-suave disabled:shadow-none"
            >
              {resultado === 'pendiente' ? 'Responder' : 'Siguiente pregunta'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
