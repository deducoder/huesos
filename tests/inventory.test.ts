import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { readGlb } from '../scripts/glb.mjs'
import { classifyMesh } from '../scripts/inventory.mjs'

describe('la clasificación de una malla del modelo', () => {
  it('reconoce un hueso lateralizado y le separa el lado', () => {
    expect(classifyMesh('Femur.r')).toEqual({ kind: 'bone', side: 'right', base: 'Femur' })
  })

  it('reconoce un hueso impar sin lado', () => {
    expect(classifyMesh('Atlas (C1)')).toEqual({ kind: 'bone', side: null, base: 'Atlas (C1)' })
  })

  it('reconoce el lado escrito con palabra en vez de sufijo', () => {
    expect(classifyMesh('Parietal bone left')).toEqual({
      kind: 'bone',
      side: 'left',
      base: 'Parietal bone',
    })
  })

  it('aparta los dientes del recuento óseo', () => {
    for (const diente of [
      'Lower first molar tooth.r',
      'Upper canine.r',
      'Lower second premolar.r',
      'Upper lateral incisor.r',
    ]) {
      expect(classifyMesh(diente).kind, diente).toBe('tooth')
    }
  })

  it('aparta los cartílagos costales', () => {
    expect(classifyMesh('Costal cart of 3rd rib.r')).toEqual({
      kind: 'cartilage',
      side: 'right',
      base: 'Costal cart of 3rd rib',
    })
  })

  it('aparta los sesamoideos, que no cuentan entre los 206', () => {
    expect(classifyMesh('Sesamoid_bones_of_hand.r').kind).toBe('sesamoid')
    expect(classifyMesh('Sesamoid bones of foot.r').kind).toBe('sesamoid')
  })

  it('tolera el punto sobrante que el modelo dejó en la escápula', () => {
    expect(classifyMesh('Scapula.r.')).toEqual({ kind: 'bone', side: 'right', base: 'Scapula' })
  })
})

describe('el inventario del modelo real', () => {
  const glb = readGlb(readFileSync(resolve('src/data/skeleton.glb')))
  const mallas = glb.nodes.filter((n) => n.mesh !== undefined).map((n) => n.name ?? '')
  const porTipo = (kind: string) => mallas.filter((m) => classifyMesh(m).kind === kind)

  it('cuenta las 144 mallas del modelo', () => {
    expect(mallas).toHaveLength(144)
  })

  it('cuenta 118 estructuras óseas', () => {
    expect(porTipo('bone')).toHaveLength(118)
  })

  it('aparta 14 dientes, 10 cartílagos y 2 sesamoideos', () => {
    expect(porTipo('tooth')).toHaveLength(14)
    expect(porTipo('cartilage')).toHaveLength(10)
    expect(porTipo('sesamoid')).toHaveLength(2)
  })

  it('deja sin lado solo a las piezas impares y a las ya explícitas por lado', () => {
    const sinLado = porTipo('bone').filter((m) => classifyMesh(m).side === null)
    expect(sinLado).toHaveLength(34)
  })
})
