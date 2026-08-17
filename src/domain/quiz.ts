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

/**
 * Un hueso al azar, entre los que tienen geometría en el modelo (un hueso
 * ausente no puede resaltarse ni aislarse, así que no puede ser pregunta).
 *
 * `excluirId` evita repetir la pregunta inmediatamente anterior — no prioriza
 * huesos fallados: eso es `RF-09`/E5, fuera de esta historia.
 */
export function pickTestableBone(bones: readonly Bone[], excluirId?: string): Bone {
  const preguntables = bones.filter((bone) => bone.meshName !== null && bone.id !== excluirId)
  const candidatos =
    preguntables.length > 0 ? preguntables : bones.filter((bone) => bone.meshName !== null)
  const indice = Math.floor(Math.random() * candidatos.length)
  const elegido = candidatos[indice]
  if (!elegido) throw new Error('el catálogo no tiene ningún hueso preguntable')
  return elegido
}
