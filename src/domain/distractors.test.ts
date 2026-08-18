import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { pickDistractors } from './distractors'

describe('pickDistractors — caso típico', () => {
  const femurDerecho = catalog.find((b) => b.id === 'femur-right')
  if (femurDerecho === undefined) throw new Error('fixture: femur-right no está en el catálogo')

  it('devuelve 2 huesos de la misma región que el preguntado', () => {
    const distractores = pickDistractors(femurDerecho, catalog)
    expect(distractores).toHaveLength(2)
    for (const d of distractores) {
      expect(d.region).toBe('lower-limb')
    }
  })

  it('nunca incluye el hueso preguntado', () => {
    for (let i = 0; i < 200; i++) {
      const distractores = pickDistractors(femurDerecho, catalog)
      expect(distractores.map((d) => d.id)).not.toContain('femur-right')
    }
  })

  it('nunca repite un hueso entre los dos distractores', () => {
    for (let i = 0; i < 200; i++) {
      const [a, b] = pickDistractors(femurDerecho, catalog)
      expect(a?.id).not.toBe(b?.id)
    }
  })

  it('nunca devuelve un hueso sin malla en el modelo', () => {
    for (let i = 0; i < 200; i++) {
      const distractores = pickDistractors(femurDerecho, catalog)
      for (const d of distractores) {
        expect(d.meshName).not.toBeNull()
      }
    }
  })
})
