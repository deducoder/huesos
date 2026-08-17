import { chromium } from '@playwright/test'

const errores = []
const peticiones = []
const navegador = await chromium.launch()
const pagina = await navegador.newPage({ viewport: { width: 1400, height: 900 } })
pagina.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()) })
pagina.on('pageerror', (e) => errores.push(String(e)))
pagina.on('request', (r) => { const u = new URL(r.url()); if (u.host !== 'localhost:4173') peticiones.push(r.url()) })

await pagina.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await pagina.waitForTimeout(4000)

const canvas = await pagina.locator('canvas').first()
const caja = await canvas.boundingBox()
console.log('canvas:', caja ? `${Math.round(caja.width)}x${Math.round(caja.height)}` : 'NO ENCONTRADO')

// ¿hay geometría cargada? se mira el propio WebGL a través de la escena de R3F
const infoEscena = await pagina.evaluate(() => {
  const lienzo = document.querySelector('canvas')
  const gl = lienzo?.getContext('webgl2') || lienzo?.getContext('webgl')
  return { webgl: !!gl, ancho: lienzo?.width ?? 0, alto: lienzo?.height ?? 0 }
})
console.log('webgl:', infoEscena)

// Rejilla de clics sobre el canvas: ¿cuántos huesos distintos se pueden elegir?
const elegidos = new Set()
const pasos = 12
for (let fila = 1; fila < pasos; fila++) {
  for (let col = 1; col < pasos; col++) {
    const x = caja.x + (caja.width * col) / pasos
    const y = caja.y + (caja.height * fila) / pasos
    await pagina.mouse.click(x, y)
    const activo = await pagina.evaluate(() => {
      const b = document.querySelector('button[aria-pressed="true"]')
      return b ? b.textContent?.replace(/^▸\s*/, '').trim() : null
    })
    if (activo) elegidos.add(activo)
  }
}
console.log(`\nhuesos distintos seleccionables con una rejilla de ${pasos - 1}x${pasos - 1} clics: ${elegidos.size}`)
console.log('  ' + [...elegidos].slice(0, 25).join(' · '))
console.log('\nerrores de consola:', errores.length ? errores.slice(0, 3) : 'ninguno')
console.log('peticiones a terceros:', peticiones.length ? peticiones : 'ninguna')

await pagina.screenshot({ path: process.argv[2] ?? 'captura.png' })
await navegador.close()
