import { describe, expect, it } from 'vitest'
import type { BoneRegion } from './bone'
import { catalog } from './catalog'

/**
 * El desglose canónico del esqueleto adulto: 206 huesos.
 * El criterio de conteo importa, porque las fuentes discrepan sobre los huesos
 * fusionados. Aquí: sacro y cóccix cuentan uno cada uno, y el esternón cuenta
 * uno pese a que el modelo lo parta en manubrio y cuerpo.
 */
const CANON: Record<BoneRegion, number> = {
  cranium: 8,
  face: 14,
  ear: 6,
  hyoid: 1,
  spine: 26,
  thorax: 25,
  'shoulder-girdle': 4,
  'upper-limb': 60,
  'pelvic-girdle': 2,
  'lower-limb': 60,
}

describe('la cobertura del catálogo', () => {
  it('tiene los 206 huesos del esqueleto adulto', () => {
    expect(catalog).toHaveLength(206)
  })

  it('reparte los huesos por región como manda el desglose canónico', () => {
    for (const [region, esperados] of Object.entries(CANON)) {
      const hay = catalog.filter((b) => b.region === region).length
      expect(hay, `región ${region}`).toBe(esperados)
    }
  })

  it('ancla 199 entradas a la geometría del modelo', () => {
    expect(catalog.filter((b) => b.meshName !== null)).toHaveLength(199)
  })

  it('declara exactamente 7 ausencias', () => {
    // Solo el recuento: que cada ausencia venga con una razón que explique lo
    // afirma la prueba de la condición de lanzamiento, y repetirlo aquí sería
    // la misma afirmación en dos sitios. Esta cifra documenta el estado real
    // del activo y delata un cambio silencioso en el modelo.
    expect(catalog.filter((b) => b.meshName === null)).toHaveLength(7)
  })

  it('sitúa las ausencias donde la anatomía las pone: oído medio e hioides', () => {
    const ausentes = catalog.filter((b) => b.meshName === null).map((b) => b.region)
    expect(ausentes.filter((r) => r === 'ear')).toHaveLength(6)
    expect(ausentes.filter((r) => r === 'hyoid')).toHaveLength(1)
  })

  it('cumple la condición de lanzamiento: geometría o razón, nunca ninguna', () => {
    // El criterio de ADR-006: una entrada está completa cuando tiene malla en
    // el modelo **o** una razón documentada de por qué no la tiene. El
    // catálogo cubre los 206 huesos del esqueleto adulto; el modelo 3D cubre
    // 199 de ellos, y el catálogo lo dice.
    //
    // El tipo `Bone` ya hace imposible el estado incoherente al escribir el
    // catálogo. Esta aserción existe para quien lee `RF-08`: la condición de
    // lanzamiento tiene que poder encontrarse como una prueba con nombre, no
    // reconstruirse desde una unión de tipos.
    // Una razón simbólica ("n/a", "-") cumpliría la letra y no el propósito,
    // así que se exige que explique: más de 20 caracteres.
    const incompletas = catalog
      .filter((bone) => bone.meshName === null && (bone.missingReason?.length ?? 0) <= 20)
      .map((bone) => bone.id)

    expect(incompletas, 'entradas sin geometría y sin una razón que explique').toEqual([])
    expect(catalog).toHaveLength(206)
  })

  it('da a cada hueso par sus dos lados', () => {
    const porNombre = new Map<string, Set<string>>()
    for (const hueso of catalog) {
      if (hueso.side === null) continue
      const lados = porNombre.get(hueso.es) ?? new Set()
      lados.add(hueso.side)
      porNombre.set(hueso.es, lados)
    }
    const cojos = [...porNombre.entries()].filter(([, lados]) => lados.size !== 2).map(([es]) => es)
    expect(cojos, 'huesos pares con un solo lado').toEqual([])
  })
})
