import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * s2: el vocabulario mínimo de motion vive en `@theme`, mismo mecanismo que
 * ya gobierna color y radio (ADR-007) — ningún componente inventa su propia
 * duración o curva. La regla de `prefers-reduced-motion` es global y a
 * cero, no "más suave": más simple de afirmar con un solo test.
 */

function contenidoDeIndexCss(): string {
  return readFileSync(resolve('src/index.css'), 'utf8')
}

describe('s2: tokens de motion', () => {
  it.each(['--duration-rapida', '--duration-base', '--duration-panel', '--ease-salida'])(
    'declara el token %s en @theme',
    (token) => {
      expect(contenidoDeIndexCss()).toContain(token)
    },
  )

  it('desactiva las transiciones y animaciones bajo prefers-reduced-motion', () => {
    const css = contenidoDeIndexCss()
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/)
    expect(css).toMatch(/transition-duration:\s*0\.01ms\s*!important/)
    expect(css).toMatch(/animation-duration:\s*0\.01ms\s*!important/)
  })
})
