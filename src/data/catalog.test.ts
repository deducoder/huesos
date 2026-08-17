import { describe, expect, it } from 'vitest'
import { BONE_REGIONS, isUnpaired } from './bone'
import { catalog } from './catalog'

describe('la integridad del catálogo', () => {
  it('no repite identificadores', () => {
    const ids = catalog.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('no repite el mismo hueso del mismo lado', () => {
    const claves = catalog
      .map((b) => `${b.meshName}::${b.side}`)
      .filter((k) => !k.startsWith('null'))
    expect(new Set(claves).size).toBe(claves.length)
  })

  it('da a toda entrada nomenclatura en ambos idiomas', () => {
    for (const hueso of catalog) {
      expect(hueso.es.trim(), `${hueso.id} sin nombre en español`).not.toBe('')
      expect(hueso.la.trim(), `${hueso.id} sin término anatómico`).not.toBe('')
    }
  })

  it('sitúa toda entrada en una región conocida', () => {
    for (const hueso of catalog) {
      expect(BONE_REGIONS, `${hueso.id} en región desconocida`).toContain(hueso.region)
    }
  })

  it('da lado a los huesos pares y se lo niega a los impares', () => {
    for (const hueso of catalog) {
      if (isUnpaired(hueso)) {
        expect(hueso.side, `${hueso.id} es impar y lleva lado`).toBeNull()
      } else {
        expect(['left', 'right'], `${hueso.id} es par y no declara lado`).toContain(hueso.side)
      }
    }
  })

  it('exige una razón a toda entrada sin geometría', () => {
    for (const hueso of catalog) {
      if (hueso.meshName === null) {
        expect(hueso.missingReason?.trim(), `${hueso.id} sin malla y sin razón`).toBeTruthy()
      }
    }
  })

  it('no deja razón de ausencia a una entrada que sí tiene geometría', () => {
    for (const hueso of catalog) {
      if (hueso.meshName !== null) {
        expect(hueso.missingReason, `${hueso.id} tiene malla y razón de ausencia`).toBeUndefined()
      }
    }
  })
})
