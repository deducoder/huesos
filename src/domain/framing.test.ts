import { describe, expect, it } from 'vitest'
import { distanceToFit } from './framing'

describe('a qué distancia poner la cámara para que quepa lo que hay que ver', () => {
  it('encuadra un modelo de 1,7 con campo de 45 grados', () => {
    // media altura / tan(fov/2) = 0.848 / 0.4142 ≈ 2.047, más el margen
    expect(distanceToFit(1.696, 45, 1)).toBeCloseTo(2.047, 2)
  })

  it('aplica el margen pedido', () => {
    expect(distanceToFit(1.696, 45, 1.2)).toBeCloseTo(2.457, 2)
  })

  it('se aleja cuando el objeto es más alto', () => {
    expect(distanceToFit(3.4, 45, 1)).toBeGreaterThan(distanceToFit(1.7, 45, 1))
  })

  it('se acerca cuando el campo de visión es más amplio', () => {
    expect(distanceToFit(1.7, 75, 1)).toBeLessThan(distanceToFit(1.7, 45, 1))
  })

  it('no devuelve una distancia absurda ante una altura nula', () => {
    expect(distanceToFit(0, 45, 1)).toBeGreaterThan(0)
  })
})
