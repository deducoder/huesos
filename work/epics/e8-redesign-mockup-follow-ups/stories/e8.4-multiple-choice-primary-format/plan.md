# Story e8.4: Multiple choice as primary test format — Plan

> Size: M

## Tasks

### T1 · Modo `choice` por defecto — 3 opciones, ninguna marcada como correcta

- **Files:** modify `src/features/test/TestQuestion.tsx`,
  `src/features/test/TestQuestion.test.tsx`
- **TDD:** RED — con `answerFormat` sin especificar (default), montar
  `TestQuestion` debe mostrar exactamente 3 botones dentro de
  `role="group"`, ninguno con `aria-pressed="true"`, y el botón
  "Responder" deshabilitado; los 3 nombres deben ser reales del catálogo,
  uno de ellos `bone.es` del hueso preguntado. **En el mismo commit**, los
  ~11 `render(...)` existentes agregan `answerFormat="open"` — necesario:
  sin esto, cambiar el default rompe todos los tests del modo escrito a la
  vez, no incrementalmente → GREEN — nuevo estado `opciones` (calculado
  una vez por pregunta con `[bone, ...pickDistractors(bone, bones)]`,
  mezclado), nuevo estado `seleccionId`; el `<form>` de texto libre se
  condiciona a `answerFormat === 'open'` (default `'choice'`) →
  REFACTOR.
- **Satisfies:** escenario "se muestran 3 botones... ninguno marcado" del
  scope; must-data-010 (mitad render).
- **Verify:** propiedad — con `answerFormat` sin especificar, jamás
  aparece un `<input type="text">` ni un botón marcado antes de
  responder; forced mutation: quitar la condición `answerFormat ===
  'open'` del `<form>` (dejarlo siempre montado) → el test nuevo de "no
  hay campo de texto en el modo por defecto" debe fallar. Luego
  `npx vitest run src/features/test/TestQuestion.test.tsx` ·
  `./scripts/check`.
- **Commit:** `feat(test): render three unmarked options as the default answer format`

### T2 · Responder en modo `choice` — calificar y registrar

- **Files:** modify `src/features/test/TestQuestion.tsx`,
  `src/features/test/TestQuestion.test.tsx`
- **TDD:** RED — elegir la opción correcta y confirmar con "Responder"
  debe mostrar "Correcto" y registrar `{correct: 1, incorrect: 0}` para
  ese hueso; elegir una incorrecta debe mostrar "Incorrecto" +
  `bone.es`/`bone.la` (mismo panel que el modo escrito) y registrar
  `{correct: 0, incorrect: 1}`; "Responder" sigue deshabilitado hasta
  elegir una opción → GREEN — al confirmar, calificar con
  `seleccionId === bone.id` (nunca `isCorrectAnswer` — comparación exacta
  de id, no de texto tolerante), reusar `recordAnswer` y el bloque de
  resultado que el modo escrito ya renderiza → REFACTOR.
- **Satisfies:** los dos escenarios de responder del scope
  ("Correcto"/"Incorrecto", mismo registro que hoy).
- **Verify:** propiedad — el veredicto registrado coincide con
  `seleccionId === bone.id`, nunca con una comparación de texto; forced
  mutation: calificar con `isCorrectAnswer(seleccionId, bone)` en vez de
  la comparación exacta de id → un test que elige un distractor cuyo
  `es` normalizado coincidiera por accidente con el correcto (o
  viceversa) debería fallar — cubierto indirectamente por el test de
  "responder mal registra fallo" ya que cualquier resultado inesperado
  lo rompe. Luego `npx vitest run src/features/test/TestQuestion.test.tsx`
  · `./scripts/check`.
- **Commit:** `feat(test): grade the choice format by exact bone id`

### T3 · Guardrail `must-data-010` y corrección de la pista accesible

- **Files:** modify `governance/guardrails.md`,
  `src/features/test/SkeletonTestView.tsx`,
  `src/features/test/BoneTestView.tsx`,
  `src/features/test/SkeletonTestView.test.tsx` (o el que exista),
  `src/features/test/BoneTestView.test.tsx` (o el que exista)
- **TDD:** RED — un test que lea el `sr-only` de `SkeletonScene`/
  `IsolatedBoneScene` montado por cada vista no debe contener "escribí" →
  GREEN — cambiar el texto de `accessibleHint`/`accessibleLabel` a algo
  que describa elegir entre opciones → REFACTOR. Agregar la fila
  `must-data-010` a `governance/guardrails.md` (ver ADR-012 para el texto
  exacto), con la verificación apuntando a los tests de T1/T2 más el de
  esta tarea.
- **Satisfies:** el escenario delta de `design.md` (pista accesible
  desactualizada); `must-data-010` completo (render + grading ya
  cubiertos por T1/T2, este task lo declara en la tabla de guardrails).
- **Verify:** propiedad — ningún texto accesible de las vistas de test
  instruye a escribir; forced mutation: revertir el string a "Escribí su
  nombre..." → el test nuevo debe fallar. Luego
  `npx vitest run src/features/test/` · `./scripts/check`.
- **Commit:** `docs(test): describe the choice answer format in the scene hint and add its guardrail`

### T4 · Verificación manual — recorrido real en el navegador

- Con la aplicación construida y servida: entrar a Test → Esqueleto
  completo (`RF-04`) y a Test → Hueso aislado (`RF-05`); confirmar que
  aparecen 3 botones (no un campo de texto), que "Responder" arranca
  deshabilitado, que elegir una opción lo habilita, y que responder bien
  y mal muestra el resultado correcto. Repetir "Siguiente pregunta" varias
  veces para confirmar que las 3 opciones cambian de posición entre
  preguntas (criterio Should del diseño) y que ningún hueso preguntado se
  repite de inmediato (comportamiento ya existente, no debe romperse).
- Con lector de pantalla o revisando el DOM: confirmar que la pista
  accesible de la escena ya no dice "escribí".
- **Verify:** recorrido completo sin campo de texto visible en ningún
  punto del flujo por defecto; los 3 botones siempre muestran nombres de
  hueso reales y distintos entre sí (sin etiquetas duplicadas — mismo
  criterio que e8.3 verificó en el dominio, ahora observado en la UI real).

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. T2 necesita las opciones que T1
  renderiza; T3 es independiente en código pero se apoya en que T1/T2 ya
  existan para escribir la fila de guardrail con precisión; T4 valida
  todo junto.
- **Dependencies:** estrictamente secuencial.
- **Riesgos:**
  - Actualizar ~11 `render(...)` en `TestQuestion.test.tsx` con
    `answerFormat="open"` en T1 es mecánico pero extenso — riesgo de
    dejar alguno sin actualizar y que falle por una razón distinta a la
    que el test pretende probar. Mitigación: correr el archivo completo
    después de T1, no solo los tests nuevos.
  - El shuffle de opciones (Should, dentro de T1) es la única pieza sin
    `sorteo` inyectable de esta historia — si algún test futuro necesita
    fijar el orden, tendrá que agregarse esa plomería entonces (yagni
    hoy, ver `design.md`).
