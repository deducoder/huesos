import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { findBone } from './selection'
import { isCorrectAnswer, normalizeAnswer } from './answer-check'

const hueso = (id: string) => {
  const bone = findBone(catalog, id)
  if (!bone) throw new Error(`no existe ${id} en el catálogo`)
  return bone
}

describe('normalizeAnswer', () => {
  it('pasa a minúsculas', () => {
    expect(normalizeAnswer('FEMUR')).toBe('femur')
  })

  it('quita las tildes', () => {
    expect(normalizeAnswer('fémur')).toBe('femur')
  })

  it('recorta espacios al inicio y al final', () => {
    expect(normalizeAnswer('  fémur  ')).toBe('femur')
  })

  it('colapsa espacios múltiples internos', () => {
    expect(normalizeAnswer('hueso   del  muslo')).toBe('hueso del muslo')
  })

  it('quita un artículo inicial', () => {
    expect(normalizeAnswer('el fémur')).toBe('femur')
    expect(normalizeAnswer('la tibia')).toBe('tibia')
    expect(normalizeAnswer('los huesos')).toBe('huesos')
    expect(normalizeAnswer('las vértebras')).toBe(
      'vértebras'.normalize('NFD').replace(/\p{Diacritic}/gu, ''),
    )
  })

  it('no toca una respuesta vacía', () => {
    expect(normalizeAnswer('')).toBe('')
    expect(normalizeAnswer('   ')).toBe('')
  })

  it('conserva la "ñ": no es una tilde, es una letra distinta', () => {
    // "cuña" (hueso) y "cuna" (cama de bebé) son palabras distintas — quitar
    // la tilde de "á" es tolerancia; convertir "ñ" en "n" cambia el
    // significado, y eso RF-06 no lo pide.
    expect(normalizeAnswer('cuña')).toBe('cuña')
    expect(normalizeAnswer('CUÑA')).toBe('cuña')
  })
})

describe('isCorrectAnswer', () => {
  it('acepta el nombre en español, en cualquier mayúscula/minúscula', () => {
    expect(isCorrectAnswer('FEMUR', hueso('femur-right'))).toBe(true)
    expect(isCorrectAnswer('femur', hueso('femur-right'))).toBe(true)
  })

  it('acepta el nombre con artículo inicial', () => {
    expect(isCorrectAnswer('el fémur', hueso('femur-right'))).toBe(true)
  })

  it('acepta el nombre en latín', () => {
    expect(isCorrectAnswer('os femoris', hueso('femur-right'))).toBe(true)
  })

  it('acepta un sinónimo registrado', () => {
    expect(isCorrectAnswer('hueso del muslo', hueso('femur-right'))).toBe(true)
  })

  it('rechaza el nombre de otro hueso', () => {
    expect(isCorrectAnswer('tibia', hueso('femur-right'))).toBe(false)
  })

  it('acepta un sinónimo con mayúscula real del catálogo, escrito en minúscula', () => {
    // 'primera vértebra cervical' registra 'C1' como sinónimo.
    expect(isCorrectAnswer('c1', hueso('cervical-1'))).toBe(true)
  })

  it('rechaza una respuesta vacía o solo espacios', () => {
    expect(isCorrectAnswer('', hueso('femur-right'))).toBe(false)
    expect(isCorrectAnswer('   ', hueso('femur-right'))).toBe(false)
  })

  it('no confunde "cuña" con "cuna": la ñ no es una tilde que tolerar', () => {
    expect(isCorrectAnswer('cuna medial', hueso('medial-cuneiform-right'))).toBe(false)
    expect(isCorrectAnswer('cuña medial', hueso('medial-cuneiform-right'))).toBe(true)
  })
})
