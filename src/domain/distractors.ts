import type { Bone } from '../data/bone'

export interface DistractorOptions {
  /** Cuántos distractores devolver. Por defecto 2 (opción múltiple de e8.4). */
  count?: number
  /** Sorteo inyectable, en [0,1) — mismo patrón que `PickOptions` en `quiz.ts`. */
  sorteo?: () => number
}

/**
 * Elige un elemento al azar de una lista y lo quita, mutando una copia
 * local — nunca la lista que recibió, que puede ser el catálogo real.
 */
function extraerAlAzar<T>(candidatos: T[], sorteo: () => number): T {
  const indice = Math.floor(sorteo() * candidatos.length)
  const [elegido] = candidatos.splice(indice, 1)
  if (elegido === undefined) throw new Error('extraerAlAzar: lista de candidatos vacía')
  return elegido
}

/**
 * Elige `count` opciones incorrectas plausibles para un hueso preguntado
 * (`RF-04`, `RF-05`, opción múltiple — ADR-012).
 *
 * Prioriza huesos de la misma región: son los que un estudiante confundiría
 * de verdad (fémur / tibia / peroné, no fémur / vómer). Si la región no
 * alcanza —hoy, `pelvic-girdle` con solo 2 huesos preguntables en total—,
 * completa desde el resto del catálogo preguntable en vez de devolver menos
 * de lo pedido.
 */
export function pickDistractors(
  bone: Bone,
  catalog: readonly Bone[],
  opciones: DistractorOptions = {},
): Bone[] {
  const { count = 2, sorteo = Math.random } = opciones

  const preguntables = catalog.filter((b) => b.meshName !== null && b.id !== bone.id)
  if (preguntables.length < count) {
    throw new Error(
      `pickDistractors: el catálogo no tiene ${count} huesos preguntables además de '${bone.id}'`,
    )
  }

  const misRegion = preguntables.filter((b) => b.region === bone.region)
  const resto = preguntables.filter((b) => b.region !== bone.region)

  const distractores: Bone[] = []
  while (distractores.length < count && misRegion.length > 0) {
    distractores.push(extraerAlAzar(misRegion, sorteo))
  }
  while (distractores.length < count) {
    distractores.push(extraerAlAzar(resto, sorteo))
  }
  return distractores
}
