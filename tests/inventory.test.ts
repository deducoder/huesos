import { describe, expect, it } from 'vitest'
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
