import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { visibleForIsolation } from './isolation'

describe('decidir qué malla queda visible al aislar un hueso', () => {
  it('muestra la malla del hueso par en su lado correcto', () => {
    expect(visibleForIsolation(catalog, 'Femur.r', 'original', 'femur-right')).toBe(true)
  })

  it('oculta la misma malla en el lado contrario', () => {
    expect(visibleForIsolation(catalog, 'Femur.r', 'original', 'femur-left')).toBe(false)
  })

  it('muestra un hueso impar en cualquiera de las dos mitades', () => {
    expect(visibleForIsolation(catalog, 'Sacrum', 'original', 'sacrum')).toBe(true)
    expect(visibleForIsolation(catalog, 'Sacrum', 'mirrored', 'sacrum')).toBe(true)
  })

  it('oculta cualquier otro hueso del catálogo', () => {
    expect(visibleForIsolation(catalog, 'Sacrum', 'original', 'femur-right')).toBe(false)
  })

  it('oculta una malla sin entrada en el catálogo, sin caso especial', () => {
    expect(visibleForIsolation(catalog, 'Lower canine.r', 'original', 'femur-right')).toBe(false)
    expect(visibleForIsolation(catalog, 'Manubrium of sternum', 'original', 'sternum')).toBe(false)
  })
})
