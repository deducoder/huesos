/**
 * La forma de un hueso en el catálogo. Datos puros: este módulo no conoce
 * React, ni el DOM, ni el almacenamiento.
 */

/** Lado del cuerpo. Un hueso impar no tiene lado. */
export type Side = 'left' | 'right' | null

/** Las regiones en que se agrupa el esqueleto para estudiarlo. */
export const BONE_REGIONS = [
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
] as const

export type BoneRegion = (typeof BONE_REGIONS)[number]

export interface Bone {
  /** Slug estable en inglés. Sobrevive a un cambio de nomenclatura del modelo. */
  id: string
  /**
   * Nombre de la malla en `skeleton.glb`, que ancla la entrada a su geometría.
   * `null` solo para una ausencia declarada, que entonces exige `missingReason`.
   */
  meshName: string | null
  side: Side
  /** Nombre en español. */
  es: string
  /** Término en Terminologia Anatomica. */
  la: string
  /** Otras formas que un estudiante podría escribir. Puede estar vacía, nunca ausente. */
  synonyms: string[]
  region: BoneRegion
  /** Identificador en la Foundational Model of Anatomy, cuando se conoce. */
  fma?: string
  /** Por qué esta entrada no tiene geometría. Solo legal si `meshName` es `null`. */
  missingReason?: string
}

/** Las regiones cuyos huesos son siempre impares. */
const UNPAIRED_REGIONS: ReadonlySet<BoneRegion> = new Set<BoneRegion>(['hyoid'])

/** Los huesos impares que viven en regiones mayoritariamente pares. */
const UNPAIRED_IDS: ReadonlySet<string> = new Set([
  'frontal',
  'occipital',
  'sphenoid',
  'ethmoid',
  'vomer',
  'mandible',
  'sacrum',
  'coccyx',
  'sternum-manubrium',
  'sternum-body',
  'sternum-xiphoid',
])

/**
 * Un hueso es impar cuando el cuerpo tiene uno solo. La columna es impar por
 * completo: cada vértebra es una pieza única en la línea media.
 */
export function isUnpaired(bone: Pick<Bone, 'id' | 'region'>): boolean {
  if (UNPAIRED_REGIONS.has(bone.region)) return true
  if (bone.region === 'spine') return true
  return UNPAIRED_IDS.has(bone.id)
}
