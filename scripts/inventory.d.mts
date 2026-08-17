/** Tipos del clasificador de mallas. La implementación vive en `inventory.mjs`. */

export type MeshKind = 'bone' | 'tooth' | 'cartilage' | 'sesamoid'

export interface MeshClassification {
  kind: MeshKind
  side: 'left' | 'right' | null
  base: string
}

export function classifyMesh(name: string): MeshClassification
