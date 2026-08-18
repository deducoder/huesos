# Epic e8: Redesign mockup follow-ups — Design

## Gemba findings

- `src/App.tsx` monta cabecera (`<header>` con `<h1>huesos-mono</h1>`) y
  pestañas (`<Pestanas>`) como dos filas sólidas separadas — construido en
  e7.1 sin ADR propio (fue implementación directa de la dirección visual de
  ADR-007). El mockup las funde en una sola fila flotante: **extender**,
  no ADR — es el mismo tipo de cambio que e7.1 ya hizo, sobre las mismas
  piezas.
- `BoneNavigator` (`src/components/BoneNavigator.tsx`) se monta en **dos**
  lugares distintos: oculto (`sr-only`) dentro de `ExploreView`
  (ADR-010, protegido por `explore.spec.ts` b2.1/b2.2/b2.3), y visible
  dentro de `App.tsx` en el modo `'fichas'`. Solo la segunda instancia
  cambia en esta épica — **releído ADR-010 completo**, no gobierna la
  visible; ver ADR-011.
- `src/domain/navigator-rows.ts` (`toNavigatorRows`) y
  `src/domain/regions.ts` (`groupByRegion`) son funciones puras,
  reutilizables tal cual para el subgrupo del acordeón de Fichas —
  **reuse**, no reimplementar el criterio de pares (`side-pairing.ts`,
  `isSideIrrelevant`).
- `src/components/labels.ts` (`REGION_LABEL`) ya codifica el nivel de
  categoría del mockup sin que nadie lo haya declarado como tal: las
  únicas dos etiquetas con "—" (`cranium`, `face`, ambas "Cráneo — …") son
  exactamente las dos que el mockup agrupa bajo una sola categoría
  "Cráneo". Las 8 regiones restantes son, cada una, su propia categoría de
  un solo subgrupo — **extend**: una función de agrupación nueva deriva la
  categoría de ese prefijo, no una tabla paralela.
- `src/features/test/TestQuestion.tsx` solo acepta respuesta escrita
  (`isCorrectAnswer`, `src/domain/answer-check.ts`) y su prop `renderScene`
  recibe solo el `id` del hueso — nunca el `Bone` — por diseño explícito
  (comentario cita `must-data-003`). `src/domain/quiz.ts`
  (`pickTestableBone`) ya establece el patrón de sorteo inyectable
  (`sorteo?: () => number`) que la función de distractores de e8.3 debe
  seguir para quedar determinista en tests — **follow pattern**.
- `governance/guardrails.md`, `must-data-003`: literal, "ningún nombre de
  hueso llega al DOM en modo test antes de que el usuario responda". La
  opción múltiple no puede cumplir esa redacción por construcción — el
  nombre correcto es una de las 3 opciones visibles. Esto no es un defecto
  del guardrail: es una garantía distinta (indistinguible entre
  candidatos, no ausente) que necesita su propio id — ver ADR-012.
- `governance/prd.md`, `RF-06` ("Respuesta escrita con validación
  tolerante"): describe el comportamiento por defecto actual. Tras e8.4 ya
  no lo es — sigue construido, oculto. No se edita en esta épica (no es
  artefacto de `epic-design`), queda anotado como hallazgo para
  `epic-review`.

## Target components

| Component | Change | Purpose |
|-----------|--------|---------|
| `src/App.tsx` (`Pestanas`, `<header>`) | modify | Fundir cabecera + pestañas + menú en una fila flotante (e8.1). |
| `src/domain/categories.ts` (nuevo) | create | Agrupar `RegionGroup[]` en categorías, derivando el nombre del prefijo de `REGION_LABEL` antes de "—" (e8.2). |
| `src/components/FichasAccordion.tsx` (nuevo, nombre indicativo) | create | Reemplaza el `<BoneNavigator>` visible del modo `'fichas'` en `App.tsx`; usa `categories.ts` + `toNavigatorRows` (e8.2). |
| `src/components/BoneNavigator.tsx` | none | Sin cambios — sigue exclusivo de `ExploreView` oculto (ADR-010/ADR-011). |
| `src/domain/distractors.ts` (nuevo, nombre indicativo) | create | `pickDistractors(bone, catalog, opciones)`: 2 huesos del mismo `region`, sorteo inyectable como `pickTestableBone` (e8.3). |
| `src/features/test/TestQuestion.tsx` | modify | Opción múltiple por defecto (usa `distractors.ts`); rama de formato escrito permanece en el componente, sin botón que la active (e8.4, ADR-012). |
| `governance/guardrails.md` | modify | Agrega `must-data-010` (opción múltiple, ver ADR-012) — lo hace e8.4, con la verificación ya escrita, no epic-design. |

## Key contracts

- `groupByRegion` y `toNavigatorRows` no cambian su firma ni su
  comportamiento — el acordeón los consume, no los envuelve con lógica
  nueva de pares.
- La función de agrupación por categoría (e8.2) es pura y testeada por sí
  misma: dado el catálogo completo, produce las mismas 2 categorías que el
  mockup insinúa (Cráneo con 2 subgrupos; las demás con 1) — el test lo
  fija en vez de dejarlo implícito en el `split('—')`.
- `pickDistractors` (e8.3) nunca devuelve el hueso preguntado entre sus
  distractores, y su firma sigue el mismo patrón de `PickOptions` que
  `pickTestableBone` (`sorteo` inyectable) para que e8.4 lo pueda testear
  sin `Math.random`.
- `TestQuestion.test.tsx` (guardián de `must-data-003`) sigue verde sin
  editarse — es la prueba de que ocultar el formato escrito no lo rompió.
- `BoneNavigator`, `explore.spec.ts` y ADR-010 quedan bit a bit
  intactos — ninguna historia de esta épica los toca.

## Decisions (ADRs)

- [ADR-011](../../../records/decisions/adr-011-fichas-accordion-does-not-touch-hidden-navigator.md): Fichas se reestructura en acordeón de dos niveles; el navegador oculto de Explorar no se toca — corrige la suposición del parking lot de que había que superseder ADR-010.
- [ADR-012](../../../records/decisions/adr-012-multiple-choice-becomes-primary-test-format.md): la opción múltiple pasa a ser el formato primario del test; el formato escrito queda oculto, no eliminado, y `must-data-003` se mantiene sin editar porque sigue describiendo con exactitud el código que gobierna.

## Legacy sweep

Nada queda huérfano: el `<BoneNavigator>` visible que `App.tsx` monta hoy
en el modo `'fichas'` se reemplaza por el componente nuevo del acordeón (su
código de render en `App.tsx` se borra con e8.2; el componente
`BoneNavigator` en sí sigue vivo, usado por `ExploreView`). El formato
escrito de `TestQuestion` no queda huérfano por decisión explícita del
usuario — sigue cubierto por su test (ADR-012).
