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
