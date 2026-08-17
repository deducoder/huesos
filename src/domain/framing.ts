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
