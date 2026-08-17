# Session 2026-08-17 — s1 verificada, E5 y E6, producto publicable

## Done

- **s1 cerrada y enviada.** El gate de navegador nunca había estado verde. La
  causa no era la GPU ni el sandbox: `esperarEscena` medía el `<canvas>` cuando
  aún medía `300x150` —su tamaño intrínseco— y pulsaba (470,128), una esquina
  vacía, durante los 60 s del poll. Con la caja medida tras el layout, las 4
  pruebas pasan en 1,6 min, incluida la de la rejilla que llevaba pausada.
- **E5 — Progreso y repaso dirigido** (5 historias, tag `epic/e5-complete`,
  publicada). `RF-09` completo: el registro por hueso persiste en
  `localStorage`, sobrevive a la recarga —verificado en Chromium— y pondera la
  siguiente pregunta. Medido en la aplicación real: un hueso sembrado con 30
  fallos se lleva 10 de 50 preguntas y aun así salen 32 huesos distintos.
  `must-privacy-006` pasó de promesa a dos gates que se vieron ponerse rojos.
- **E6 — Condición de lanzamiento** (3 historias, tag `epic/e6-complete`,
  publicada). No era la épica que el backlog decía: el catálogo estaba completo
  desde E1. Lo que quedaba era que `RF-08` exigía geometría a siete huesos que
  el proyecto decidió no cubrir, así que **la condición de lanzamiento era
  imposible por construcción**. ADR-006 la cierra; `RF-08` ya dice lo que la
  prueba ejecuta.
- **Repositorio sin residuos:** las seis épicas etiquetadas (E3 y E4 nunca lo
  habían estado), rama huérfana `story/e3.1` borrada, una sola rama viva.
- **Tests 141 → 190**, más 4 de navegador. 7 aprendizajes nuevos en
  `.claude/memory/`.

## Decided

- **`RF-08` se re-alcanza en vez de conseguir la geometría de los siete
  huesos** (ADR-006) — **why:** el catálogo cubre 206 y el modelo 199; confundir
  las dos coberturas era lo que bloqueaba el lanzamiento. Una entrada con razón
  documentada está completa; lo que le falta es geometría, que es atributo del
  activo 3D y no de la entrada. La opción de conseguir las mallas queda
  **diferida, no rechazada**: exige activo nuevo, licencia y vistas propias.
- **`localStorage` síncrono con degradación explícita a memoria** (ADR-004) —
  **why:** 206 pares de enteros ocupan 9,6 KB medidos (0,19 % del límite); la
  asincronía de IndexedDB contagiaría `async` a todo el motor de test para nada.
  En modo privado el progreso vive la sesión y no sobrevive a la recarga.
- **Ponderación por fallos, no cola estricta** (ADR-005) — **why:** "preguntar
  esos primero" como sesgo estadístico mantiene el catálogo entero alcanzable;
  una cola estricta encierra al estudiante en los diez huesos que falló temprano
  y frena el material nuevo. Los pesos son un juicio declarado, no una medición,
  y las pruebas fijan el orden y no las cifras.
- **Los tags de E1 y E2 se dejan con el nombre en inglés** aunque los otros
  cuatro vayan en español — **why:** llevan publicados desde el 16 y reescribir
  un tag publicado por una diferencia cosmética hace más ruido del que arregla.
- **El 403 del proxy que el handoff anterior culpaba no existía.** Los tags de
  E3 y E4 nunca se habían creado; el push funciona sin resistencia desde esta
  máquina.

## Open

Ninguna. Todo lo que quedó nombrado tiene destino escrito en
`records/parking-lot.md`: `should-perf-007` (declara una medición manual de la
que no hay rastro en E2 — mismo síntoma que se arregló en `must-privacy-006`),
la auditoría de contenido del catálogo, mostrar y reiniciar el progreso, la
duplicación validador↔tipo con su disparador, y la geometría de los siete.

## Next

Decidir qué se hace con el producto ahora que es publicable: o se publica —no
hay épica de despliegue y el proyecto no tiene una declarada—, o se abre la
siguiente del parking lot. La candidata con más valor es **la auditoría de
contenido del catálogo**: los sinónimos se eligieron con criterio propio y nadie
los validó contra cómo escriben los estudiantes, y el modo test los da por
válidos desde E4.

## State

Branch `main` = `origin/main` = `15dbe59` · work item in flight: none · tree:
clean · 190 tests unitarios y 4 de navegador en verde · seis épicas cerradas y
etiquetadas.
