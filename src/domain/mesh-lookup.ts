import { PropertyBinding } from 'three'
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
 * El nombre de una malla tal como lo verá la escena.
 *
 * `GLTFLoader` no conserva el nombre del nodo: lo pasa por
 * `PropertyBinding.sanitizeNodeName`, que cambia los espacios por `_` y elimina
 * los caracteres reservados. De los 144 nombres del modelo, solo tres
 * —`Sacrum`, `Coccyx`, `Vomer`— sobreviven intactos, y por eso solo esos tres
 * huesos eran seleccionables antes de b2.1.
 *
 * Se usa la función de `three` en vez de reimplementar la regla: si la librería
 * cambia su criterio, este código la sigue en vez de divergir en silencio.
 */
export function sceneMeshName(meshName: string): string {
  return PropertyBinding.sanitizeNodeName(meshName)
}

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
  // Se comparan los dos lados normalizados: el nombre llega ya saneado desde la
  // escena, y el del catálogo viene del archivo, sin sanear.
  const buscado = sceneMeshName(meshName)
  const candidatos = bones.filter(
    (bone) => bone.meshName !== null && sceneMeshName(bone.meshName) === buscado,
  )
  if (candidatos.length === 0) return null

  // Hueso impar, o una malla que el modelo ya trae por lado: no hay ambigüedad.
  if (candidatos.length === 1) return candidatos[0]?.id ?? null

  const lado = half === 'mirrored' ? 'left' : 'right'
  return candidatos.find((bone) => bone.side === lado)?.id ?? null
}
