# Story e8.3: Plausible distractors — Plan

> Size: XS

## Tasks

### T1 · `pickDistractors` — caso típico

- **Files:** create `src/domain/distractors.ts`, `src/domain/distractors.test.ts`
- **TDD:** RED — con el catálogo real, `pickDistractors(femurDerecho, catalog)`
  debe devolver 2 huesos, ambos `region: 'lower-limb'`, ninguno
  `'femur-right'`, distintos entre sí, ambos con `meshName !== null` → GREEN —
  filtrar el catálogo por región y `meshName !== null`, excluir el propio
  hueso, elegir 2 con el `sorteo` inyectable (default `Math.random`) →
  REFACTOR.
- **Satisfies:** escenario típico del scope ("región con 3+ huesos
  preguntables").
- **Verify:** propiedad — nunca incluye el hueso preguntado ni repite
  ninguno; forced mutation: quitar el filtro que excluye `bone.id` del pool
  de candidatos → el test de "nunca el mismo hueso" debe fallar. Luego
  `npx vitest run src/domain/distractors.test.ts` · `./scripts/check`.
- **Commit:** `feat(domain): add plausible distractor picker for same-region bones`

### T2 · Caso límite, catálogo insuficiente y determinismo

- **Files:** modify `src/domain/distractors.ts`, `src/domain/distractors.test.ts`
- **TDD:** RED — tres pruebas: (a) `pickDistractors(coxalDerecho, catalog)`
  (región `pelvic-girdle`, solo 2 preguntables en total) debe devolver 2
  huesos igual, con `hip-bone-left` entre ellos y el segundo de otra
  región; (b) `pickDistractors(femurDerecho, [femurDerecho])` debe lanzar;
  (c) el mismo `sorteo` inyectado dos veces produce el mismo resultado →
  GREEN — cuando el pool de la misma región (menos el propio hueso) tiene
  menos de `count` candidatos, completar desde el resto del catálogo
  preguntable; lanzar si ni así se alcanza `count` → REFACTOR.
- **Satisfies:** los dos escenarios de `scope.md` (límite, determinismo) más
  el escenario delta de `design.md` (catálogo insuficiente lanza).
- **Verify:** propiedad — el conteo devuelto es siempre exactamente
  `count` cuando existen `count+1` huesos preguntables en el catálogo, y
  lanza en caso contrario; forced mutation: quitar la rama de relleno
  desde el resto del catálogo → el test de `pelvic-girdle` debe fallar
  (devuelve menos de 2). Luego
  `npx vitest run src/domain/distractors.test.ts` · `./scripts/check`.
- **Commit:** `feat(domain): fall back to the full catalog when a region lacks enough distractors`

### T3 · Verificación manual — huesos reales de punta a punta

No hay UI que levantar: la "prueba de integración manual" de una función de
dominio pura es correrla contra el catálogo real completo, no contra
huesos sintéticos de un test.

- Con un script ad hoc (`npx tsx` o equivalente) importar `catalog` real y
  `pickDistractors`, y correrlo sobre un hueso de cada una de las 8
  regiones que tienen huesos preguntables (incluida `pelvic-girdle`) más
  `ear`/`hyoid` para confirmar que, como no tienen huesos preguntables,
  nunca son ellos mismos la pregunta (fuera del alcance de esta función,
  pero vale confirmarlo antes de que e8.4 lo asuma).
- **Verify:** para cada hueso preguntable de las 8 regiones, los 2
  distractores impresos son huesos reales, con nombre en español legible,
  nunca el hueso preguntado, nunca repetidos entre sí — revisión visual
  del output, no solo el conteo.

### T2b · Excluir hermanos anatómicos (agregada durante T3, no estaba planeada)

La verificación manual (T3, más abajo) encontró que `es` no lleva el lado
—`clavicle-right`/`clavicle-left` comparten `es: 'clavícula'`— así que
`pickDistractors` podía elegir el hermano anatómico del hueso preguntado, o
dos hermanos entre sí como los dos distractores, mostrando la misma
etiqueta dos veces en una opción múltiple.

- **Files:** modify `src/domain/distractors.ts`, `src/domain/distractors.test.ts`
- **TDD:** RED — `clavicle-right` (región `shoulder-girdle`, 4 preguntables)
  nunca debe traer `clavicle-left` como distractor, y los dos distractores
  nunca deben compartir `es` entre sí → GREEN — excluir `siblingId(bone)`
  del pool inicial, y quitar el hermano del candidato recién elegido en
  cada iteración → REFACTOR.
- **Verify:** propiedad — ningún par de huesos devueltos (correcto +
  distractores) comparte `es`; forced mutation: no quitar el hermano del
  elegido tras cada `extraerAlAzar` → el test de "tampoco elige dos
  distractores que sean hermanos entre sí" debe fallar.
- **Commit:** `fix(domain): never let a distractor share its label with the correct bone or another distractor`

## Order & risks

- **Execution order:** T1 → T2 → T3. T2 modifica la misma función que T1
  crea; T3 valida el resultado final contra datos reales.
- **Dependencies:** estrictamente secuencial — no hay paralelismo posible
  dentro de una historia de un solo archivo de dominio.
- **Riesgos:** el único riesgo real de la historia (el caso límite de
  `pelvic-girdle`) ya se cerró en el diseño, no queda abierto para
  implementación — T2 es donde se prueba, no donde se descubre.
- **Riesgo que el diseño no anticipó:** el nombre en español no distingue el
  lado. T3 lo encontró; T2b lo cerró. Queda documentado para que e8.4 (o
  cualquier otra vista que muestre `es` solo) no lo reintroduzca.
