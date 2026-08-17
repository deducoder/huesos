# Story e5.4: Failed-first selection — Plan

> Size: M

## Tasks

**Criterio de corte aprendido en esta épica:** e5.2 y e5.3 partieron en dos
tareas lo que era un solo cambio, porque una cambiaba una firma que la otra
consumía. Aquí `pickTestableBone` cambia de firma y `TestQuestion` la consume,
así que **van juntas en T2** desde el principio, no como sorpresa.

### T1 · La regla de pesos, como función pura

- **Files:** modify `src/domain/quiz.ts`, `src/domain/quiz.test.ts`
- **TDD:** RED — `weightFor` debe dar 1 para un hueso sin registro, 4 con un
  fallo, 3 con un fallo y un acierto, y **1 (no negativo)** con cinco aciertos y
  ningún fallo → GREEN — `max(1, 1 + 3×fallos − 1×aciertos)` → REFACTOR.
- **Satisfies:** el escenario delta del diseño (el suelo) y la base de los
  demás.
- **Verify:** `npx vitest run src/domain/quiz.test.ts` · `./scripts/check`
- **Commit:** `feat(quiz): weight a bone by how often it was missed`

### T2 · La selección ponderada, y sus dos llamadas

Una sola tarea: cambia la firma de `pickTestableBone` y ambas llamadas de
`TestQuestion` dejan de compilar en el mismo instante.

- **Files:** modify `src/domain/quiz.ts`, `src/domain/quiz.test.ts`,
  `src/features/test/TestQuestion.tsx`, `TestQuestion.test.tsx`
- **TDD:** RED — con `progress` y un sorteo determinista barriendo [0,1), un
  hueso con fallos debe salir más veces que uno sin ellos; con registro vacío la
  distribución debe seguir siendo uniforme; y todo preguntable debe conservar
  probabilidad → GREEN — opciones, suma acumulada de pesos y sorteo → REFACTOR.
- **Satisfies:** los cinco escenarios del scope.
- **Verify:** `npx vitest run src/domain/ src/features/test/` · `./scripts/check`
- **Commit:** `feat(quiz): let the misses steer which bone is asked next`

### T3 · Prueba de integración manual — el sesgo, en la aplicación real

- En Chromium, con la aplicación construida: sembrar el `localStorage` con un
  registro donde un hueso concreto acumule muchos fallos, entrar al modo test,
  y contar cuántas veces sale ese hueso en N preguntas contra lo esperado.
- **Verify:** el hueso sembrado sale claramente por encima de su cuota
  uniforme, y aun así aparecen otros — las dos mitades de ADR-005 a la vez.

## Order & risks

- **Execution order:** T1 → T2 → T3. T2 usa la función de T1; T3 necesita todo.
- **Risks:**
  - *Probar el sesgo con `Math.random` y acabar con un test intermitente.* Es
    exactamente el patrón que costó dos sesiones en s1. → El sorteo se inyecta y
    el barrido es determinista: mismos números, mismo resultado, siempre.
  - *Que los pesos se vuelvan un número mágico defendido a posteriori.* → Las
    pruebas fijan el **orden** y el suelo, no las cifras; y ADR-005 ya las
    declara como juicio.
