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
      const hueso = pickTestableBone(catalog, { excluirId: 'femur-right' })
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

describe('la selección ponderada por fallos', () => {
  /**
   * Un sorteo determinista que barre [0,1) en `n` pasos. Con esto el sesgo se
   * **mide**, no se intuye: mismos números, mismo resultado, siempre. Usar
   * `Math.random` aquí produciría el test intermitente que ya costó dos
   * sesiones en s1.
   */
  function barrido(n: number) {
    let i = 0
    return () => (i++ % n) / n
  }

  /** Cuántas veces sale cada hueso a lo largo de un barrido completo. */
  function conteo(progress: Record<string, { correct: number; incorrect: number }>, n = 200) {
    const sorteo = barrido(n)
    const veces = new Map<string, number>()
    for (let i = 0; i < n; i++) {
      const hueso = pickTestableBone(catalog, { progress, sorteo })
      veces.set(hueso.id, (veces.get(hueso.id) ?? 0) + 1)
    }
    return veces
  }

  it('el hueso fallado sale más que el solo acertado', () => {
    const veces = conteo({
      frontal: { correct: 0, incorrect: 5 },
      sacrum: { correct: 5, incorrect: 0 },
    })

    expect(veces.get('frontal') ?? 0).toBeGreaterThan(veces.get('sacrum') ?? 0)
  })

  it('cuantos más fallos, más sale', () => {
    const veces = conteo({
      frontal: { correct: 0, incorrect: 10 },
      sacrum: { correct: 0, incorrect: 2 },
    })

    expect(veces.get('frontal') ?? 0).toBeGreaterThan(veces.get('sacrum') ?? 0)
  })

  it('con el registro vacío ningún hueso domina', () => {
    const veces = conteo({})
    const maximo = Math.max(...veces.values())

    // Uniforme sobre ~200 preguntables: nadie debería llevarse una porción
    // grande. Con sesgo, el favorecido se llevaría decenas.
    expect(maximo).toBeLessThanOrEqual(2)
  })

  it('un hueso dominado sigue pudiendo salir: la ponderación no expulsa', () => {
    // `sacrum` acertado 999 veces conserva el peso mínimo, así que en un
    // barrido completo tiene que aparecer alguna vez.
    const veces = conteo({ sacrum: { correct: 999, incorrect: 0 } })

    expect(veces.get('sacrum') ?? 0).toBeGreaterThan(0)
  })

  it('sigue sin elegir huesos sin malla ni el inmediato anterior', () => {
    const progress = { frontal: { correct: 0, incorrect: 20 } }
    const sorteo = barrido(200)
    for (let i = 0; i < 200; i++) {
      const hueso = pickTestableBone(catalog, { excluirId: 'frontal', progress, sorteo })
      expect(hueso.meshName).not.toBeNull()
      expect(hueso.id).not.toBe('frontal')
    }
  })
})
