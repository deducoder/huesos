import type { Bone } from '../data/bone'

/**
 * Un hueso al azar, entre los que tienen geometría en el modelo (un hueso
 * ausente no puede resaltarse ni aislarse, así que no puede ser pregunta).
 *
 * `excluirId` evita repetir la pregunta inmediatamente anterior — no prioriza
 * huesos fallados: eso es `RF-09`/E5, fuera de esta historia.
 */
export function pickTestableBone(bones: readonly Bone[], excluirId?: string): Bone {
  const preguntables = bones.filter((bone) => bone.meshName !== null && bone.id !== excluirId)
  const candidatos =
    preguntables.length > 0 ? preguntables : bones.filter((bone) => bone.meshName !== null)
  const indice = Math.floor(Math.random() * candidatos.length)
  const elegido = candidatos[indice]
  if (!elegido) throw new Error('el catálogo no tiene ningún hueso preguntable')
  return elegido
}
