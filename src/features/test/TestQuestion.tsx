import { type ReactNode, useState } from 'react'
import type { Bone } from '../../data/bone'
import { isCorrectAnswer } from '../../domain/answer-check'
import { recordAnswer } from '../../domain/progress'
import { pickTestableBone } from '../../domain/quiz'
import type { ProgressStore } from '../../storage/progress-store'

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
}

type Resultado = 'pendiente' | 'correcto' | 'incorrecto'

/**
 * El flujo pregunta → respuesta → resultado → siguiente pregunta (`RF-04`,
 * `RF-05`). Qué escena mostrar es responsabilidad de quien lo monta —
 * `SkeletonTestView` (e4.2) e `IsolatedBoneScene`-based views (e4.4)
 * comparten este mismo flujo sin duplicarlo.
 */
export function TestQuestion({ bones, store, renderScene }: Props) {
  const [bone, setBone] = useState<Bone>(() => pickTestableBone(bones, { progress: store.read() }))
  const [respuesta, setRespuesta] = useState('')
  const [resultado, setResultado] = useState<Resultado>('pendiente')

  const responder = (evento: React.FormEvent) => {
    evento.preventDefault()
    const acerto = isCorrectAnswer(respuesta, bone)
    setResultado(acerto ? 'correcto' : 'incorrecto')
    // Se lee el registro actual antes de anotar: acumular es el punto, y
    // partir de vacío borraría todo lo aprendido en respuestas anteriores.
    store.write(recordAnswer(store.read(), bone.id, acerto))
  }

  const siguiente = () => {
    setBone(pickTestableBone(bones, { excluirId: bone.id, progress: store.read() }))
    setRespuesta('')
    setResultado('pendiente')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">{renderScene(bone.id)}</div>
      <div className="border-tinta border-t p-4">
        {resultado === 'pendiente' ? (
          <form onSubmit={responder} className="flex gap-2">
            <label className="flex-1">
              <span className="sr-only">¿Qué hueso es?</span>
              <input
                type="text"
                value={respuesta}
                onChange={(evento) => setRespuesta(evento.target.value)}
                placeholder="¿Qué hueso es?"
                className="w-full rounded border border-tinta bg-panel px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="rounded bg-acento px-4 py-2 text-panel text-sm hover:bg-acento-fuerte"
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
              className="rounded border border-tinta px-3 py-1.5 text-sm hover:bg-acento-suave"
            >
              Siguiente pregunta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
