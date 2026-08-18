import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * `--color-acierto` y `--color-error` (e9.1): el resultado del test que e9.2
 * va a pintar. `must-a11y-005` exige 4.5:1 para texto normal, y los demás
 * tokens de `@theme` ya anotan su ratio en un comentario — pero un comentario
 * es una afirmación sin instrumento. Esta prueba calcula el contraste de
 * verdad contra el texto blanco que ambos llevan encima (`text-panel`), para
 * que cambiar el valor sin recalcular no pueda colarse en silencio.
 */

const CSS = readFileSync(resolve('src/index.css'), 'utf8')

function tokenHex(nombre: string): string {
  const m = CSS.match(new RegExp(`--color-${nombre}:\\s*(#[0-9a-fA-F]{6})`))
  if (!m?.[1]) throw new Error(`token --color-${nombre} no encontrado en index.css`)
  return m[1]
}

/** Contraste WCAG 2.1 entre dos colores hex. */
function contraste(hexA: string, hexB: string): number {
  const luminancia = (hex: string) => {
    const canal = (posicion: number) => {
      const c = Number.parseInt(hex.slice(posicion, posicion + 2), 16) / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * canal(1) + 0.7152 * canal(3) + 0.0722 * canal(5)
  }
  const [la, lb] = [luminancia(hexA), luminancia(hexB)]
  const alta = Math.max(la, lb)
  const baja = Math.min(la, lb)
  return (alta + 0.05) / (baja + 0.05)
}

describe('el contraste del resultado del test (e9.1)', () => {
  it('acierto y error cumplen 4.5:1 con el texto blanco que llevan encima', () => {
    const blanco = tokenHex('panel')
    expect(
      contraste(tokenHex('acierto'), blanco),
      '--color-acierto vs --color-panel',
    ).toBeGreaterThanOrEqual(4.5)
    expect(
      contraste(tokenHex('error'), blanco),
      '--color-error vs --color-panel',
    ).toBeGreaterThanOrEqual(4.5)
  })

  it('el cálculo distingue un contraste insuficiente, no solo el declarado', () => {
    // El caso feliz de arriba es "cumple": un cálculo roto que siempre
    // devolviera un número alto pasaría igual. Un rojo claro conocido, que
    // no cumple, prueba que la función mide de verdad.
    expect(contraste('#ef4444', '#ffffff')).toBeLessThan(4.5)
  })
})
