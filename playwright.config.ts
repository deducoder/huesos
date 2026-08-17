import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

/**
 * Algunos entornos de ejecución traen Chromium preinstalado en una ruta fija
 * en vez de la que gestiona Playwright — con una versión de navegador que no
 * siempre coincide con la que este proyecto fija. Se usa solo si existe; en
 * cualquier otra máquina, Playwright resuelve el binario que instaló.
 */
const CHROMIUM_PREINSTALADO = '/opt/pw-browsers/chromium'
const executablePath = existsSync(CHROMIUM_PREINSTALADO) ? CHROMIUM_PREINSTALADO : undefined

/**
 * Suite de integración: la aplicación de verdad, en un navegador de verdad.
 *
 * Existe por b2.1 y b2.2, dos defectos que dejaban la escena inservible y que
 * **ninguna prueba unitaria podía ver**: una comparaba nombres que el cargador
 * transforma, la otra encuadraba la cámara fuera del modelo. Las dos eran
 * evidentes al abrir la aplicación.
 *
 * Corre contra el build de producción, no contra el servidor de desarrollo: es
 * lo que llega al usuario.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 1400, height: 900 },
    // Sin trace: registrar una instantánea del DOM tras cada acción es carísimo
    // bajo renderizado por software (~2s por acción), y Playwright no permite
    // desactivarlo prueba por prueba sin forzar un worker nuevo por prueba. La
    // rejilla de 121 clics —la única que lo necesitaba— corre en <1s sin trace.
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } },
    },
  ],
  webServer: {
    // `vite build` a secas: la comprobación de tipos ya la hace ./scripts/check
    command: 'npx vite build && npx vite preview --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
