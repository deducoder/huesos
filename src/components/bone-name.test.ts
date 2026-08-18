import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { TECHO_NOMBRE_CORTO, shortName } from './bone-name'

/** Los nombres distintos del catálogo: los dos lados de un par comparten `es`. */
const nombres = [...new Set(catalog.map((b) => b.es))]

describe('el nombre corto', () => {
  it('elide el dedo y pone el ordinal en cifra en la familia de las falanges', () => {
    expect(shortName('falange proximal del segundo dedo de la mano')).toBe(
      'Falange proximal 2.º mano',
    )
    expect(shortName('falange distal del primer dedo del pie')).toBe('Falange distal 1.º pie')
  })

  it('pone el ordinal en cifra fuera de las falanges, con su género', () => {
    expect(shortName('duodécima vértebra torácica')).toBe('12.ª vértebra torácica')
    expect(shortName('segundo metatarsiano')).toBe('2.º metatarsiano')
    expect(shortName('primera costilla')).toBe('1.ª costilla')
  })

  it('solo capitaliza el nombre que no lleva ordinal', () => {
    expect(shortName('cornete nasal inferior')).toBe('Cornete nasal inferior')
    expect(shortName('fémur')).toBe('Fémur')
  })
})

describe('el gate del nombre corto sobre el catálogo real', () => {
  it('no deja que ningún nombre pase del techo', () => {
    for (const es of nombres) {
      const corto = shortName(es)
      expect(corto.length, `'${corto}' pasa del techo`).toBeLessThanOrEqual(TECHO_NOMBRE_CORTO)
    }
  })

  it('nunca da el mismo nombre corto a dos huesos distintos', () => {
    const porCorto = new Map<string, string>()
    for (const es of nombres) {
      const corto = shortName(es)
      const visto = porCorto.get(corto)
      expect(visto, `'${corto}' vale para '${es}' y para '${visto}'`).toBeUndefined()
      porCorto.set(corto, es)
    }
  })

  // Sin esto, un `shortName` que devolviera su argumento pasaría las dos
  // pruebas de arriba: los nombres del catálogo ya son únicos entre sí, y
  // el techo solo se viola si algo se acorta mal. Esta afirma que el
  // instrumento miró — que la derivación llegó a los 28 nombres que la
  // motivan, las falanges, y que ninguno sigue igual que en el catálogo.
  it('se aplica de verdad a la familia que la motiva', () => {
    const falanges = nombres.filter((es) => es.startsWith('falange'))
    expect(falanges).toHaveLength(28)
    for (const es of falanges) {
      expect(shortName(es), `'${es}' salió sin derivar`).not.toBe(es)
    }
  })
})
