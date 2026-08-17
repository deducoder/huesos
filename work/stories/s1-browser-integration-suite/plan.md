# Story s1: Browser integration suite — Plan

> Size: M

### T1 · Configuración de Playwright

- **Files:** create `playwright.config.ts`
- **TDD:** sin ciclo — es configuración; su corrección se demuestra al correr T2.
- **Verify:** `npx playwright test --list` enumera las pruebas.
- **Commit:** `build(e2e): configure playwright against the production build`

### T2 · Las cinco comprobaciones

- **Files:** create `e2e/explore.spec.ts`
- **TDD:** RED — deben fallar si se revierte cualquiera de los dos arreglos →
  GREEN con el código actual.
- **Verify:** `npx playwright test`
- **Commit:** `test(e2e): check the skeleton is loadable, selectable and private`

### T3 · El punto de entrada de gates

- **Files:** create `scripts/check-integration`, modify `README.md`,
  `package.json`
- **Verify:** `./scripts/check-integration` termina en 0 con el código actual.
- **Commit:** `build(gates): add the integration entry point`

### T4 · Demostrar que atrapa los bugs que motivaron la suite

- Reintroducir b2.1 (comparar sin sanear) y b2.2 (cámara fija mirando al origen),
  comprobar que la suite se pone roja, y revertir.
- **Verify:** rojo con el bug, verde sin él. Es la única prueba de que la suite
  sirve para algo.

## Order & risks

- **Execution order:** configuración, pruebas, punto de entrada, y la
  demostración al final porque necesita la suite completa.
- **Risks:** *una suite de navegador es lenta y frágil* → una sola familia de
  navegador, esperas por estado y no por tiempo donde se pueda, y umbrales
  holgados en las mediciones.
