# Story e5.1: Progress record — Plan

> Size: S

## Tasks

One commit per task, in execution order (riskiest first).

### T1 · El registro y la lectura de un hueso

- **Files:** create `src/domain/progress.ts`, `src/domain/progress.test.ts`
- **TDD:** RED — consultar un hueso en un registro vacío debe devolver
  `{ aciertos: 0, fallos: 0 }`, y hoy el módulo no existe → GREEN — el tipo del
  registro, la constante del registro vacío y `boneProgress(registro, id)` que
  devuelve el estado inicial cuando el `id` no está → REFACTOR.
- **Satisfies:** "Given un registro vacío / When se consulta cualquier hueso /
  Then devuelve cero aciertos y cero fallos, nunca `undefined`".
- **Verify:** `npx vitest run src/domain/progress.test.ts` · `./scripts/check`
- **Commit:** `feat(progress): read a bone's record, absent meaning never asked`

### T2 · Anotar un veredicto sin mutar

- **Files:** modify `src/domain/progress.ts`, `src/domain/progress.test.ts`
- **TDD:** RED — anotar un acierto sobre un hueso con 2 fallos debe dejarlo en
  1 acierto y 2 fallos, y el registro recibido debe quedar intacto → GREEN —
  `recordAnswer(registro, id, acertó)` devolviendo un registro nuevo → REFACTOR.
- **Satisfies:** los tres escenarios restantes — acierto sobre registro vacío,
  acierto que no borra fallos, y pureza (el registro recibido no se modifica).
- **Verify:** `npx vitest run src/domain/progress.test.ts` · `./scripts/check`
- **Commit:** `feat(progress): record a verdict without mutating the record`

### T3 · Prueba de integración manual — el dato real, a escala real

Este módulo no tiene interfaz que abrir, así que "con el software corriendo"
significa ejecutarlo contra los datos de verdad, no contra ids inventados:

- Construir un registro con **los 206 ids reales del catálogo** y contadores
  arbitrarios, pasarlo por `JSON.stringify` / `JSON.parse` y comprobar que
  vuelve equivalente.
- **Medir** cuántos bytes ocupa ese registro serializado, y contrastarlo con la
  premisa que ADR-004 dio por buena ("unos pocos kilobytes contra el límite
  práctico de 5 MB"). Si la medición contradice el ADR, es un hallazgo, no un
  detalle: el ADR se supersede, no se edita.
- **Verify:** el registro completo vuelve igual tras la ida y vuelta, y el
  tamaño medido queda registrado en `progress.md` — un número medido, no
  estimado.

## Order & risks

- **Execution order:** T1 → T2 → T3. T1 primero porque fija el tipo del que T2
  depende; T2 es la única con lógica real; T3 necesita las dos.
- **Dependencies:** estrictamente secuencial. Sin ciclos.
- **Risks:**
  - *Sobre-diseñar la forma del dato por ser la primera historia de la épica* —
    el riesgo que `plan.md` de la épica nombra explícitamente. → Ningún campo
    entra que no lo pida un escenario del `scope.md`; los tres candidatos
    tentadores (fecha, variante de test, nivel) ya están declarados fuera.
  - *Que la ida y vuelta por JSON se pruebe solo con ids inventados* — probaría
    la librería, no el dato. → T3 lo corre contra los 206 ids reales. El
    aprendizaje `test-the-data-after-the-library` es de este mismo proyecto y
    de este mismo tipo de descuido.
