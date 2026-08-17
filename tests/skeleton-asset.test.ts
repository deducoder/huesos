import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { readGlb } from '../scripts/glb.mjs'

const ASSET = resolve('src/data/skeleton.glb')

describe('el activo del esqueleto', () => {
  const glb = readGlb(readFileSync(ASSET))

  it('no arrastra ninguna textura no comercial', () => {
    expect(glb.images ?? []).toHaveLength(0)
    expect(glb.textures ?? []).toHaveLength(0)
    expect(glb.samplers ?? []).toHaveLength(0)
  })

  it('no deja ningún material apuntando a una textura', () => {
    const referencias = (glb.materials ?? []).filter((m) => JSON.stringify(m).includes('Texture'))
    expect(referencias).toEqual([])
  })

  it('conserva las 144 mallas del modelo original', () => {
    const nombres = glb.nodes.filter((n) => n.mesh !== undefined).map((n) => n.name)
    expect(nombres).toHaveLength(144)
    expect(new Set(nombres).size).toBe(144)
  })

  it('conserva los huesos que anclan el catálogo', () => {
    const nombres = new Set(glb.nodes.map((n) => n.name))
    for (const hueso of ['Femur.r', 'Atlas (C1)', 'Sphenoid bone', 'Rib (7th).r']) {
      expect(nombres).toContain(hueso)
    }
  })
})
