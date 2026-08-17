/**
 * El registro de aciertos y fallos por hueso (`RF-09`).
 *
 * Datos puros: este módulo no conoce React, ni el DOM, ni el almacenamiento —
 * la misma regla que declara `bone.ts`. Persistirlo es responsabilidad de
 * `src/storage/` (e5.2, ADR-004), y la dirección de la dependencia va de allí
 * hacia aquí, nunca al revés.
 */

/** Cuántas veces se acertó y se falló un hueso concreto. */
export interface BoneProgress {
  correct: number
  incorrect: number
}

/**
 * El progreso de todo el catálogo, indexado por `Bone.id`.
 *
 * Plano y serializable a propósito: tiene que sobrevivir a
 * `JSON.stringify`/`parse` sin pérdida, porque eso es exactamente lo que hará
 * el almacenamiento. Nada de clases, fechas ni funciones aquí dentro.
 */
export type ProgressRecord = Readonly<Record<string, BoneProgress>>

/** Un estudiante que todavía no respondió nada. */
export const EMPTY_PROGRESS: ProgressRecord = {}

/** El estado inicial: nunca preguntado. */
const NUNCA_PREGUNTADO: BoneProgress = { correct: 0, incorrect: 0 }

/**
 * El progreso de un hueso. Un `id` ausente significa **nunca preguntado**, no
 * "no existe": quien lee no tiene que distinguir los dos casos, ni protegerse
 * de un `undefined`.
 */
export function boneProgress(record: ProgressRecord, boneId: string): BoneProgress {
  return record[boneId] ?? NUNCA_PREGUNTADO
}
