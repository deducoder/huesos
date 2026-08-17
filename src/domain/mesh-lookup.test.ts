import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { boneIdForMesh } from './mesh-lookup'

describe('resolver una malla de la escena a un hueso del catálogo', () => {
  it('da el hueso derecho cuando se pulsa la mitad original', () => {
    expect(boneIdForMesh(catalog, 'Femur.r', 'original')).toBe('femur-right')
  })

  it('da el hueso izquierdo cuando se pulsa la mitad espejada', () => {
    expect(boneIdForMesh(catalog, 'Femur.r', 'mirrored')).toBe('femur-left')
  })

  it('da el mismo hueso impar en cualquiera de las dos mitades', () => {
    expect(boneIdForMesh(catalog, 'Sphenoid bone', 'original')).toBe('sphenoid')
    expect(boneIdForMesh(catalog, 'Sphenoid bone', 'mirrored')).toBe('sphenoid')
  })

  it('respeta los pares que el modelo ya trae por duplicado', () => {
    expect(boneIdForMesh(catalog, 'Parietal bone right', 'original')).toBe('parietal-right')
    expect(boneIdForMesh(catalog, 'Parietal bone left', 'original')).toBe('parietal-left')
  })

  it('no inventa nada ante una malla que no está en el catálogo', () => {
    expect(boneIdForMesh(catalog, 'Manubrium of sternum', 'original')).toBeNull()
    expect(boneIdForMesh(catalog, 'Lower canine.r', 'original')).toBeNull()
    expect(boneIdForMesh(catalog, 'no existe', 'original')).toBeNull()
  })

  it('resuelve toda malla ósea catalogada, en ambas mitades', () => {
    const sinResolver = catalog
      .filter((b) => b.meshName !== null)
      .filter((b) => {
        const mitad = b.side === 'left' ? 'mirrored' : 'original'
        return boneIdForMesh(catalog, b.meshName, mitad) === null
      })
      .map((b) => b.id)
    expect(sinResolver).toEqual([])
  })
})
