# Story e7.10: Medir `should-perf-007` — Plan

Tamaño: S (2 tareas). Una mide, la otra corrige el texto del guardrail para
que deje de contradecir ADR-001.

## Task 1 — Medir la latencia de selección con CPU throttling (riesgo más alto)

**Por qué primero:** es la única tarea con incertidumbre real — no hay
precedente de CDP en este proyecto, y el resultado numérico decide si queda
algo más para aparcar.

- **Archivos:** `e2e/perf-selection.spec.ts` (nuevo).
- **RED:** el archivo no existe; correrlo falla porque no hay nada que
  correr. (Esta tarea no tiene un defecto de aplicación que reproducir —
  mide infraestructura, no corrige comportamiento — así que el ciclo es
  "escribir el harness, confirmar que corre y produce datos válidos", no
  RED-GREEN sobre una regla de negocio.)
- **GREEN:** implementar la medición del `design.md` (CDP 4x, 390×844, 20
  muestras vía el navegador de huesos, mediana y máximo). El test pasa si
  produce 20 números positivos y el `console.log`/reporte dejan mediana y
  máximo legibles — **no** si la mediana da <100ms; ese número se
  interpreta después, no se hardcodea como assert de aprobar/reprobar.
- **Verificación:** `npx playwright test e2e/perf-selection.spec.ts`, leer
  la salida, copiar mediana y máximo a `progress.md` con el veredicto
  (cumple / no cumple + destino si no cumple).
- **Commit:** `test(perf): measure selection latency under cpu throttling`

## Task 2 — Corregir `should-perf-007` para que refleje ADR-001

- **Archivos:** `governance/guardrails.md`.
- **Cambio:** reemplazar "y el SVG se sirve por debajo de 500 KB" por una
  referencia al activo real que ADR-001 aceptó (el modelo glTF, con su
  peso medido) — sin reabrir esa decisión, solo corrigiendo que el texto
  del guardrail hable del activo que el proyecto de verdad usa.
- **Verificación:** `./scripts/check` (no hay test que lea este archivo,
  pero el gate completo confirma que nada más se rompió).
- **Commit:** `docs(governance): correct should-perf-007 to match ADR-001's accepted asset`

## Manual integration test (final)

No aplica una pasada nueva en dispositivo — esta historia no cambia
comportamiento visible de la aplicación, solo mide y corrige documentación.
La pasada de integración en dispositivo ya se hizo antes de arrancar e7.10.

## Risks

- El resultado de la Task 1 podría no cumplir <100ms bajo CPU 4x — es la
  salida esperada tan válida como cumplirlo; el plan no asume el resultado
  de antemano. Si no cumple, se aparca con la cifra real, no se retoca el
  umbral para que cumpla.
- CDP (`Emulation.setCPUThrottlingRate`) es solo-Chromium — el único
  proyecto configurado en `playwright.config.ts`, así que no hay
  incompatibilidad que resolver.
