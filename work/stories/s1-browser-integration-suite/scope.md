# Story s1: Browser integration suite — Scope

## User story

As a developer of huesos-mono,
I want a suite that runs the application in a real browser and checks the
skeleton is usable,
so that the class of defect that produced b2.1 and b2.2 — invisible to every
unit test — fails the gate instead of reaching whoever opens the app.

## Acceptance criteria

```gherkin
Given la aplicación construida
When se ejecuta la suite de integración
Then abre el build de producción en un navegador real

Given el esqueleto cargado
When se pulsa una rejilla de puntos sobre el lienzo
Then se alcanzan decenas de huesos distintos, no dos

Given un hueso par seleccionado desde la lista
When se comparan las capturas
Then el resaltado ocurre en un solo lado, y en el anatómicamente correcto

Given la aplicación en ejecución
When se observa el tráfico de red
Then no hay ninguna petición a un tercero

Given cualquiera de las comprobaciones anteriores
When falla
Then `./scripts/check-integration` termina con código distinto de cero
```

## In scope

- Playwright con Chromium sobre el build de producción.
- Las cinco comprobaciones: carga, alcance de selección, resaltado por lado,
  ausencia de red externa, ausencia de errores de consola.
- `./scripts/check-integration`, el segundo punto de entrada que la convención de
  gates contempla y que este proyecto no tenía.

## Out of scope

- **Firefox y WebKit** — están descargados, pero una sola familia de navegador
  basta para atrapar esta clase de defecto. Se amplía si aparece un fallo
  específico de motor.
- **Pruebas visuales por comparación de imagen de referencia** — frágiles ante
  cualquier cambio de iluminación; aquí se mide *cuánto cambia* entre estados,
  no cómo se ve exactamente.
- **Meterlo en `./scripts/check`** — tarda demasiado; la convención dice que las
  suites lentas van al punto de entrada de push.

## Done when

- `./scripts/check-integration` existe, es ejecutable, arranca el navegador y
  pasa.
- La suite detecta b2.1 y b2.2 si se reintroducen.
- El README documenta el segundo punto de entrada.
