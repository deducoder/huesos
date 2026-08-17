import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { groupByRegion } from './regions'

const grupos = groupByRegion(catalog)

describe('la agrupación del catálogo por región', () => {
  it('recorre el cuerpo de la cabeza a los pies, no por orden alfabético', () => {
    expect(grupos.map((g) => g.region)).toEqual([
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
    ])
  })

  it('no devuelve ningún grupo vacío', () => {
    for (const grupo of grupos) {
      expect(grupo.bones.length, `${grupo.region} vacío`).toBeGreaterThan(0)
    }
  })

  it('no pierde ni duplica ningún hueso', () => {
    const total = grupos.reduce((n, g) => n + g.bones.length, 0)
    expect(total).toBe(catalog.length)
    const ids = grupos.flatMap((g) => g.bones.map((b) => b.id))
    expect(new Set(ids).size).toBe(catalog.length)
  })

  it('deja juntos el derecho y el izquierdo de un mismo hueso', () => {
    const miembro = grupos.find((g) => g.region === 'upper-limb')
    expect(miembro).toBeDefined()
    const nombres = miembro?.bones.map((b) => b.es) ?? []
    for (const [i, nombre] of nombres.entries()) {
      const siguiente = nombres.indexOf(nombre, i + 1)
      if (siguiente !== -1) {
        expect(siguiente, `${nombre} tiene sus dos lados separados`).toBe(i + 1)
      }
    }
  })

  it('marca las regiones cuyos huesos no tienen geometría', () => {
    const porRegion = (r: string) => grupos.find((g) => g.region === r)
    expect(porRegion('ear')?.representable).toBe(false)
    expect(porRegion('hyoid')?.representable).toBe(false)
    expect(porRegion('spine')?.representable).toBe(true)
  })
})
