import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { catalog } from '../src/data/catalog'
import { readGlb } from '../scripts/glb.mjs'

const glb = readGlb(readFileSync(resolve('src/data/skeleton.glb')))
const mallas = new Set(glb.nodes.filter((n) => n.mesh !== undefined).map((n) => n.name))

describe('el anclaje entre el catálogo y la geometría', () => {
  it('ancla cada entrada a una malla que existe en el modelo', () => {
    const rotas = catalog
      .filter((hueso) => hueso.meshName !== null)
      .filter((hueso) => !mallas.has(hueso.meshName))
      .map((hueso) => `${hueso.id} -> ${hueso.meshName}`)
    expect(rotas, 'entradas que apuntan a una malla inexistente').toEqual([])
  })

  it('ancla al menos una entrada, para no pasar por vacuidad', () => {
    const ancladas = catalog.filter((hueso) => hueso.meshName !== null)
    expect(ancladas.length).toBeGreaterThan(0)
  })

  it('no exige geometría a las ausencias declaradas', () => {
    const ausentes = catalog.filter((hueso) => hueso.meshName === null)
    for (const hueso of ausentes) {
      expect(hueso.missingReason).toBeTruthy()
    }
  })
})
