import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Object3D, Raycaster, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { MIDLINE_GROUP } from '../data/skeleton-groups'
import { stripMidline } from './mirroring'

/**
 * La copia espejada no debe contener las piezas que el modelo ya trae en su
 * sitio. **Ocultarlas no basta**: `visible = false` las saca del render pero no
 * del raycaster —comprobado: una malla invisible sigue devolviendo 2
 * intersecciones—, y en la escena eso deja superficies que no se ven pero se
 * pulsan, en el hemisferio contrario al que el usuario cree estar tocando.
 */
function escenaDePrueba() {
  const raiz = new Object3D()
  const lineaMedia = new Group()
  lineaMedia.name = MIDLINE_GROUP
  const craneo = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial())
  craneo.name = 'Parietal bone right'
  lineaMedia.add(craneo)

  const lateral = new Group()
  lateral.name = 'Bones_right'
  const femur = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial())
  femur.name = 'Femur.r'
  femur.position.set(0, -3, 0)
  lateral.add(femur)

  raiz.add(lineaMedia, lateral)
  raiz.updateMatrixWorld(true)
  return raiz
}

/** Un rayo que apunta de frente al origen, donde está la pieza de línea media. */
const rayoAlOrigen = () => new Raycaster(new Vector3(0, 0, 5), new Vector3(0, 0, -1))

describe('la preparación de la mitad espejada', () => {
  it('deja la línea media fuera del alcance del raycaster, no solo invisible', () => {
    const raiz = stripMidline(escenaDePrueba())
    raiz.updateMatrixWorld(true)
    const alcanzadas = rayoAlOrigen()
      .intersectObject(raiz, true)
      .map((i) => i.object.name)
    expect(alcanzadas, 'la línea media sigue siendo pulsable en la mitad espejada').toEqual([])
  })

  it('la deja fuera del grafo, que es lo que el raycaster respeta', () => {
    const raiz = stripMidline(escenaDePrueba())
    expect(raiz.getObjectByName(MIDLINE_GROUP)).toBeUndefined()
  })

  it('no toca lo que sí necesita espejo', () => {
    const raiz = stripMidline(escenaDePrueba())
    expect(raiz.getObjectByName('Femur.r')).toBeDefined()
  })

  it('alcanza la línea media si NO se prepara, para probar que el rayo apunta bien', () => {
    // Sin esto, un rayo mal apuntado daría verde en el primer caso sin haber
    // mirado nada.
    const raiz = escenaDePrueba()
    const alcanzadas = rayoAlOrigen().intersectObject(raiz, true)
    expect(alcanzadas.length).toBeGreaterThan(0)
  })

  it('no falla si el grupo no está, para no atarse a un activo concreto', () => {
    const suelta = new Object3D()
    expect(() => stripMidline(suelta)).not.toThrow()
  })
})
