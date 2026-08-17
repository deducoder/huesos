import type { Bone } from '../data/bone'

/**
 * Una fila del navegador: un par de huesos que comparten fila, o un hueso
 * impar en la suya propia.
 */
export type NavigatorRow =
  | { kind: 'paired'; name: string; right: Bone; left: Bone }
  | { kind: 'single'; bone: Bone }

/**
 * Agrupa huesos pares adyacentes en una sola fila.
 *
 * Recorre en el orden que ya trae la lista —el catálogo pone contiguos el
 * lado derecho y el izquierdo de un mismo hueso, verificado en los 86 pares
 * de las 10 regiones— y nunca asume la adyacencia sin comprobarla: si un
 * derecho no tiene su izquierdo justo después, los dos se renderizan como
 * filas simples en vez de perderse.
 */
export function toNavigatorRows(bones: readonly Bone[]): NavigatorRow[] {
  const filas: NavigatorRow[] = []
  for (let i = 0; i < bones.length; i++) {
    const hueso = bones[i]
    if (hueso === undefined) continue
    const siguiente = bones[i + 1]
    const esParConsecutivo =
      hueso.side === 'right' &&
      siguiente !== undefined &&
      siguiente.side === 'left' &&
      siguiente.id === hueso.id.replace(/-right$/, '-left')
    if (esParConsecutivo && siguiente !== undefined) {
      filas.push({ kind: 'paired', name: hueso.es, right: hueso, left: siguiente })
      i++
      continue
    }
    filas.push({ kind: 'single', bone: hueso })
  }
  return filas
}
