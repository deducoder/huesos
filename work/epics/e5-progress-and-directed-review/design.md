# Epic e5: Progreso y repaso dirigido — Design

## Gemba findings

Lo que ya existe y esta épica toca. Todo leído, no recordado.

- **`src/domain/quiz.ts` · `pickTestableBone(bones, excluirId)`** — el **único**
  punto donde se elige una pregunta. Función pura, filtra por `meshName !== null`
  (un hueso ausente no puede resaltarse, así que no puede preguntarse), excluye
  el inmediato anterior, y sortea con `Math.random` en una sola línea. Su propio
  comentario dice: *"no prioriza huesos fallados: eso es `RF-09`/E5, fuera de
  esta historia"*. → **extender**, nunca reemplazar: el filtro por geometría, la
  exclusión del anterior y el caso degenerado ya están probados.
- **`src/features/test/TestQuestion.tsx`** — el **único** punto donde nace un
  veredicto: `responder()` llama a `isCorrectAnswer` y fija `resultado`.
  `SkeletonTestView` (`RF-04`) y `BoneTestView` (`RF-05`) montan este mismo
  componente y solo se diferencian en la escena que le pasan. → **un solo sitio
  que instrumentar**, no dos; registrar aquí cubre ambas variantes por
  construcción.
- **No existe ninguna capa de almacenamiento.** `grep` de `localStorage`,
  `sessionStorage` e `indexedDB` sobre `src/` y `tests/` no devuelve nada. → esta
  épica la crea, y con ella el precedente. De ahí ADR-004.
- **`src/App.tsx` ya resuelve la propiedad del estado por supervivencia**, no por
  prolijidad: `selected` vive en `App` y no en `ExploreView` con un comentario
  que lo dice explícitamente ("al volver de la ficha completa tiene que
  sobrevivir"). → **seguir ese patrón** en e5.3, con el matiz de que aquí la
  persistencia es en sí misma un almacén compartido, así que puede no hacer
  falta levantar nada.
- **`src/domain/*` es puro por convención declarada** — `bone.ts` abre diciendo
  "este módulo no conoce React, ni el DOM, ni el almacenamiento". → el registro y
  la ponderación van a dominio; `localStorage` **no** entra ahí.
- **`must-privacy-006` declara una comprobación que no existe.** El guardrail
  dice "test que falla ante cualquier `fetch`/`XMLHttpRequest`"; lo que hay es
  una comprobación puntual en `SkeletonScene.test.tsx` y la prueba de navegador
  de s1. → e5.5 escribe la que el guardrail dice, y la de navegador queda como
  segunda red.
- **`isCorrectAnswer` (`src/domain/answer-check.ts`) es de E4 y está cerrado.**
  E5 registra su veredicto; no lo reinterpreta (no-go del brief).

## Target components

| Component | Change | Purpose |
|-----------|--------|---------|
| `src/domain/progress.ts` | create | El registro por hueso y las funciones puras que lo leen y lo actualizan |
| `src/domain/quiz.ts` | modify | `pickTestableBone` acepta el registro y un sorteo inyectado; pondera por fallos |
| `src/storage/progress-store.ts` | create | Adaptador de `localStorage` tras una interfaz mínima, con degradación a memoria |
| `src/features/test/TestQuestion.tsx` | modify | Registrar el veredicto de cada respuesta y alimentar la selección siguiente |
| `src/App.tsx` | modify (si e5.3 lo decide) | Propiedad del registro, si resulta que tiene que vivir por encima de las vistas de test |
| `tests/` | create | La comprobación de `must-privacy-006` que el guardrail declara |

## Key contracts

- **El dominio no conoce el almacenamiento.** `progress.ts` y `quiz.ts` no
  importan nada de `src/storage/` ni tocan `window`. La dirección de la
  dependencia es almacenamiento → dominio, nunca al revés.
- **El registro es un dato plano y serializable**: por `id` de hueso, dos
  contadores no negativos. Nada de clases, fechas ni funciones — tiene que
  sobrevivir a `JSON.stringify`/`parse` sin pérdida.
- **Un `id` ausente del registro significa "nunca preguntado"**, no cero
  explícito. Leer un hueso desconocido devuelve el estado inicial, no `undefined`
  ni una excepción.
- **La aleatoriedad de `pickTestableBone` se inyecta**, no se llama por dentro.
  Sin eso la ponderación no se puede afirmar de forma determinista, solo intuir.
- **Todo hueso preguntable sigue siendo alcanzable**: la ponderación cambia
  frecuencias, nunca reduce el conjunto de candidatos (ADR-005; es lo que
  distingue la opción elegida de una cola estricta).
- **Sólo se preguntan huesos con `meshName !== null`.** Invariante existente de
  `pickTestableBone`; la ponderación no la puede aflojar.
- **El registro nunca sale del navegador.** `must-privacy-006`, y es la razón de
  que e5.5 esté en el alcance de esta épica y no de otra.
- **Un fallo de almacenamiento degrada, no propaga.** El adaptador absorbe el
  error y sigue en memoria; ni el dominio ni los componentes conocen esa
  posibilidad.

## Decisions (ADRs)

- **ADR-004**: localStorage síncrono para el progreso, con degradación a memoria
  — 206 pares de enteros no justifican la asincronía de `IndexedDB`, y el
  proyecto no tiene a dónde enviar nada por `must-privacy-006`.
  `records/decisions/adr-004-progress-storage.md`
- **ADR-005**: Selección ponderada por fallos, no cola estricta ni repetición
  espaciada — "preguntar esos primero" como sesgo estadístico mantiene el
  catálogo entero alcanzable, y sin componente temporal no entra el reloj.
  `records/decisions/adr-005-failed-first-selection.md`

## Legacy sweep

Nada queda huérfano. La épica es aditiva sobre dos puntos de extensión que E4
dejó preparados a propósito: la firma de `pickTestableBone` —cuyo comentario ya
nombra `RF-09`/E5— y el único `responder()` de `TestQuestion`. Ninguna función,
componente ni prueba existente pierde su razón de ser.

La única superficie que cambia de forma es `pickTestableBone`, cuyos llamadores
son dos líneas dentro de `TestQuestion`.
