import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { pickTestableBone, weightFor } from './quiz'

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

describe('el peso de un hueso según su registro', () => {
  it('un hueso nunca preguntado pesa 1: es la referencia', () => {
    expect(weightFor({}, 'frontal')).toBe(1)
  })

  it('un fallo lo sube', () => {
    expect(weightFor({ frontal: { correct: 0, incorrect: 1 } }, 'frontal')).toBe(4)
  })

  it('acumular fallos lo sube más', () => {
    expect(weightFor({ frontal: { correct: 0, incorrect: 2 } }, 'frontal')).toBe(7)
  })

  it('un acierto posterior baja la ventaja sin anularla', () => {
    expect(weightFor({ frontal: { correct: 1, incorrect: 1 } }, 'frontal')).toBe(3)
  })

  it('nunca baja de 1, aunque se acierte muchas veces', () => {
    // El suelo ES la invariante de ADR-005: la ponderación cambia frecuencias,
    // nunca saca a nadie del sorteo. Sin él, un hueso dominado tendría peso
    // negativo y desaparecería del catálogo preguntable.
    expect(weightFor({ frontal: { correct: 5, incorrect: 0 } }, 'frontal')).toBe(1)
    expect(weightFor({ frontal: { correct: 999, incorrect: 0 } }, 'frontal')).toBe(1)
  })
})
