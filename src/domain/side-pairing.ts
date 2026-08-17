import type { Bone } from '../data/bone'

/** El id del lado opuesto, o `null` si el hueso es impar. */
export function siblingId(bone: Pick<Bone, 'id' | 'side'>): string | null {
  if (bone.side === 'right') return bone.id.replace(/-right$/, '-left')
  if (bone.side === 'left') return bone.id.replace(/-left$/, '-right')
  return null
}

/**
 * El lado no distingue nada observable: este hueso no tiene malla, y tampoco
 * la tiene su opuesto. Es la misma condición que colapsa una fila del
 * navegador (e7.4, `toNavigatorRows`), consultada acá para un solo hueso en
 * vez de una lista.
 *
 * Ante cualquier duda —el opuesto no existe en el catálogo dado— devuelve
 * `false`: nunca oculta el lado por un dato que no puede confirmar.
 */
export function isSideIrrelevant(bone: Bone, catalog: readonly Bone[]): boolean {
  if (bone.meshName !== null) return false
  const id = siblingId(bone)
  if (id === null) return false
  const opuesto = catalog.find((b) => b.id === id)
  return opuesto !== undefined && opuesto.meshName === null
}
