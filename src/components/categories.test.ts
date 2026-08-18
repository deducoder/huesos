import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { groupByRegion } from '../domain/regions'
import { groupByCategory } from './categories'

describe('groupByCategory', () => {
  it('agrupa cranium y face bajo la categoría "Cráneo"', () => {
    const categorias = groupByCategory(groupByRegion(catalog))
    const craneo = categorias.find((c) => c.category === 'Cráneo')
    expect(craneo).toBeDefined()
    expect(craneo?.regions.map((r) => r.region)).toEqual(['cranium', 'face'])
  })

  it('produce 9 categorías con el catálogo real', () => {
    const categorias = groupByCategory(groupByRegion(catalog))
    expect(categorias).toHaveLength(9)
  })

  it('las 8 categorías sin "—" en su etiqueta tienen exactamente 1 región', () => {
    const categorias = groupByCategory(groupByRegion(catalog))
    const sinCraneo = categorias.filter((c) => c.category !== 'Cráneo')
    expect(sinCraneo).toHaveLength(8)
    for (const c of sinCraneo) {
      expect(c.regions).toHaveLength(1)
    }
  })

  it('conserva el orden anatómico de groupByRegion', () => {
    const regiones = groupByRegion(catalog)
    const categorias = groupByCategory(regiones)
    const ordenPlano = categorias.flatMap((c) => c.regions.map((r) => r.region))
    expect(ordenPlano).toEqual(regiones.map((r) => r.region))
  })

  it('con una lista vacía de regiones, no produce categorías', () => {
    expect(groupByCategory([])).toEqual([])
  })
})
