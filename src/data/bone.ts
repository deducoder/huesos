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

interface BoneCore {
  /** Slug estable en inglés. Sobrevive a un cambio de nomenclatura del modelo. */
  id: string
  side: Side
  /** Nombre en español. */
  es: string
  /** Término en Terminologia Anatomica. */
  la: string
  /** Otras formas que un estudiante podría escribir. Puede estar vacía, nunca ausente. */
  synonyms: string[]
  /**
   * Género gramatical de `es`. Lo necesita el lado, que concuerda con el
   * hueso: «clavícula derecha», «fémur derecho» (ADR-015). No se puede
   * derivar de la terminación —«falange» acaba en -e y es femenino,
   * «cornete» acaba en -e y es masculino— ni del término latino, que sigue
   * su propia declinación.
   */
  gender: 'm' | 'f'
  region: BoneRegion
  /** Identificador en la Foundational Model of Anatomy, cuando se conoce. */
  fma?: string
  /**
   * Con qué otros huesos se articula, en prosa (e8.5, mockup de la ficha
   * completa). Opcional y ausente en la mayoría del catálogo: es contenido
   * anatómico redactado, no un dato derivable del modelo ni de la región, así
   * que solo lo llevan las entradas donde alguien lo escribió y verificó. La
   * ficha omite la fila cuando falta, en vez de mostrarla vacía.
   */
  articulatesWith?: string
  /**
   * Un dato clínico memorable, el gancho que hace que el hueso se recuerde
   * (e8.5). Mismo criterio que `articulatesWith`: presente solo donde se
   * escribió, nunca inventado para rellenar la ficha.
   */
  clinicalNote?: string
}

/** Un hueso con geometría en `skeleton.glb`. */
interface MappedBone extends BoneCore {
  /** Nombre de la malla que ancla la entrada a su geometría. */
  meshName: string
  missingReason?: never
}

/** Un hueso que el modelo no incluye, y que por eso debe explicarse. */
interface UnmappedBone extends BoneCore {
  meshName: null
  /** Por qué esta entrada no tiene geometría. */
  missingReason: string
}

/**
 * Una entrada del catálogo. La unión hace **imposible** el estado incoherente:
 * no se puede escribir una razón de ausencia en un hueso que sí tiene malla, ni
 * omitirla en uno que no la tiene. Sin la unión, esa invariante viviría solo en
 * el test.
 */
export type Bone = MappedBone | UnmappedBone

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
  'sternum',
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
