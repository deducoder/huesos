import type { Bone } from '../data/bone'
import { boneIdForMesh, type SceneHalf } from './mesh-lookup'

/**
 * Si una malla debe verse cuando la escena aísla un solo hueso.
 *
 * Reutiliza `boneIdForMesh` en vez de reimplementar la resolución: una malla
 * sin hueso catalogado (diente, cartílago, sesamoideo) ya devuelve `null`, que
 * nunca coincide con el `id` buscado — se oculta por el mismo camino que
 * cualquier otro hueso, sin caso especial.
 */
export function visibleForIsolation(
  bones: readonly Bone[],
  meshName: string,
  half: SceneHalf,
  targetId: string,
): boolean {
  return boneIdForMesh(bones, meshName, half) === targetId
}
