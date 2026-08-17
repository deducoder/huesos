import type { Bone } from '../data/bone'

/**
 * Una fila del navegador: un par de huesos que comparten fila, o un hueso
 * impar en la suya propia.
 */
export type NavigatorRow =
  | {
      kind: 'paired'
      name: string
      /** Nunca `side: null` — es la condición que arma el par. */
      right: Bone & { side: 'right' }
      left: Bone & { side: 'left' }
    }
  | { kind: 'single'; bone: Bone }

function esLadoDerecho(bone: Bone): bone is Bone & { side: 'right' } {
  return bone.side === 'right'
}

function esLadoIzquierdo(bone: Bone): bone is Bone & { side: 'left' } {
  return bone.side === 'left'
}

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
    // El chequeo va inline, no en una variable booleana intermedia: es lo que
    // deja que TypeScript estreche `hueso`/`siguiente` a `side: 'right'` /
    // `side: 'left'` dentro del bloque — una variable separada pierde el
    // estrechamiento y obligaría a un `as` para construir la fila tipada.
    if (
      esLadoDerecho(hueso) &&
      siguiente !== undefined &&
      esLadoIzquierdo(siguiente) &&
      siguiente.id === hueso.id.replace(/-right$/, '-left')
    ) {
      filas.push({ kind: 'paired', name: hueso.es, right: hueso, left: siguiente })
      i++
      continue
    }
    filas.push({ kind: 'single', bone: hueso })
  }
  return filas
}
