import { describe, expect, it } from 'vitest'
import { distanceToFit, frameObject } from './framing'

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

describe('frameObject: encuadre que conoce el ancho, el aspecto y lo que la tarjeta tapa', () => {
  /** El lienzo de un teléfono: 390 de ancho por unos 760 de alto útil. */
  const TELEFONO = { fovDegrees: 45, aspect: 390 / 760, reservedBottom: 0 }

  /**
   * Los dos casos vienen medidos sobre `skeleton.glb` (las 144 mallas del
   * modelo), no elegidos por comodidad: la clavícula es de los más anchos
   * respecto de su alto (ratio 4,26) y el fémur es alto y estrecho (0,26).
   * El fémur es justo el hueso con el que uno probaría, y es el que **no**
   * expone el defecto.
   */
  const CLAVICULA = { width: 0.14, height: 0.033 }
  const FEMUR = { width: 0.116, height: 0.451 }

  it('a la clavícula la encuadra su ancho, no su alto', () => {
    const { distance } = frameObject(CLAVICULA, TELEFONO, 1)
    // Encuadrarla por su altura daría 0.040 y se saldría por los dos lados.
    expect(distance).toBeCloseTo(0.329, 2)
    expect(distance).toBeGreaterThan(distanceToFit(CLAVICULA.height, 45, 1) * 5)
  })

  it('al fémur lo sigue encuadrando su alto, y no lo aleja más que antes', () => {
    const { distance } = frameObject(FEMUR, TELEFONO, 1)
    expect(distance).toBeCloseTo(distanceToFit(FEMUR.height, 45, 1), 5)
  })

  it('sin nada reservado abajo, no descentra la proyección', () => {
    expect(frameObject(CLAVICULA, TELEFONO, 1).viewOffsetY).toBe(0)
  })

  it('con la tarjeta tapando abajo, aleja la cámara y descentra la proyección', () => {
    const sinTarjeta = frameObject(FEMUR, TELEFONO, 1)
    const conTarjeta = frameObject(FEMUR, { ...TELEFONO, reservedBottom: 0.4 }, 1)

    expect(conTarjeta.distance).toBeGreaterThan(sinTarjeta.distance)
    // Media reserva: es lo que separa el centro de la franja libre del centro
    // del lienzo.
    expect(conTarjeta.viewOffsetY).toBeCloseTo(0.2, 5)
  })

  it('el descentrado nunca mueve el punto al que la cámara mira', () => {
    // La regresión que el usuario encontró en el teléfono: con el punto de
    // giro desplazado junto a la cámara, girar en vertical sacaba el hueso
    // del encuadre. `frameObject` describe un descentrado de proyección, no
    // un desplazamiento de cámara — y por eso devuelve una fracción del
    // lienzo y no unidades de mundo.
    const { viewOffsetY } = frameObject(FEMUR, { ...TELEFONO, reservedBottom: 0.4 }, 1)
    expect(viewOffsetY).toBeLessThan(0.5)
    expect(Number.isFinite(viewOffsetY)).toBe(true)
  })

  it('en una pantalla apaisada la misma clavícula necesita menos distancia', () => {
    // Sigue mandando su ancho —0,140 / 1,556 = 0,090, más que su alto de
    // 0,033—, pero un lienzo más ancho que alto la deja entrar más cerca.
    // Que el ancho gobierne incluso en apaisado es la medida de lo
    // desproporcionado que es este hueso, no un error del cálculo.
    const escritorio = { fovDegrees: 45, aspect: 1400 / 900, reservedBottom: 0 }
    expect(frameObject(CLAVICULA, escritorio, 1).distance).toBeLessThan(
      frameObject(CLAVICULA, TELEFONO, 1).distance,
    )
  })

  it('un objeto ancho entra entero donde antes no cabía', () => {
    // El encuadre de hoy: `max(x, y, z)` tratado como altura. Para la
    // clavícula, z = 0,101, así que manda su ancho de 0,140.
    const hoy = distanceToFit(0.14, 45, 1)
    const anchoVisibleHoy = 2 * hoy * Math.tan((45 * Math.PI) / 180 / 2) * TELEFONO.aspect
    expect(anchoVisibleHoy, 'hoy la clavícula no entra a lo ancho').toBeLessThan(CLAVICULA.width)

    const { distance } = frameObject(CLAVICULA, TELEFONO, 1)
    const anchoVisible = 2 * distance * Math.tan((45 * Math.PI) / 180 / 2) * TELEFONO.aspect
    expect(anchoVisible, 'con el encuadre nuevo, sí').toBeGreaterThanOrEqual(CLAVICULA.width)
  })

  it('no devuelve valores absurdos ante un objeto nulo', () => {
    const { distance, viewOffsetY } = frameObject({ width: 0, height: 0 }, TELEFONO, 1)
    expect(Number.isFinite(distance)).toBe(true)
    expect(distance).toBeGreaterThan(0)
    expect(Number.isFinite(viewOffsetY)).toBe(true)
  })

  it('no se va al infinito si la reserva se acerca a la pantalla entera', () => {
    const { distance } = frameObject(FEMUR, { ...TELEFONO, reservedBottom: 1 }, 1)
    expect(Number.isFinite(distance)).toBe(true)
  })
})
