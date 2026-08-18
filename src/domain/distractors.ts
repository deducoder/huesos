import type { Bone } from '../data/bone'
import { siblingId } from './side-pairing'

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

/** Quita, si está, el hueso con ese id — no falla si no aparece en la lista. */
function quitarPorId(candidatos: Bone[], id: string): void {
  const indice = candidatos.findIndex((b) => b.id === id)
  if (indice !== -1) candidatos.splice(indice, 1)
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
 *
 * Nunca elige al hermano anatómico del hueso preguntado, ni deja que dos
 * distractores sean hermanos entre sí (`siblingId`, e7.4): comparten el
 * mismo `es` —el lado no está en el nombre, se agrega aparte en la
 * vista— así que dos hermanos elegidos a la vez mostrarían dos botones con
 * el mismo texto (hallazgo de la verificación manual de e8.3).
 */
export function pickDistractors(
  bone: Bone,
  catalog: readonly Bone[],
  opciones: DistractorOptions = {},
): Bone[] {
  const { count = 2, sorteo = Math.random } = opciones

  const hermano = siblingId(bone)
  const preguntables = catalog.filter(
    (b) => b.meshName !== null && b.id !== bone.id && b.id !== hermano,
  )
  if (preguntables.length < count) {
    throw new Error(
      `pickDistractors: el catálogo no tiene ${count} huesos preguntables además de '${bone.id}'`,
    )
  }

  const misRegion = preguntables.filter((b) => b.region === bone.region)
  const resto = preguntables.filter((b) => b.region !== bone.region)

  const distractores: Bone[] = []
  while (distractores.length < count && misRegion.length > 0) {
    const elegido = extraerAlAzar(misRegion, sorteo)
    distractores.push(elegido)
    const hermanoElegido = siblingId(elegido)
    if (hermanoElegido !== null) quitarPorId(misRegion, hermanoElegido)
  }
  while (distractores.length < count) {
    const elegido = extraerAlAzar(resto, sorteo)
    distractores.push(elegido)
    const hermanoElegido = siblingId(elegido)
    if (hermanoElegido !== null) quitarPorId(resto, hermanoElegido)
  }
  return distractores
}
