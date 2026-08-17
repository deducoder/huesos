# Story e5.3: Test engine records its verdict — Progress

## T1 · La instancia compartida del almacén

`progressStore`, una sola instancia creada a nivel de módulo, con el comentario
que explica por qué no es una comodidad: la degradación a memoria de e5.2 es
estado de instancia, y un almacén por render la anularía justo cuando hace
falta.

RED: el test falló por `progressStore` inexistente.
Gate: `./scripts/check` verde — 167 tests. Desviación: ninguna.

## T2 + T3 · El registro del veredicto, desde las dos variantes

**Desviación: T2 y T3 se commitearon juntas, porque son un solo cambio.**
Hacer `store` una prop **requerida** de `TestQuestion` rompe en el mismo
instante a `SkeletonTestView` y `BoneTestView`, que son T3. El gate lo dijo con
dos `TS2741` en cuanto se terminó T2. Commitear T2 sola habría exigido dejar el
gate en rojo, que es justo lo que esta misma historia acaba de aprender a no
hacer — así que se fundieron.

Es la **segunda vez en esta épica** que un corte del plan resulta inseparable
(la primera fue T1/T2 de e5.2). Ver la retrospectiva.

Lo que landó:

- `TestQuestion` recibe `store: ProgressStore` y, al responder, escribe
  `recordAnswer(store.read(), bone.id, acerto)` — leyendo el registro actual
  antes de anotar, porque acumular es el punto.
- Las dos vistas pasan `progressStore`, igual que ya pasaban `catalog`. Ambas
  variantes alimentan el mismo registro por construcción, sin código que las
  coordine: montan el mismo `TestQuestion`.
- Cinco tests nuevos con un almacén doble —acierto, fallo, acumulación sobre lo
  guardado, exactamente una escritura por respuesta, y que nada del progreso
  llegue a la pantalla— sin tocar el `localStorage` de jsdom.

RED: 4 tests fallando antes del cambio; después, dos `TS2741` de las vistas.
Gate: `./scripts/check` verde — 172 tests.

## T4 · Prueba de integración manual — responder y recargar

En Chromium, contra el build servido. **El hito del esqueleto andante de la
épica**, y el observable de `RF-09` al pie de la letra:

```
registro antes de responder : null
registro tras responder mal : {"metacarpal-2-left":{"correct":0,"incorrect":1}}
registro TRAS RECARGAR      : {"metacarpal-2-left":{"correct":0,"incorrect":1}}
¿sobrevivió?                : SÍ
registro final (ambas variantes): 2 huesos —
  {"metacarpal-2-left":{...},"lumbar-3":{"correct":0,"incorrect":1}}
```

- **Sobrevive a la recarga.** El camino completo —responder → registrar →
  serializar → `localStorage` → recargar → releer— existe de punta a punta por
  primera vez.
- **Las dos variantes alimentan el mismo registro**: el primer hueso se
  respondió en "Hueso aislado" (`RF-05`) y el segundo en "Esqueleto completo"
  (`RF-04`), y los dos están en el mismo objeto.
- **Nada del progreso llega a la pantalla.** La sonda marcó un positivo que
  resultó ser suyo: su propio regex casaba "Incorrect" dentro de "Incorrecto".
  Se comprobó imprimiendo el texto completo de la pantalla — no aparece **ni un
  solo número**.

## Finalize

- Full gate set: `./scripts/check` verde — **172 tests** (166 al empezar la
  historia, 6 nuevos).
- Orphaned-test check: limpio, y **verificado en vez de supuesto**. Los tres
  archivos de test que importan lo que esta historia cambió
  (`BoneTestView.test.tsx`, `SkeletonTestView.test.tsx`,
  `progress-store.test.ts`) siguen en verde sin tocarlos. El riesgo que el plan
  anticipaba —que usaran la instancia compartida real y se pisaran en el
  `localStorage` de jsdom— **no se materializó**: ninguno responde una pregunta,
  así que ninguno escribe. Tres corridas completas seguidas dieron 172/172,
  descartando dependencia del orden.
- Acceptance criteria: los seis escenarios del `scope.md` y el delta del
  `design.md`, cumplidos. Los cinco `Done when` cumplidos, incluido el que
  exigía navegador real.
