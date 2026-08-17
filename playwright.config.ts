import { defineConfig, devices } from '@playwright/test'

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
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
