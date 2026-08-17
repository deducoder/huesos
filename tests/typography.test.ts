import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { catalog } from '../src/data/catalog'

/**
 * La familia display se sirve del propio origen (`must-privacy-006`) y tiene
 * que cubrir todo lo que la aplicación puede escribir en un título.
 *
 * Lo que un navegador comprobaría —que el glifo se dibuja— no cabe en jsdom, así
 * que acá se verifica lo que sí es observable sin él: que el archivo existe,
 * que está dentro del presupuesto, y que ningún carácter del catálogo cae fuera
 * del `unicode-range` que el `@font-face` declara.
 */

const FUENTE = resolve('public/fonts/fredoka-latin-600.woff2')
const CSS = resolve('src/index.css')

/** El presupuesto declarado en el diseño de e7.3, en bytes. */
const PRESUPUESTO = 25 * 1024

/**
 * El subset `latin`, tal como lo declara el `@font-face`. Se escribe acá y no
 * se lee del CSS a propósito: si alguien recorta el rango del archivo sin
 * pensarlo, esta prueba es la que tiene que discrepar.
 */
const RANGO_LATIN: ReadonlyArray<readonly [number, number]> = [
  [0x0000, 0x00ff],
  [0x0131, 0x0131],
  [0x0152, 0x0153],
  [0x02bb, 0x02bc],
  [0x02c6, 0x02c6],
  [0x02da, 0x02da],
  [0x02dc, 0x02dc],
  [0x0304, 0x0304],
  [0x0308, 0x0308],
  [0x0329, 0x0329],
  [0x2000, 0x206f],
  [0x2074, 0x2074],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2191, 0x2191],
  [0x2193, 0x2193],
  [0x2212, 0x2212],
  [0x2215, 0x2215],
  [0xfeff, 0xfeff],
  [0xfffd, 0xfffd],
]

const cubierto = (caracter: string) => {
  const punto = caracter.codePointAt(0) ?? 0
  return RANGO_LATIN.some(([desde, hasta]) => punto >= desde && punto <= hasta)
}

/** Todo lo que el catálogo puede poner en un título. */
const textoDelCatalogo = () =>
  catalog.flatMap((hueso) => [hueso.es, hueso.la, ...hueso.synonyms]).join('')

describe('la tipografía empaquetada', () => {
  it('se sirve desde el propio repositorio, con su licencia', () => {
    expect(existsSync(FUENTE), 'falta public/fonts/fredoka-latin-600.woff2').toBe(true)
    expect(existsSync(resolve('public/fonts/OFL.txt')), 'falta la licencia').toBe(true)
  })

  it('está dentro del presupuesto declarado', () => {
    expect(statSync(FUENTE).size).toBeLessThanOrEqual(PRESUPUESTO)
  })

  it('se declara sin salir a ningún tercero', () => {
    const css = readFileSync(CSS, 'utf8')
    expect(css).toMatch(/@font-face/)
    expect(css, 'la fuente no puede venir de un CDN').not.toMatch(/https?:\/\//)
  })

  it('cubre todo lo que el catálogo puede mostrar', () => {
    const sinGlifo = [...new Set(textoDelCatalogo())].filter((c) => !cubierto(c))
    expect(sinGlifo, 'caracteres del catálogo fuera del subset servido').toEqual([])
  })

  it('el instrumento mira de verdad', () => {
    // El caso feliz de la prueba anterior es una lista vacía: si el catálogo
    // llegara vacío o el filtro aceptara cualquier cosa, pasaría sin haber
    // mirado nada.
    expect(catalog.length).toBe(206)
    expect(textoDelCatalogo().length).toBeGreaterThan(1000)
    expect(cubierto('á')).toBe(true)
    expect(cubierto('—')).toBe(true)
    expect(cubierto('ș'), 'un carácter fuera del subset debe detectarse').toBe(false)
    expect(cubierto('▸'), 'el triángulo del navegador no está en latin').toBe(false)
  })
})
