import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { pickTestableBone } from './quiz'

describe('pickTestableBone', () => {
  it('nunca elige un hueso sin malla en el modelo', () => {
    // Corrida muchas veces: no depende de qué posición cayó al azar.
    for (let i = 0; i < 500; i++) {
      const hueso = pickTestableBone(catalog)
      expect(hueso.meshName).not.toBeNull()
    }
  })

  it('nunca elige el id excluido', () => {
    for (let i = 0; i < 500; i++) {
      const hueso = pickTestableBone(catalog, 'femur-right')
      expect(hueso.id).not.toBe('femur-right')
    }
  })
})
