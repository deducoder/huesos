# Story e1.3: Model inventory — Plan

> Size: M

## Tasks

### T1 · Clasificador de nombres de malla

- **Files:** create `scripts/inventory.mjs`, `scripts/inventory.d.mts`,
  `tests/inventory.test.ts`
- **TDD:** RED — casos concretos de hueso, diente, cartílago y sesamoideo, más
  la separación de lateralidad → GREEN — el clasificador → REFACTOR — unificar
  los patrones si se repiten.
- **Satisfies:** escenarios 1 a 3.
- **Verify:** `npx vitest run tests/inventory.test.ts`, luego `./scripts/check`.
- **Commit:** `feat(tools): classify model mesh names by kind and side`

### T2 · Recuento contra el modelo real

- **Files:** modify `tests/inventory.test.ts`
- **TDD:** RED — el recuento óseo del modelo real debe dar 118 → GREEN — ajustar
  el clasificador si discrepa.
- **Satisfies:** escenario 4.
- **Verify:** `./scripts/check`.
- **Commit:** `test(tools): pin the model bone count to 118`

### T3 · Ejecutable de inventario

- **Files:** create `scripts/inventory-model.mjs`
- **TDD:** sin ciclo propio — es la carcasa de línea de órdenes sobre lógica ya
  probada; fabricar un test de su salida por consola mediría el formato, no el
  comportamiento.
- **Verify:** ejecutarlo y comparar los totales con los del test.
- **Commit:** `feat(tools): add rerunnable model inventory`

### T4 · Manual integration test

- Ejecutar el inventario y comprobar a mano que una región conocida —las 12
  costillas— aparece completa y bien clasificada.
- **Verify:** las 12 costillas salen como hueso, lado derecho, y los 10
  cartílagos costales salen como cartílago.

## Order & risks

- **Execution order:** T1 y T2 primero —la lógica y su calibración contra el
  modelo real—, T3 después como envoltorio.
- **Risks:** *el clasificador puede acertar en los casos elegidos y fallar en el
  conjunto* → por eso T2 fija el total contra el modelo entero, no contra una
  muestra.
