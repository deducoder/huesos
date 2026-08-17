import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PropertyBinding } from 'three'
import { describe, expect, it } from 'vitest'
import { readGlb } from '../scripts/glb.mjs'
import { MIDLINE_GROUP } from '../src/data/skeleton-groups'

const ASSET = resolve('src/data/skeleton.glb')

describe('el activo del esqueleto', () => {
  const glb = readGlb(readFileSync(ASSET))

  it('no arrastra ninguna textura no comercial', () => {
    expect(glb.images ?? []).toHaveLength(0)
    expect(glb.textures ?? []).toHaveLength(0)
    expect(glb.samplers ?? []).toHaveLength(0)
  })

  it('no deja ningún material apuntando a una textura', () => {
    const referencias = (glb.materials ?? []).filter((m) => JSON.stringify(m).includes('Texture'))
    expect(referencias).toEqual([])
  })

  it('no conserva los bytes de ninguna imagen en el chunk binario', () => {
    // Borrar las entradas `images` no basta: sus bytes viven en el buffer y
    // seguirían dentro del archivo. Esto prueba la compactación, no la
    // referencia.
    const crudo = readFileSync(ASSET)
    const firmas: Record<string, Buffer> = {
      png: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
      jpeg: Buffer.from([0xff, 0xd8, 0xff]),
      webp: Buffer.from('WEBP', 'ascii'),
      ktx: Buffer.from('KTX ', 'ascii'),
    }
    for (const [formato, firma] of Object.entries(firmas)) {
      expect(crudo.includes(firma), `el activo contiene datos ${formato}`).toBe(false)
    }
  })

  it('conserva las 144 mallas del modelo original', () => {
    const nombres = glb.nodes.filter((n) => n.mesh !== undefined).map((n) => n.name)
    expect(nombres).toHaveLength(144)
    expect(new Set(nombres).size).toBe(144)
  })

  it('conserva los huesos que anclan el catálogo', () => {
    const nombres = new Set(glb.nodes.map((n) => n.name))
    for (const hueso of ['Femur.r', 'Atlas (C1)', 'Sphenoid bone', 'Rib (7th).r']) {
      expect(nombres).toContain(hueso)
    }
  })

  /**
   * b2.3: el activo declara en su jerarquía qué admite espejo y qué no, y la
   * escena lo ignoraba. Espejar el modelo entero duplicaba 36 mallas: las 34
   * centradas sobre el eje —espejarlas es copiarlas sobre sí mismas— y los dos
   * parietales, el único par que el modelo trae con malla propia por lado.
   *
   * Esto ancla la declaración contra la geometría, que es lo que faltaba: la
   * premisa «el modelo trae solo el hemicuerpo derecho» vivía en prosa dentro
   * de un ADR, donde nada la ejecuta.
   */
  describe('la partición que declara para el espejo', () => {
    const mallasDe = (raiz: string): string[] => {
      const indice = glb.nodes.findIndex((n) => n.name === raiz)
      if (indice === -1) return []
      const salida: string[] = []
      const recorrer = (i: number) => {
        const nodo = glb.nodes[i]
        if (!nodo) return
        if (nodo.mesh !== undefined && nodo.name) salida.push(nodo.name)
        for (const hijo of nodo.children ?? []) recorrer(hijo)
      }
      recorrer(indice)
      return salida
    }

    /** La caja de una malla, del accessor de POSITION de su primera primitiva. */
    const caja = (nombre: string) => {
      const nodo = glb.nodes.find((n) => n.name === nombre)
      const malla = glb.meshes?.[nodo?.mesh ?? -1]
      const accessor = glb.accessors?.[malla?.primitives[0]?.attributes.POSITION ?? -1]
      return { min: accessor?.min ?? [], max: accessor?.max ?? [] }
    }

    /** Simétrica respecto a X=0: su espejo cae sobre ella misma. */
    const cruzaElEje = (nombre: string) => {
      const { min, max } = caja(nombre)
      const [minX, maxX] = [min[0] ?? 0, max[0] ?? 0]
      return Math.abs(minX + maxX) < (maxX - minX) * 0.15
    }

    it('agrupa bajo un nombre que sobrevive al saneado del cargador', () => {
      // b2.1: el cargador pasa los nombres por `sanitizeNodeName`. La escena
      // busca este grupo por nombre, así que el nombre tiene que llegar igual.
      expect(PropertyBinding.sanitizeNodeName(MIDLINE_GROUP)).toBe(MIDLINE_GROUP)
    })

    it('mete en ese grupo mallas de verdad, para no pasar por vacuidad', () => {
      expect(mallasDe(MIDLINE_GROUP).length).toBeGreaterThan(0)
    })

    it('no deja fuera del grupo ninguna malla que cruce el eje del espejo', () => {
      const enElGrupo = new Set(mallasDe(MIDLINE_GROUP))
      const fuera = glb.nodes
        .filter((n) => n.mesh !== undefined && n.name && !enElGrupo.has(n.name))
        .map((n) => n.name as string)
        .filter(cruzaElEje)
      expect(fuera, 'mallas espejables que en realidad cruzan el eje').toEqual([])
    })

    it('no mete en el grupo ninguna malla lateral sin contraparte propia', () => {
      // Una malla lateral solo pertenece aquí si el modelo ya trae su lado
      // contrario — el caso de los parietales.
      const nombres = glb.nodes.filter((n) => n.mesh !== undefined).map((n) => n.name as string)
      const espejoDe = (n: string) => {
        const { min, max } = caja(n)
        return { min: [-(max[0] ?? 0), min[1], min[2]], max: [-(min[0] ?? 0), max[1], max[2]] }
      }
      const TOLERANCIA = 0.002 // 2 mm en un modelo de 1,7 m
      const sinContraparte = mallasDe(MIDLINE_GROUP)
        .filter((n) => !cruzaElEje(n))
        .filter((n) => {
          const buscado = espejoDe(n)
          return !nombres.some((otra) => {
            const c = caja(otra)
            return (
              c.min.every((v, i) => Math.abs(v - (buscado.min[i] ?? 0)) < TOLERANCIA) &&
              c.max.every((v, i) => Math.abs(v - (buscado.max[i] ?? 0)) < TOLERANCIA)
            )
          })
        })
      expect(sinContraparte, 'mallas laterales que el espejo sí necesitaba').toEqual([])
    })
  })
})
