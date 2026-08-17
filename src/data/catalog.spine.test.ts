import { describe, expect, it } from 'vitest'
import { catalog } from './catalog'

const columna = catalog.filter((hueso) => hueso.region === 'spine')

describe('la columna vertebral en el catálogo', () => {
  it('tiene las 26 vértebras', () => {
    expect(columna).toHaveLength(26)
  })

  it('reparte los niveles como manda la anatomía', () => {
    const cuenta = (prefijo: string) => columna.filter((v) => v.id.startsWith(prefijo)).length
    expect(cuenta('cervical'), '7 cervicales').toBe(7)
    expect(cuenta('thoracic'), '12 torácicas').toBe(12)
    expect(cuenta('lumbar'), '5 lumbares').toBe(5)
    expect(columna.filter((v) => v.id === 'sacrum' || v.id === 'coccyx')).toHaveLength(2)
  })

  it('no da lado a ninguna vértebra, porque todas son impares', () => {
    for (const vertebra of columna) {
      expect(vertebra.side, `${vertebra.id} lleva lado`).toBeNull()
    }
  })

  it('deja responder por la sigla del nivel', () => {
    const porId = (id: string) => columna.find((v) => v.id === id)
    expect(porId('cervical-1')?.synonyms).toContain('C1')
    expect(porId('thoracic-7')?.synonyms).toContain('T7')
    expect(porId('lumbar-3')?.synonyms).toContain('L3')
  })

  it('da a cada vértebra numerada su término latino con numeral romano', () => {
    expect(columna.find((v) => v.id === 'thoracic-7')?.la).toBe('vertebra thoracica VII')
    expect(columna.find((v) => v.id === 'lumbar-5')?.la).toBe('vertebra lumbalis V')
  })

  it('ancla las 26 al modelo, sin ninguna ausencia declarada', () => {
    expect(columna.filter((v) => v.meshName === null)).toEqual([])
  })
})
