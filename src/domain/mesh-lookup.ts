import type { Bone } from '../data/bone'

/**
 * Cuál de las dos copias de la escena se pulsó.
 *
 * El modelo trae solo el hemicuerpo derecho, así que el esqueleto completo se
 * dibuja dos veces y **la misma malla existe dos veces en la escena**. El lado
 * de un hueso par no puede deducirse de su nombre de malla: lo decide la mitad.
 */
export type SceneHalf = 'original' | 'mirrored'

/**
 * El hueso que corresponde a una malla pulsada, o `null` si esa malla no está
 * catalogada — dientes, cartílagos costales, sesamoideos y el manubrio son
 * mallas legítimas del modelo que el catálogo no recoge.
 */
export function boneIdForMesh(
  bones: readonly Bone[],
  meshName: string,
  half: SceneHalf,
): string | null {
  const candidatos = bones.filter((bone) => bone.meshName === meshName)
  if (candidatos.length === 0) return null

  // Hueso impar, o una malla que el modelo ya trae por lado: no hay ambigüedad.
  if (candidatos.length === 1) return candidatos[0]?.id ?? null

  const lado = half === 'mirrored' ? 'left' : 'right'
  return candidatos.find((bone) => bone.side === lado)?.id ?? null
}
