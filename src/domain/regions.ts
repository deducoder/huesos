import type { Bone, BoneRegion } from '../data/bone'

/**
 * El orden en que se recorre el cuerpo: de la cabeza a los pies, y dentro del
 * tronco de arriba abajo. **Es una convención de estudio, no un hecho
 * anatómico** — está aquí, explícita, para que cambiarla sea una decisión
 * visible y no un efecto de cómo ordene un `Object.keys`.
 */
const ANATOMICAL_ORDER: readonly BoneRegion[] = [
  'cranium',
  'face',
  'ear',
  'hyoid',
  'spine',
  'thorax',
  'shoulder-girdle',
  'upper-limb',
  'pelvic-girdle',
  'lower-limb',
]

export interface RegionGroup {
  region: BoneRegion
  bones: Bone[]
  /** `false` cuando ningún hueso del grupo tiene geometría en el modelo. */
  representable: boolean
}

/**
 * Agrupa el catálogo por región, en orden anatómico.
 *
 * Dentro de cada grupo se conserva el orden del catálogo, que ya pone contiguos
 * el lado derecho y el izquierdo de un mismo hueso. Reordenar aquí —por nombre,
 * por ejemplo— los separaría, y para estudiar conviene verlos juntos.
 */
export function groupByRegion(bones: readonly Bone[]): RegionGroup[] {
  return ANATOMICAL_ORDER.map((region) => {
    const delGrupo = bones.filter((bone) => bone.region === region)
    return {
      region,
      bones: delGrupo,
      representable: delGrupo.some((bone) => bone.meshName !== null),
    }
  }).filter((grupo) => grupo.bones.length > 0)
}
