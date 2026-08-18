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

describe('pickDistractors — caso límite: región sin suficientes huesos preguntables', () => {
  // `pelvic-girdle` tiene solo 2 huesos preguntables en todo el catálogo
  // (hip-bone-right, hip-bone-left) — no alcanza para 2 distractores sin
  // completar desde el resto.
  const coxalDerecho = catalog.find((b) => b.id === 'hip-bone-right')
  if (coxalDerecho === undefined) throw new Error('fixture: hip-bone-right no está en el catálogo')

  it('sigue devolviendo count distractores, completando desde otra región', () => {
    for (let i = 0; i < 200; i++) {
      const distractores = pickDistractors(coxalDerecho, catalog)
      expect(distractores).toHaveLength(2)
      expect(distractores.map((d) => d.id)).not.toContain('hip-bone-right')
    }
  })

  it('incluye siempre el único compañero de región disponible', () => {
    for (let i = 0; i < 200; i++) {
      const distractores = pickDistractors(coxalDerecho, catalog)
      expect(distractores.map((d) => d.id)).toContain('hip-bone-left')
    }
  })

  it('el hueco se completa con un hueso preguntable de otra región', () => {
    for (let i = 0; i < 200; i++) {
      const distractores = pickDistractors(coxalDerecho, catalog)
      const relleno = distractores.find((d) => d.id !== 'hip-bone-left')
      expect(relleno).toBeDefined()
      expect(relleno?.region).not.toBe('pelvic-girdle')
      expect(relleno?.meshName).not.toBeNull()
    }
  })
})

describe('pickDistractors — catálogo insuficiente', () => {
  it('lanza un error que nombra el hueso y el count pedido, no uno genérico', () => {
    const femurDerecho = catalog.find((b) => b.id === 'femur-right')
    if (femurDerecho === undefined) throw new Error('fixture: femur-right no está en el catálogo')
    expect(() => pickDistractors(femurDerecho, [femurDerecho])).toThrow(/femur-right/)
  })
})

describe('pickDistractors — determinismo con sorteo inyectado', () => {
  it('el mismo sorteo produce el mismo resultado', () => {
    const femurDerecho = catalog.find((b) => b.id === 'femur-right')
    if (femurDerecho === undefined) throw new Error('fixture: femur-right no está en el catálogo')

    let valores: number[]
    const sorteoFijo = () => {
      const [siguiente, ...resto] = valores
      valores = resto
      if (siguiente === undefined) throw new Error('sorteoFijo: se agotaron los valores fijados')
      return siguiente
    }

    valores = [0.1, 0.2]
    const primera = pickDistractors(femurDerecho, catalog, { sorteo: sorteoFijo })
    valores = [0.1, 0.2]
    const segunda = pickDistractors(femurDerecho, catalog, { sorteo: sorteoFijo })

    expect(segunda.map((d) => d.id)).toEqual(primera.map((d) => d.id))
  })
})
