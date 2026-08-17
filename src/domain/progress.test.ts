import { describe, expect, it } from 'vitest'
import { boneProgress, EMPTY_PROGRESS } from './progress'

describe('el registro de progreso', () => {
  it('devuelve el estado inicial para un hueso que nunca se respondió', () => {
    expect(boneProgress(EMPTY_PROGRESS, 'vomer')).toEqual({ correct: 0, incorrect: 0 })
  })

  it('no devuelve `undefined` para un id ausente, sino ceros', () => {
    // Un id ausente significa "nunca preguntado", no "no existe": el contrato
    // del diseño de la épica lo fija así para que quien lea no tenga que
    // distinguir los dos casos.
    expect(boneProgress(EMPTY_PROGRESS, 'hueso-inventado')).toEqual({ correct: 0, incorrect: 0 })
  })

  it('lee el estado de un hueso que sí está registrado', () => {
    const registro = { frontal: { correct: 1, incorrect: 2 } }
    expect(boneProgress(registro, 'frontal')).toEqual({ correct: 1, incorrect: 2 })
  })
})
