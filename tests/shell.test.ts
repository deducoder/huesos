import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * El marco de la aplicación, comprobado sobre su fuente.
 *
 * `100vh` cuenta la barra de URL en iOS y Android, así que el pie de la
 * aplicación queda cortado por debajo del borde visible. **La suite de
 * navegador no puede ver este defecto**: el viewport de Playwright no simula
 * una barra de URL que aparece y desaparece al desplazar. De ahí que se
 * verifique leyendo el fuente, el mismo camino que `SkeletonScene.test.tsx`
 * toma para lo que el runtime no expone.
 */
describe('el shell de la aplicación', () => {
  const fuente = readFileSync(resolve('src/App.tsx'), 'utf8')

  it('se lee de verdad — si no, lo de abajo pasaría por ausencia', () => {
    expect(fuente.length, 'src/App.tsx está vacío o no se leyó').toBeGreaterThan(500)
    expect(fuente).toMatch(/<main/)
  })

  it('calcula el alto con la unidad dinámica, no con 100vh', () => {
    expect(fuente, 'h-screen es 100vh: cuenta la barra de URL del móvil').not.toMatch(/h-screen/)
    expect(fuente).toMatch(/h-dvh/)
  })
})
