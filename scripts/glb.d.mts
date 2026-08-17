/** Tipos del lector de GLB. La implementación vive en `glb.mjs`, una sola vez. */

export interface GlbNode {
  name?: string
  mesh?: number
  children?: number[]
}

export interface GlbMaterial {
  name?: string
  [key: string]: unknown
}

export interface Glb {
  nodes: GlbNode[]
  meshes?: { primitives?: unknown[] }[]
  materials?: GlbMaterial[]
  images?: unknown[]
  textures?: unknown[]
  samplers?: unknown[]
  accessors?: unknown[]
  bufferViews: { byteOffset?: number; byteLength: number }[]
  buffers?: { byteLength: number }[]
  __bin?: Buffer
}

export function readGlb(buffer: Buffer): Glb
export function writeGlb(json: Glb, bin: Buffer | null): Buffer
