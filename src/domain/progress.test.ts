import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { boneProgress, EMPTY_PROGRESS, recordAnswer } from './progress'

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

  it('anota un acierto sobre un registro vacío', () => {
    const despues = recordAnswer(EMPTY_PROGRESS, 'femur-right', true)
    expect(boneProgress(despues, 'femur-right')).toEqual({ correct: 1, incorrect: 0 })
  })

  it('anota un fallo sobre un registro vacío', () => {
    const despues = recordAnswer(EMPTY_PROGRESS, 'frontal', false)
    expect(boneProgress(despues, 'frontal')).toEqual({ correct: 0, incorrect: 1 })
  })

  it('acumula fallos sucesivos del mismo hueso', () => {
    const uno = recordAnswer(EMPTY_PROGRESS, 'frontal', false)
    const dos = recordAnswer(uno, 'frontal', false)
    expect(boneProgress(dos, 'frontal')).toEqual({ correct: 0, incorrect: 2 })
  })

  it('un acierto no borra los fallos acumulados de ese hueso', () => {
    const fallado = { 'scaphoid-left': { correct: 0, incorrect: 2 } }
    const despues = recordAnswer(fallado, 'scaphoid-left', true)
    expect(boneProgress(despues, 'scaphoid-left')).toEqual({ correct: 1, incorrect: 2 })
  })

  it('no toca el resto del registro al anotar un hueso', () => {
    const antes = { frontal: { correct: 1, incorrect: 2 } }
    const despues = recordAnswer(antes, 'sacrum', true)
    expect(boneProgress(despues, 'frontal')).toEqual({ correct: 1, incorrect: 2 })
    expect(boneProgress(despues, 'sacrum')).toEqual({ correct: 1, incorrect: 0 })
  })

  it('no modifica el registro que recibe: devuelve uno nuevo', () => {
    const antes = { frontal: { correct: 0, incorrect: 1 } }
    const despues = recordAnswer(antes, 'frontal', false)
    expect(antes).toEqual({ frontal: { correct: 0, incorrect: 1 } })
    expect(despues).not.toBe(antes)
  })

  it('el estado inicial que devuelve no es un objeto compartido', () => {
    // Devolver siempre la misma instancia para todo id ausente convierte
    // cualquier mutación de un consumidor en corrupción global y permanente
    // del estado inicial. El `as` simula a ese consumidor descuidado —o a
    // JavaScript sin tipos— para comprobar que el daño no se propaga.
    const leido = boneProgress(EMPTY_PROGRESS, 'frontal') as { correct: number }
    leido.correct = 99

    expect(boneProgress(EMPTY_PROGRESS, 'occipital')).toEqual({ correct: 0, incorrect: 0 })
  })

  it('sobrevive a una ida y vuelta por JSON, con los ids reales del catálogo', () => {
    // Contra el catálogo real y no contra ids inventados: es el
    // almacenamiento de e5.2 quien va a serializar esto, y probar la ida y
    // vuelta con datos de juguete probaría `JSON`, no el registro.
    let registro = EMPTY_PROGRESS
    for (const bone of catalog) registro = recordAnswer(registro, bone.id, bone.id.length % 2 === 0)

    const vuelto = JSON.parse(JSON.stringify(registro))

    expect(Object.keys(vuelto)).toHaveLength(catalog.length)
    for (const bone of catalog) {
      expect(boneProgress(vuelto, bone.id)).toEqual(boneProgress(registro, bone.id))
    }
  })
})
