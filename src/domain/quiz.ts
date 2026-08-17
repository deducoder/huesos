import type { Bone } from '../data/bone'
import { boneProgress, type ProgressRecord } from './progress'

/**
 * Cuánto sube el peso cada fallo, y cuánto lo baja cada acierto (ADR-005).
 *
 * Son un **juicio declarado, no una medición**: se eligieron simples y
 * explicables, y ADR-005 lo dice en voz alta para no repetir el error de s1,
 * donde un umbral inventado viajó tres iteraciones disfrazado de dato. Las
 * pruebas fijan el *orden* que producen, no las cifras, así que corregirlos con
 * uso real no rompe nada.
 */
const POR_FALLO = 3
const POR_ACIERTO = 1

/**
 * El peso mínimo de cualquier hueso preguntable.
 *
 * No es defensivo: **es la invariante de ADR-005**. La ponderación cambia
 * frecuencias, nunca reduce el conjunto de candidatos — que es lo que separa la
 * opción elegida de la cola estricta que se rechazó. Sin este suelo, un hueso
 * acertado muchas veces tendría peso negativo y desaparecería del sorteo.
 */
const PESO_MINIMO = 1

/**
 * Cuánto insiste el sorteo con un hueso, según lo que el estudiante lleva
 * acertado y fallado en él.
 */
export function weightFor(progress: ProgressRecord, boneId: string): number {
  const { correct, incorrect } = boneProgress(progress, boneId)
  return Math.max(PESO_MINIMO, PESO_MINIMO + POR_FALLO * incorrect - POR_ACIERTO * correct)
}

/** Cómo se elige la siguiente pregunta. Todo opcional: sin nada, sorteo uniforme. */
export interface PickOptions {
  /** El hueso de la pregunta anterior, que no se repite. */
  excluirId?: string
  /** El registro que pondera la elección (`RF-09`). Sin él, todos pesan igual. */
  progress?: ProgressRecord
  /**
   * El sorteo, en [0,1). Se **inyecta** en vez de llamar a `Math.random` por
   * dentro: sin esto la regla de ponderación solo se puede intuir, y un test
   * que la comprobara sería intermitente por construcción.
   */
  sorteo?: () => number
}

/**
 * El siguiente hueso a preguntar, entre los que tienen geometría en el modelo
 * (un hueso ausente no puede resaltarse ni aislarse, así que no puede ser
 * pregunta).
 *
 * La elección está **ponderada por los fallos** del estudiante (`RF-09`,
 * ADR-005): lo fallado sale más seguido, pero el catálogo entero sigue
 * alcanzable. Ese equilibrio es lo que separa la opción elegida de la cola
 * estricta que se rechazó — encerrar el estudio en lo ya fallado frenaría el
 * avance por material nuevo, que es la mitad del propósito de la aplicación.
 */
export function pickTestableBone(bones: readonly Bone[], opciones: PickOptions = {}): Bone {
  const { excluirId, progress = {}, sorteo = Math.random } = opciones

  const preguntables = bones.filter((bone) => bone.meshName !== null && bone.id !== excluirId)
  const candidatos =
    preguntables.length > 0 ? preguntables : bones.filter((bone) => bone.meshName !== null)
  if (candidatos.length === 0) throw new Error('el catálogo no tiene ningún hueso preguntable')

  const pesos = candidatos.map((bone) => weightFor(progress, bone.id))
  const total = pesos.reduce((suma, peso) => suma + peso, 0)

  // Suma acumulada: se avanza por los candidatos restando su peso hasta agotar
  // el sorteo. Cada hueso ocupa un tramo proporcional a su peso.
  let restante = sorteo() * total
  for (let i = 0; i < candidatos.length; i++) {
    restante -= pesos[i] ?? 0
    if (restante < 0) {
      const elegido = candidatos[i]
      if (elegido) return elegido
    }
  }

  // Solo alcanzable si el sorteo devolvió exactamente 1 o por error de coma
  // flotante en la última resta: el último candidato es la respuesta correcta.
  const ultimo = candidatos[candidatos.length - 1]
  if (!ultimo) throw new Error('el catálogo no tiene ningún hueso preguntable')
  return ultimo
}
