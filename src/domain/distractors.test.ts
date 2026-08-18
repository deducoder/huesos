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

  it('nunca incluye al hermano anatómico (hip-bone-left) — ver "sin el hermano anatómico" más abajo', () => {
    for (let i = 0; i < 200; i++) {
      const distractores = pickDistractors(coxalDerecho, catalog)
      expect(distractores.map((d) => d.id)).not.toContain('hip-bone-left')
    }
  })

  it('ambos distractores se completan desde otras regiones, ninguno de pelvic-girdle', () => {
    for (let i = 0; i < 200; i++) {
      const distractores = pickDistractors(coxalDerecho, catalog)
      for (const d of distractores) {
        expect(d.region).not.toBe('pelvic-girdle')
        expect(d.meshName).not.toBeNull()
      }
    }
  })
})

describe('pickDistractors — sin el hermano anatómico', () => {
  // clavicle-right y clavicle-left comparten el mismo `es` ("clavícula"): el
  // lado no está en el nombre, se agrega aparte en la vista (BoneNavigator,
  // accessibleName). Si el hermano aparece como distractor, la opción múltiple
  // muestra dos botones con el mismo texto — hallazgo de la verificación
  // manual (T3).
  const claviculaDerecha = catalog.find((b) => b.id === 'clavicle-right')
  if (claviculaDerecha === undefined)
    throw new Error('fixture: clavicle-right no está en el catálogo')

  it('nunca elige al hermano anatómico (mismo nombre, lado opuesto) como distractor', () => {
    for (let i = 0; i < 200; i++) {
      const distractores = pickDistractors(claviculaDerecha, catalog)
      expect(distractores.map((d) => d.id)).not.toContain('clavicle-left')
    }
  })

  it('tampoco elige dos distractores que sean hermanos entre sí', () => {
    // shoulder-girdle tiene 4 huesos preguntables; al excluir clavicle-right
    // (preguntado) y clavicle-left (su hermano) solo quedan scapula-right y
    // scapula-left — hermanos entre sí. Si se eligen los dos, la opción
    // múltiple mostraría "escápula" y "escápula".
    for (let i = 0; i < 200; i++) {
      const distractores = pickDistractors(claviculaDerecha, catalog)
      const nombres = distractores.map((d) => d.es)
      expect(new Set(nombres).size).toBe(nombres.length)
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
