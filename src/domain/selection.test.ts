import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { findBone, toggleSelection } from './selection'

describe('el estado de selección', () => {
  it('selecciona un hueso cuando no había ninguno', () => {
    expect(toggleSelection(null, 'femur-right')).toBe('femur-right')
  })

  it('cambia de hueso cuando ya había otro', () => {
    expect(toggleSelection('tibia-left', 'femur-right')).toBe('femur-right')
  })

  it('deselecciona al volver a activar el mismo', () => {
    expect(toggleSelection('femur-right', 'femur-right')).toBeNull()
  })

  it('encuentra el hueso seleccionado en el catálogo', () => {
    expect(findBone(catalog, 'femur-right')?.es).toBe('fémur')
    expect(findBone(catalog, 'malleus-left')?.la).toBe('malleus')
  })

  it('no encuentra nada cuando no hay selección o el id no existe', () => {
    expect(findBone(catalog, null)).toBeUndefined()
    expect(findBone(catalog, 'hueso-inventado')).toBeUndefined()
  })
})
