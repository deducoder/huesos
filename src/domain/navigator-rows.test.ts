import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import type { Bone } from '../data/bone'
import { toNavigatorRows } from './navigator-rows'

const hueso = (over: Partial<Bone>): Bone =>
  ({
    id: 'x',
    side: null,
    es: 'x',
    la: 'x',
    synonyms: [],
    region: 'cranium',
    meshName: 'x',
    ...over,
  }) as Bone

describe('toNavigatorRows', () => {
  it('empareja dos huesos adyacentes de lados opuestos', () => {
    const derecho = hueso({ id: 'femur-right', side: 'right', es: 'fémur' })
    const izquierdo = hueso({ id: 'femur-left', side: 'left', es: 'fémur' })
    const filas = toNavigatorRows([derecho, izquierdo])

    expect(filas).toEqual([{ kind: 'paired', name: 'fémur', right: derecho, left: izquierdo }])
  })

  it('dos impares seguidos quedan como dos filas simples', () => {
    const a = hueso({ id: 'sphenoid', side: null })
    const b = hueso({ id: 'ethmoid', side: null })
    const filas = toNavigatorRows([a, b])

    expect(filas).toEqual([
      { kind: 'single', bone: a },
      { kind: 'single', bone: b },
    ])
  })

  it('un derecho sin su izquierdo adyacente no se pierde: queda como fila simple', () => {
    const derecho = hueso({ id: 'femur-right', side: 'right' })
    const otro = hueso({ id: 'sphenoid', side: null })
    const filas = toNavigatorRows([derecho, otro])

    expect(filas).toEqual([
      { kind: 'single', bone: derecho },
      { kind: 'single', bone: otro },
    ])
  })

  it('un derecho seguido de un izquierdo que no es su par tampoco se empareja', () => {
    const derecho = hueso({ id: 'femur-right', side: 'right' })
    const otroIzquierdo = hueso({ id: 'tibia-left', side: 'left' })
    const filas = toNavigatorRows([derecho, otroIzquierdo])

    expect(filas).toEqual([
      { kind: 'single', bone: derecho },
      { kind: 'single', bone: otroIzquierdo },
    ])
  })

  it('conserva el orden de aparición', () => {
    const a = hueso({ id: 'a', side: null })
    const bDer = hueso({ id: 'b-right', side: 'right' })
    const bIzq = hueso({ id: 'b-left', side: 'left' })
    const c = hueso({ id: 'c', side: null })
    const filas = toNavigatorRows([a, bDer, bIzq, c])

    expect(filas.map((f) => (f.kind === 'single' ? f.bone.id : f.right.id))).toEqual([
      'a',
      'b-right',
      'c',
    ])
  })

  it('sobre el catálogo real: 120 filas, 86 pares y 34 simples', () => {
    const filas = toNavigatorRows(catalog)
    const pares = filas.filter((f) => f.kind === 'paired')
    const simples = filas.filter((f) => f.kind === 'single')

    expect(filas.length).toBe(120)
    expect(pares.length).toBe(86)
    expect(simples.length).toBe(34)

    const huesosCubiertos = filas.flatMap((f) =>
      f.kind === 'paired' ? [f.right.id, f.left.id] : [f.bone.id],
    )
    expect(new Set(huesosCubiertos).size).toBe(206)
  })
})
