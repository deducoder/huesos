import { type ReactNode, useState } from 'react'
import type { Bone } from '../../data/bone'
import { isCorrectAnswer } from '../../domain/answer-check'
import { pickTestableBone } from '../../domain/quiz'

interface Props {
  bones: readonly Bone[]
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
export function TestQuestion({ bones, renderScene }: Props) {
  const [bone, setBone] = useState<Bone>(() => pickTestableBone(bones))
  const [respuesta, setRespuesta] = useState('')
  const [resultado, setResultado] = useState<Resultado>('pendiente')

  const responder = (evento: React.FormEvent) => {
    evento.preventDefault()
    setResultado(isCorrectAnswer(respuesta, bone) ? 'correcto' : 'incorrecto')
  }

  const siguiente = () => {
    setBone(pickTestableBone(bones, bone.id))
    setRespuesta('')
    setResultado('pendiente')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">{renderScene(bone.id)}</div>
      <div className="border-slate-800 border-t p-4">
        {resultado === 'pendiente' ? (
          <form onSubmit={responder} className="flex gap-2">
            <label className="flex-1">
              <span className="sr-only">¿Qué hueso es?</span>
              <input
                type="text"
                value={respuesta}
                onChange={(evento) => setRespuesta(evento.target.value)}
                placeholder="¿Qué hueso es?"
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="rounded bg-sky-700 px-4 py-2 text-sm text-white hover:bg-sky-600"
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
                <p className="text-slate-300 text-sm">
                  {bone.es} / {bone.la}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={siguiente}
              className="rounded border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
            >
              Siguiente pregunta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
