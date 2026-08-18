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

  // "Toda entrada sin geometría trae una razón" lo afirma la prueba de la
  // condición de lanzamiento en `catalog.coverage.test.ts`, y con más
  // exigencia: allí la razón tiene que explicar, no solo existir. Repetirlo
  // aquí sería la misma afirmación en dos archivos. La conversa, en cambio,
  // dice algo que ninguna otra prueba dice, y se queda.
  it('no deja razón de ausencia a una entrada que sí tiene geometría', () => {
    for (const hueso of catalog) {
      if (hueso.meshName !== null) {
        expect(hueso.missingReason, `${hueso.id} tiene malla y razón de ausencia`).toBeUndefined()
      }
    }
  })

  it('da a toda entrada el género gramatical de su nombre', () => {
    for (const hueso of catalog) {
      expect(['m', 'f'], `${hueso.id} sin género declarado`).toContain(hueso.gender)
    }
  })

  it('declara el mismo género en las dos entradas de un par', () => {
    const porNombre = new Map<string, string>()
    for (const hueso of catalog) {
      const visto = porNombre.get(hueso.es)
      if (visto === undefined) porNombre.set(hueso.es, hueso.gender)
      else expect(hueso.gender, `'${hueso.es}' declara dos géneros distintos`).toBe(visto)
    }
  })

  // La coherencia de arriba no basta y no puede bastar: las dos entradas de
  // un par equivocado son coherentes entre sí. Este caso trae el criterio
  // desde fuera del catálogo, y elige a propósito los nombres donde la regla
  // ingenua —el género por terminación— falla: «falange» acaba en -e y es
  // femenino, «cornete» acaba en -e y es masculino.
  it('acierta el género donde la terminación engaña', () => {
    const esperado: Record<string, 'm' | 'f'> = {
      'clavicle-right': 'f',
      'femur-right': 'm',
      'hand-proximal-phalanx-2-right': 'f',
      'inferior-nasal-concha-right': 'm',
    }
    for (const [id, genero] of Object.entries(esperado)) {
      const hueso = catalog.find((b) => b.id === id)
      expect(hueso, `${id} no está en el catálogo`).toBeDefined()
      expect(hueso?.gender, `${id} declara el género equivocado`).toBe(genero)
    }
  })
})
