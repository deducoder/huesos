import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import type { Bone } from '../data/bone'
import { isSideIrrelevant, siblingId } from './side-pairing'

const hueso = (over: Partial<Bone>): Bone =>
  ({
    id: 'x',
    side: null,
    es: 'x',
    la: 'x',
    synonyms: [],
    region: 'cranium',
    meshName: 'x',
    ...over,
  }) as Bone

describe('siblingId', () => {
  it('de derecha a izquierda', () => {
    expect(siblingId({ id: 'femur-right', side: 'right' })).toBe('femur-left')
  })

  it('de izquierda a derecha', () => {
    expect(siblingId({ id: 'femur-left', side: 'left' })).toBe('femur-right')
  })

  it('un hueso impar no tiene opuesto', () => {
    expect(siblingId({ id: 'sphenoid', side: null })).toBeNull()
  })
})

describe('isSideIrrelevant', () => {
  it('un par sin malla en ningún lado: el lado no distingue nada', () => {
    const derecho = hueso({ id: 'malleus-right', side: 'right', meshName: null })
    const izquierdo = hueso({ id: 'malleus-left', side: 'left', meshName: null })
    expect(isSideIrrelevant(derecho, [derecho, izquierdo])).toBe(true)
  })

  it('un par con malla en ambos lados: el lado sí distingue', () => {
    const derecho = hueso({ id: 'femur-right', side: 'right', meshName: 'Femur.r' })
    const izquierdo = hueso({ id: 'femur-left', side: 'left', meshName: 'Femur.r' })
    expect(isSideIrrelevant(derecho, [derecho, izquierdo])).toBe(false)
  })

  it('el opuesto no existe en el catálogo: no oculta ante la duda', () => {
    const derecho = hueso({ id: 'femur-right', side: 'right', meshName: null })
    expect(isSideIrrelevant(derecho, [derecho])).toBe(false)
  })

  it('un hueso impar: el lado no aplica, y no es "irrelevante" — es inexistente', () => {
    const impar = hueso({ id: 'sphenoid', side: null, meshName: null })
    expect(isSideIrrelevant(impar, [impar])).toBe(false)
  })

  it('sobre el catálogo real: los tres huesos del oído dan true', () => {
    const martillo = catalog.find((b) => b.id === 'malleus-right')
    expect(martillo).toBeDefined()
    if (martillo) expect(isSideIrrelevant(martillo, catalog)).toBe(true)
  })

  it('sobre el catálogo real: fémur da false', () => {
    const femur = catalog.find((b) => b.id === 'femur-right')
    expect(femur).toBeDefined()
    if (femur) expect(isSideIrrelevant(femur, catalog)).toBe(false)
  })
})
