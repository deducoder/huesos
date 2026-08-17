import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { fuentesDeLaAplicacion } from './sources'

/**
 * ADR-007: los tokens de `@theme` son la única fuente del aspecto, y **ningún
 * componente vuelve a escribir un color a mano**.
 *
 * Sin esta prueba, el contrato sería una intención: E7 lo declara en una épica
 * y nada impediría que la historia siguiente colara un `bg-slate-800` de vuelta.
 * Lo que se vigila es la paleta **de fábrica** de Tailwind — los nombres
 * propios del proyecto están en español justamente para que la frontera sea
 * legible de un vistazo.
 */

/** Las utilidades de Tailwind que llevan color, aplicadas a su paleta de fábrica. */
const PROPIEDADES = [
  'bg',
  'text',
  'border',
  'outline',
  'ring',
  'fill',
  'stroke',
  'from',
  'via',
  'to',
  'decoration',
  'shadow',
  'accent',
  'caret',
  'divide',
  'placeholder',
].join('|')

const PALETA_DE_FABRICA = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
].join('|')

/**
 * `bg-sky-700`, `hover:bg-slate-800`, `focus-visible:outline-sky-400` — y
 * también `text-white`, que no pertenece a ninguna familia numerada pero es
 * igual de literal.
 */
const COLOR_A_MANO = new RegExp(
  `\\b(?:${PROPIEDADES})-(?:${PALETA_DE_FABRICA})-\\d{2,3}\\b|\\b(?:bg|text|border|outline|ring|divide|placeholder)-(?:white|black)\\b`,
  'g',
)

describe('ADR-007: el aspecto sale de los tokens', () => {
  it('ningún componente escribe un color a mano', () => {
    const infractores = fuentesDeLaAplicacion().flatMap((ruta) =>
      readFileSync(ruta, 'utf8')
        .split('\n')
        .flatMap((linea, indice) =>
          (linea.match(COLOR_A_MANO) ?? []).map(
            (utilidad) => `${ruta.replace(`${resolve('.')}/`, '')}:${indice + 1} ${utilidad}`,
          ),
        ),
    )

    expect(infractores, 'colores literales fuera de @theme').toEqual([])
  })

  it('el instrumento mira de verdad', () => {
    // El caso feliz de la prueba anterior es una lista vacía, así que un
    // recorrido roto o un patrón que no reconoce nada daría verde sin haber
    // buscado. Estas dos aserciones son la comprobación de que sí buscó.
    const fuentes = fuentesDeLaAplicacion()
    expect(fuentes.length).toBeGreaterThan(15)
    expect(fuentes.some((ruta) => ruta.endsWith('App.tsx'))).toBe(true)

    // `match`, no `test`: el patrón lleva la bandera `g`, y `test` avanza
    // `lastIndex` entre llamadas — la segunda comprobación daba `false` sobre
    // un texto que sí contiene un color. Lo encontró esta misma prueba.
    const reconoce = (texto: string) => texto.match(COLOR_A_MANO) !== null
    expect(reconoce('className="bg-sky-700"')).toBe(true)
    expect(reconoce('className="hover:bg-slate-800"')).toBe(true)
    expect(reconoce('className="focus-visible:outline-sky-400"')).toBe(true)
    expect(reconoce('className="text-white"')).toBe(true)

    expect(reconoce('className="bg-superficie text-tinta"')).toBe(false)
    expect(reconoce('className="border-tinta border-b-2"')).toBe(false)
    expect(reconoce('className="min-h-tactil rounded-suave shadow-dura"')).toBe(false)
  })
})
