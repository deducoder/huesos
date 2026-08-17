import { PropertyBinding } from 'three'
import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { boneIdForMesh } from './mesh-lookup'

/**
 * Reproducción de b2.1.
 *
 * `three` sanitiza el nombre de cada nodo al cargar el glTF, así que el nombre
 * que llega en el evento de la escena **no** es el `meshName` del catálogo. Este
 * test hace lo que hace la aplicación: pasar por el saneado y luego buscar.
 */
describe('b2.1 · la selección desde la escena, con los nombres tal como llegan de three', () => {
  const comoLlegaDeLaEscena = (meshName: string) => PropertyBinding.sanitizeNodeName(meshName)

  it('resuelve el fémur al pulsarlo en la escena', () => {
    expect(boneIdForMesh(catalog, comoLlegaDeLaEscena('Femur.r'), 'original')).toBe('femur-right')
  })

  it('resuelve cualquier hueso anclado, no solo los tres de nombre simple', () => {
    const irresolubles = catalog
      .filter((b) => b.meshName !== null)
      .filter((b) => {
        const mitad = b.side === 'left' ? 'mirrored' : 'original'
        return boneIdForMesh(catalog, comoLlegaDeLaEscena(b.meshName), mitad) === null
      })
      .map((b) => b.id)
    expect(irresolubles).toEqual([])
  })
})
