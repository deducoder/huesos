import type { BoneRegion } from '../data/bone'

/**
 * Cómo se nombran las regiones para quien estudia.
 * Vive en la capa de vista: el dominio guarda claves estables, la vista las
 * traduce. Compartido por el navegador y el panel de identidad para que no se
 * llame igual a lo mismo de dos maneras.
 *
 * El lado ya no vive aquí: concuerda con el género del hueso (ADR-015) y por
 * eso es una función, `sideLabel` en `bone-name.ts`, no una tabla.
 */
export const REGION_LABEL: Record<BoneRegion, string> = {
  cranium: 'Cráneo — neurocráneo',
  face: 'Cráneo — cara',
  ear: 'Oído medio',
  hyoid: 'Hioides',
  spine: 'Columna vertebral',
  thorax: 'Tórax',
  'shoulder-girdle': 'Cintura escapular',
  'upper-limb': 'Miembro superior',
  'pelvic-girdle': 'Cintura pélvica',
  'lower-limb': 'Miembro inferior',
}
