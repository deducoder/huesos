/**
 * Encuadre de la cámara, derivado del tamaño real de lo que hay que mostrar.
 *
 * Vive en dominio y no en la escena a propósito: es aritmética pura, así que se
 * puede probar sin navegador — y b2.2 existió justamente porque el encuadre se
 * fijó con valores inventados que nadie podía verificar.
 */

/** La distancia mínima a la que una cámara en perspectiva abarca una altura dada. */
export function distanceToFit(height: number, fovDegrees: number, margin = 1.15): number {
  const fovRadianes = (fovDegrees * Math.PI) / 180
  const alturaMinima = Math.max(height, 0.001)
  return (alturaMinima / 2 / Math.tan(fovRadianes / 2)) * margin
}

/** Qué le hace falta a la cámara para abarcar un objeto en un lienzo concreto. */
export interface Framing {
  /** A qué distancia ponerla sobre el eje Z. */
  distance: number
  /**
   * Cuánto descentrar la **proyección** hacia abajo, en fracción del alto del
   * lienzo, para que el objeto se dibuje en la franja que se ve.
   *
   * No es un desplazamiento de la cámara, y la diferencia es todo el asunto:
   * bajar la cámara —y con ella su punto de mira— deja el centro de giro por
   * debajo del objeto, y al girar en vertical el objeto describe un arco
   * grande y se sale del encuadre. Verificado a mano en el teléfono. Con un
   * descentrado de proyección la cámara sigue apuntando al centro real del
   * objeto, así que la órbita es correcta en los dos ejes y el objeto se
   * dibuja igual de arriba.
   */
  viewOffsetY: number
}

/** Lo que el lienzo aporta al encuadre: su campo, su forma y lo que tiene tapado. */
export interface ViewportFraming {
  fovDegrees: number
  /** Ancho dividido alto del lienzo. Menor que 1 en un teléfono en vertical. */
  aspect: number
  /** Qué fracción del alto, contando desde abajo, cubre algo que flota encima. */
  reservedBottom: number
}

/**
 * Con una reserva del 100 % no quedaría franja donde encuadrar y la distancia
 * se iría al infinito. Se satura: es un tope de cordura, no una decisión de
 * diseño — ninguna tarjeta real llega ahí.
 */
const RESERVA_MAXIMA = 0.9

/**
 * A qué distancia y con qué desplazamiento abarcar un objeto de ancho y alto
 * dados.
 *
 * Existe porque `distanceToFit` solo conoce una dimensión y la trata como
 * altura contra el campo **vertical**. En un lienzo más alto que ancho el
 * campo horizontal es más estrecho, así que un hueso ancho —la clavícula,
 * 0,140 × 0,033— se sale por los lados aunque su altura quepa de sobra.
 * Medido sobre las 144 mallas del modelo: hay ratios de hasta 4,34.
 *
 * No sustituye a `distanceToFit`, la usa dos veces: el caso de la altura es
 * el mismo de siempre, y el del ancho es ese mismo cálculo sobre el ancho
 * corregido por el aspecto. Así la aritmética vive en un solo sitio y el
 * encuadre del esqueleto completo, que no sufre este defecto, no se mueve.
 */
export function frameObject(
  size: { width: number; height: number },
  view: ViewportFraming,
  margin = 1.15,
): Framing {
  const reserva = Math.min(Math.max(view.reservedBottom, 0), RESERVA_MAXIMA)
  const aspecto = Math.max(view.aspect, 0.001)

  // El objeto tiene que caber en la franja que queda libre, no en el lienzo
  // entero: reservar abajo equivale a encuadrar un objeto proporcionalmente
  // más alto.
  const porAltura = distanceToFit(size.height / (1 - reserva), view.fovDegrees, margin)
  // Y el ancho se convierte en una altura equivalente dividiéndolo por el
  // aspecto, que es exactamente lo que relaciona ambos campos de visión.
  const porAncho = distanceToFit(size.width / aspecto, view.fovDegrees, margin)
  const distance = Math.max(porAltura, porAncho)

  // La franja libre está centrada media reserva más arriba que el lienzo, así
  // que la proyección se descentra esa misma media reserva.
  return { distance, viewOffsetY: reserva / 2 }
}
