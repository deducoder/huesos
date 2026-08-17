# Story e5.3: Test engine records its verdict — Plan

> Size: M

## Tasks

### T1 · La instancia compartida del almacén

- **Files:** modify `src/storage/progress-store.ts`, su test
- **TDD:** RED — un test que afirme que `progressStore` es siempre la misma
  instancia y que expone `read`/`write` → GREEN — `export const progressStore =
  createProgressStore()` → REFACTOR.
- **Satisfies:** "La aplicación crea el almacén una sola vez, no uno por
  render" y el contrato que e5.2 dejó en su retrospectiva.
- **Verify:** `npx vitest run src/storage/` · `./scripts/check`
- **Commit:** `feat(storage): expose the one shared progress store`

### T2 · `TestQuestion` registra el veredicto

- **Files:** modify `src/features/test/TestQuestion.tsx`, `TestQuestion.test.tsx`
- **TDD:** RED — con un almacén doble, responder mal debe dejar un fallo para el
  hueso preguntado, y responder bien un acierto; y responder sobre un hueso con
  historial debe acumular → GREEN — leer el registro del almacén y escribir con
  `recordAnswer` dentro de `responder` → REFACTOR.
- **Satisfies:** los tres primeros escenarios del scope, más el delta del diseño
  (no registrar dos veces la misma pregunta).
- **Verify:** `npx vitest run src/features/test/` · `./scripts/check`
- **Commit:** `feat(test): record each answer's verdict in the progress store`

### T3 · Ambas variantes al mismo registro

- **Files:** modify `SkeletonTestView.tsx`, `BoneTestView.tsx` y sus tests
- **TDD:** RED — las dos vistas deben pasar el almacén compartido a
  `TestQuestion`; hoy ni siquiera compila porque la prop es requerida → GREEN —
  pasar `progressStore` como ya pasan `catalog` → REFACTOR.
- **Satisfies:** "ambas alimentan el mismo registro".
- **Verify:** `npx vitest run src/features/test/ src/App.test.tsx` ·
  `./scripts/check`
- **Commit:** `feat(test): feed one progress record from both test variants`

### T4 · Prueba de integración manual — responder y recargar

El observable de `RF-09` al pie de la letra, y el hito del esqueleto andante:

- Con la aplicación construida y servida, en Chromium: entrar al modo test,
  responder una pregunta, **recargar**, y comprobar que el registro de ese hueso
  conserva el resultado.
- Comprobar que no aparece nada del progreso en pantalla.
- Comprobar que responder en la otra variante suma al mismo registro.
- **Verify:** `localStorage['huesos-mono:progress']` contiene el veredicto tras
  la recarga; la interfaz no muestra contadores.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. Estrictamente dependiente: T2 necesita
  la instancia, T3 necesita la prop, T4 necesita todo.
- **Riesgo revisado:** el `plan.md` de la épica anticipaba que la plomería del
  estado sería el trabajo real de esta historia. **El gemba lo desmintió**: como
  el progreso no se renderiza, no hay estado que levantar. Lo que quedaba de
  riesgo se disolvió al leer el código, que es exactamente para lo que sirve
  leerlo antes.
- **Riesgo que sí queda:** las pruebas de `App` renderizan la aplicación entera y
  usarán la instancia compartida real, que en jsdom escribe en su
  `localStorage`. Si dos pruebas del mismo archivo se pisan, el fallo será
  dependiente del orden. → T3 lo comprueba explícitamente en vez de esperar a
  que aparezca.
