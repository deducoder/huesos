# Epic E7: Mobile-first redesign — Retrospective

## Summary

Las seis vistas de la aplicación (Explorar, Fichas, Ficha completa, Elegir
test, Test sobre esqueleto, Test sobre hueso) se rediseñaron sobre un único
sistema de tokens (`@theme`, ADR-007), con el mínimo táctil de 44×44px
garantizado en las 209 posiciones que antes lo incumplían, el lienzo 3D
utilizable en 390×844 en vez de sus 150px intrínsecos, tipografía propia
empaquetada (ADR-008), y el escritorio ampliado desde el móvil en vez de
heredado sin ajustar (e7.9). `should-perf-007`, sin medición desde E2, quedó
medido (mediana 4,8ms bajo CPU 4x, ~20x por debajo del umbral) y su texto
corregido para dejar de contradecir ADR-001.

## Metrics

- Stories: 10 · Estimadas estrictamente iguales a lo real en 9/10.
- e7.9 fue la única desviación: estimada M, real S — el gemba de diseño
  (confirmar que era el mismo patrón `md:max-w-*` tres veces) ya había hecho
  el trabajo difícil antes de planificar.
- 2 ADRs superseded dentro del propio epic (ADR-009 → ADR-010), documentando
  una corrección de rumbo medida (regresión de precisión en los tests de
  b2.x), no una indecisión.
- 1 hallazgo cerrado durante epic-review (color de resaltado 3D fuera del
  sistema de tokens, `fix(scene): read the selection highlight from the
  design token`) — ningún story individual lo habría visto: ninguna historia
  tocó a la vez `SkeletonScene.tsx` y el sistema de tokens.
- 4 hallazgos aparcados con destino concreto: e7.11 (navbar), e7.12 (Fichas
  acordeón), e7.13 (test de opción múltiple), y el marcador "▸" en filas de
  par colapsado + la pasada de cohesión visual conjunta (ambos con destino
  "pulido visual al cierre de la épica", explícitamente saltado por decisión
  del usuario al llegar a ese punto).

## Scope verification

- **MUST: sistema de tokens único** → **Fulfilled**, con una corrección
  durante esta revisión — `src/components/SkeletonScene.tsx` tenía un color
  de resaltado 3D (`#38bdf8`) hardcodeado desde antes del epic (E2), nunca
  migrado a `--color-acento`. Corregido en
  `fix(scene): read the selection highlight from the design token` antes de
  cerrar esta revisión — no quedó como hallazgo aparcado porque "finish it"
  es una salida válida que el propio paso 3 de esta skill ofrece.
- **MUST: las seis vistas bajo ADR-007** → **Fulfilled** — e7.1 (shell),
  e7.5+e7.6 (Explorar), e7.5+e7.7 (Ficha), e7.8 (las tres de test).
- **MUST: lienzo utilizable en 390×844** → **Fulfilled**, `e2e/mobile-shell.spec.ts`.
- **MUST: todo objetivo interactivo ≥44×44px** → **Fulfilled**, mismo spec,
  contra la línea base de 209/209 bajo el mínimo registrada en el brief.
- **MUST: tipografía servida del propio bundle** → **Fulfilled**, ADR-008,
  `e2e/mobile-shell.spec.ts` ("el título usa la familia display empaquetada").
- **MUST: `should-perf-007` medido** → **Fulfilled**, e7.10 — mediana 4,8ms,
  máximo 15,2ms bajo CPU 4x, muy por debajo de 100ms.
- **SHOULD: el escritorio gana con el rediseño** → **Fulfilled**, e7.9 —
  navegador visible como barra lateral, contenido acotado en las tres vistas
  que se estiraban sin límite.
- **SHOULD: el navegador de 206 huesos más rápido de recorrer** →
  **Fulfilled**, e7.4 — filas por par en vez de 206 entradas planas,
  verificado en `e2e/mobile-shell.spec.ts` ("el navegador entero recorre
  más corto que antes de e7.4").
- **Out of scope respetado** — sin búsqueda/filtros, sin animación, sin modo
  oscuro, sin progreso visible al estudiante, sin router: confirmado por
  ausencia (`grep` sin resultados sobre `dark:`, `prefers-color-scheme`,
  librerías de router o animación en `package.json`).
- **Done when — tests de accesibilidad verdes sin reescribirse** →
  **Fulfilled con una excepción documentada**: dos aserciones sobre
  "martillo izquierdo" se actualizaron en e7.4 porque el comportamiento
  cambió a propósito (huesos sin geometría en ningún lado colapsan a una
  sola fila — elegir lado deja de distinguir nada observable). No es una
  prueba debilitada; es una prueba que sigue el comportamiento correcto tras
  una decisión de arquitectura de información ya documentada con su propio
  ADR-la-decisión-de-e7.4.

## What went well

- El patrón "medir con Playwright real antes de escribir CSS" se sostuvo
  las diez historias: cada `md:`/`min-h-tactil`/token nuevo tuvo un RED real
  contra el layout de hoy, no una suposición sobre cómo se vería.
- La corrección ADR-009→ADR-010 mostró que "superseded, no editado" funciona
  bajo presión real: un mockup completo llegó a mitad del epic, se
  descompuso en lo que cabía, lo que reabría trabajo cerrado y lo que era
  alcance nuevo, y las tres categorías se aparcaron con destino concreto en
  vez de decidirse de una sola vez.

## What to improve

- El texto de `should-perf-007` llevaba desde E2 describiendo una opción que
  ADR-001 había rechazado (el SVG, no el glTF que el proyecto usa) sin que
  nada lo marcara como contradicción — un guardrail necesita, además de un
  ADR vigente, que alguien relea sus *opciones* de tanto en tanto, no solo
  su estado.
- El color de resaltado 3D quedó fuera del sistema de tokens durante nueve
  historias enteras sin que ninguna lo detectara — porque ninguna historia
  tocó a la vez la escena y los tokens. Es exactamente el tipo de hallazgo
  que esta skill (paso 3, re-lectura del scope contra el código real, no
  contra "todas las historias cerradas") existe para atrapar, y lo atrapó.

## Learned

1. **Sobre el sistema:** un criterio de "ningún color a mano" escrito
   pensando en clases Tailwind puede tener una instancia real en un
   lenguaje completamente distinto (un `Color` de three.js) que ninguna
   búsqueda de utilidades CSS iba a encontrar sola — hizo falta ampliar la
   búsqueda a literales hex crudos, no solo a nombres de clase.
2. **Sobre el proceso:** el patrón "finish it or explicitly re-scope"
   del paso 3 de esta skill funcionó tal como está escrito — el hallazgo del
   color se resolvió ahí mismo con TDD normal (RED con el test de fuente
   existente, GREEN leyendo `--color-acento` en tiempo de ejecución), sin
   necesidad de abrir una historia nueva para dos líneas de cambio.
3. **Capacidad ganada:** la aplicación pasa de "funciona en escritorio y se
   ve en el teléfono" a "diseñada desde el teléfono hacia arriba, medida en
   los dos extremos" — con una medición de rendimiento real donde antes
   había una casilla de gobernanza sin evidencia.
