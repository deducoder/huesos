import type { Object3D } from 'three'
import { MIDLINE_GROUP } from '../data/skeleton-groups'

/**
 * Deja una copia del modelo lista para dibujarse espejada, quitándole del grafo
 * las piezas que el modelo ya trae en su sitio: la línea media y el único par
 * que viene completo (b2.3).
 *
 * **Se quitan, no se ocultan.** `visible = false` las saca del render pero no
 * del raycaster: `three` no comprueba `visible` al calcular intersecciones, así
 * que una malla oculta se sigue pulsando. Esa fue la primera versión de este
 * arreglo, y dejaba superficies invisibles que respondían al clic en el
 * hemisferio contrario — la calota, sobre todo, donde el espejo del parietal
 * derecho cubría el lado izquierdo sin verse.
 *
 * Muta la copia que recibe, que por eso es una copia, y la devuelve para poder
 * encadenarla con el clonado.
 */
export function stripMidline(root: Object3D): Object3D {
  root.getObjectByName(MIDLINE_GROUP)?.removeFromParent()
  return root
}
