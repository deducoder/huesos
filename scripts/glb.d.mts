/** Tipos del lector de GLB. La implementación vive en `glb.mjs`, una sola vez. */

export interface GlbNode {
  name?: string
  mesh?: number
  children?: number[]
}

/** La caja de una malla vive en el accessor de POSITION: glTF exige min/max. */
export interface GlbAccessor {
  min?: number[]
  max?: number[]
  count?: number
}

export interface GlbMesh {
  name?: string
  primitives: { attributes: Record<string, number>; material?: number }[]
}

export interface GlbMaterial {
  name?: string
  [key: string]: unknown
}

export interface Glb {
  nodes: GlbNode[]
  meshes?: GlbMesh[]
  materials?: GlbMaterial[]
  images?: unknown[]
  textures?: unknown[]
  samplers?: unknown[]
  accessors?: GlbAccessor[]
  scenes?: { nodes: number[] }[]
  bufferViews: { byteOffset?: number; byteLength: number }[]
  buffers?: { byteLength: number }[]
  __bin?: Buffer
}

export function readGlb(buffer: Buffer): Glb
export function writeGlb(json: Glb, bin: Buffer | null): Buffer
