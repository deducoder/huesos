import type { Bone } from '../data/bone'

/**
 * El hueso seleccionado, identificado por su `id` del catálogo.
 *
 * **Nunca por nombre de malla:** una malla corresponde a dos huesos cuando el
 * hueso es par —`femur-left` y `femur-right` comparten `Femur.r`—, así que la
 * malla no identifica una selección.
 */
export type SelectionId = string | null

/** Activar el hueso ya seleccionado lo deselecciona; activar otro lo sustituye. */
export function toggleSelection(current: SelectionId, activated: string): SelectionId {
  return current === activated ? null : activated
}

/** El hueso seleccionado, o `undefined` si no hay selección o el id no existe. */
export function findBone(bones: readonly Bone[], id: SelectionId): Bone | undefined {
  if (id === null) return undefined
  return bones.find((bone) => bone.id === id)
}
